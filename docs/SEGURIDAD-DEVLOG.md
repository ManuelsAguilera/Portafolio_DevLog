# Buenas prácticas de seguridad — Panel de Admin del Devlog (Firebase)

## Contexto
Este proyecto usa **Firebase** (Auth + Firestore/Realtime Database) para un devlog personal. Existe una sola cuenta de administrador que puede crear/editar/eliminar entradas. El resto de visitantes solo debe poder leer.

Al implementar o modificar el panel de admin, sigue estas reglas sin excepción.

---

## 1. Principio rector

**La seguridad vive en el backend (Firebase Security Rules + Firebase Auth), nunca en el frontend.**

- Ocultar o "ofuscar" la ruta del panel (`/admin`, `/panel-xyz`, etc.) **no es una medida de seguridad**. No renombrar rutas como sustituto de autenticación real.
- Cualquier chequeo en React/JS del lado del cliente (ej. `if (!user) redirect()`) es solo para experiencia de usuario (UX), **no protege los datos**. Alguien puede saltarse el frontend y escribir directo a Firestore vía consola o Postman.
- La única barrera real son las **Security Rules** de Firestore/Realtime Database.

---

## 2. Autenticación (Firebase Auth)

- Usar **Firebase Authentication** (email/password o proveedor OAuth) para la cuenta de admin. Nunca contraseñas hardcodeadas en el código ni comparaciones de contraseña en el cliente.
- El UID del admin debe fijarse una sola vez y usarse como referencia en las reglas de seguridad (no depender de roles almacenados de forma insegura o modificables por el cliente).
- Sesión gestionada por el SDK de Firebase (tokens con expiración); no reinventar manejo de sesiones manual.
- Si se agrega verificación de rol (ej. `admin: true` en un documento de usuario), ese campo **debe** ser de solo lectura para el cliente y solo escribible desde el backend/consola de Firebase — nunca editable por el propio usuario autenticado.

## 3. Firestore / Realtime Database Security Rules

Esta es la capa crítica. Ejemplo de patrón correcto para Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /devlog/{entryId} {
      allow read: if true; // contenido público
      allow write: if request.auth != null && request.auth.uid == "UID_DEL_ADMIN";
    }
  }
}
```

Reglas a seguir:
- **Nunca** dejar `allow write: if true` ni reglas de prueba (`allow read, write: if true`) en producción — esto es un error común y muy peligroso al copiar ejemplos de la documentación de Firebase.
- Validar también la **forma de los datos** en las reglas (tipos de campos, longitud máxima de strings, campos requeridos) para evitar que incluso una escritura autenticada inserte datos corruptos o maliciosos.
- Probar las reglas con el **Firebase Emulator Suite** antes de desplegar cambios, no solo confiar en pruebas manuales en producción.

## 4. Frontend / UI del panel

- El chequeo `onAuthStateChanged` en el frontend solo controla qué se **muestra** (ocultar el formulario si no hay sesión), no qué se **permite** — la validación de fondo siempre ocurre en las reglas.
- Sanitizar cualquier input de texto antes de renderizarlo (si el devlog soporta HTML/Markdown, usar una librería de sanitización como `DOMPurify` para evitar XSS al mostrar contenido almacenado).
- No exponer identificadores sensibles (UID de admin, claves de API privadas) en el bundle de JS del cliente más allá de lo estrictamente necesario. La config pública de Firebase (`apiKey`, `projectId`, etc.) es normal que esté en el cliente — no es un secreto — pero cualquier clave de servicio (`service account key`, admin SDK) **nunca** debe ir al frontend.

## 5. Rate limiting y abuso

- Firebase Auth ya limita intentos de login fallidos, pero considerar reglas adicionales o Cloud Functions con verificación de origen si se detecta abuso.
- Si se usa una Cloud Function como intermediario para escrituras (en vez de escritura directa desde cliente), aplicar `express-rate-limit` o equivalente y validar el token de Firebase (`admin.auth().verifyIdToken()`) en cada request.

## 6. Variables de entorno y secretos

- Nunca commitear archivos `.env`, `serviceAccountKey.json`, ni credenciales de servicio al repositorio. Confirmar que están en `.gitignore`.
- Si se usan Cloud Functions, las claves sensibles van en configuración de entorno de Firebase (`firebase functions:config:set` o Secret Manager), no en el código fuente.

## 7. Checklist antes de dar por terminada la feature

- [ ] Las Security Rules exigen `request.auth.uid == UID_ADMIN` (o rol equivalente validado en backend) para cualquier escritura.
- [ ] No existe ninguna regla `allow write: if true` en producción.
- [ ] Las reglas fueron probadas con el Emulator Suite.
- [ ] El frontend no contiene contraseñas, tokens de servicio, ni lógica de autorización que sea la única barrera.
- [ ] Los inputs del panel están sanitizados antes de guardarse y antes de renderizarse.
- [ ] No hay archivos de credenciales en el repositorio (`.gitignore` verificado).
- [ ] La ruta del panel puede tener cualquier nombre (no depende de estar "escondida" para ser segura).

---

**Regla de oro:** si alguien encuentra la URL del panel de admin y no tiene sesión válida con el UID correcto, no debería poder leer ni escribir nada sensible — sin importar qué tan "escondida" estuviera la ruta.
