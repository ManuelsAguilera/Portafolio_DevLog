# Arquitectura de backend — Portafolio personal

## 1. Alcance del proyecto

El sitio es un portafolio personal que centraliza mi presencia digital (canal de YouTube, GitHub, redes sociales) y ofrece dos canales de interacción con visitantes: recibir sugerencias/feedback y notificarlos sobre contenido nuevo.

### Secciones del sitio

| Sección | Descripción | Prioridad |
|---|---|---|
| **Página principal** | Enlaces a YouTube, GitHub y redes sociales | Alta |
| **Sugerencias** | Formulario simple para recibir feedback e ideas | Alta |
| **Proyectos** | Listado de proyectos pasados, actuales y futuros | Alta |
| **Notificaciones** | Suscripción para avisar sobre nuevos videos/noticias | Alta |
| **Interactivo (juego)** | Mini-juego o sección lúdica para "registrar" visitantes | Futuro |

> El juego queda fuera del alcance inicial. La sección de sugerencias cumple temporalmente el rol de "elemento interactivo" para captar participación de los visitantes.

### Fuera de alcance (por ahora)
- Registro/login de **visitantes**
- Sistema de comentarios con moderación
- Mini-juego interactivo

> Nota: "sin registro" aplica a los visitantes del sitio. Como desarrollador sí necesito una vía propia de acceso para administrar contenido (ver sección 6).

---

## 2. Arquitectura general

**Stack elegido:** Next.js (frontend, hospedado en Vercel) + Firebase (backend serverless)

```
Usuario → Next.js (Vercel) → Firestore (guarda datos)
                                   ↓
                          Cloud Function (trigger)
                                   ↓
                    ┌──────────────┴──────────────┐
                FCM (push)                  Resend/SendGrid (email)
```

**Por qué esta combinación:**
- No hay servidor propio que mantener corriendo (todo es serverless)
- Firestore + Cloud Functions cubren base de datos y lógica de notificaciones
- Next.js en Vercel tiene deploy automático desde GitHub
- Tier gratuito suficiente para el tráfico esperado de un portafolio

---

## 3. Modelo de datos (Firestore)

Firestore es una base de datos NoSQL orientada a documentos. No hay tablas ni relaciones formales: cada colección agrupa documentos con estructura similar.

### Colección: `suggestions`
Guarda las sugerencias enviadas desde el formulario.

```json
{
  "name": "María",
  "email": "maria@mail.com",
  "message": "Sería genial un video sobre X",
  "createdAt": "2026-07-01T10:00:00Z",
  "read": false
}
```

### Colección: `pushSubscriptions`
Guarda los tokens de dispositivos suscritos a notificaciones push.

```json
{
  "token": "eXaMpLeTOKEN123...",
  "createdAt": "2026-07-01T10:00:00Z"
}
```

### Colección: `emailSubscribers`
Guarda los correos suscritos a notificaciones por email.

```json
{
  "email": "maria@mail.com",
  "subscribedAt": "2026-07-01T10:00:00Z",
  "confirmed": true
}
```

### Colección: `projects`
Guarda los proyectos mostrados en la sección de proyectos, incluyendo el contenido del miniblog de cada uno.

```json
{
  "title": "App de recetas",
  "description": "Aplicación web para organizar recetas propias",
  "status": "actual",
  "link": "https://github.com/usuario/proyecto",
  "content": "## La idea\n\nQuería un lugar para guardar mis recetas sin publicidad...\n\n## Desafíos\n\n...",
  "createdAt": "2026-06-01T00:00:00Z"
}
```
> `status` puede ser `"pasado"`, `"actual"` o `"futuro"`. El campo `content` es el texto del miniblog (en markdown), renderizado en la página de detalle del proyecto.

**Sobre el miniblog:** cada proyecto tiene *un* miniblog (no una serie de posts), así que basta con este campo `content` dentro del mismo documento — no hace falta una subcolección aparte. Si en el futuro quisieras publicar actualizaciones de progreso a lo largo del tiempo (como un changelog por proyecto), ahí sí tendría sentido pasar a una subcolección `projects/{projectId}/updates/{updateId}`, pero no es necesario para el alcance actual.

---

## 4. Flujos principales

### 4.1 Envío de sugerencia

1. El visitante llena el formulario en la página de sugerencias
2. El frontend escribe directo en Firestore (colección `suggestions`), usando el SDK de Firebase
3. El `write` dispara una Cloud Function (`onCreate`)
4. La función notifica al administrador (a mí) — no al visitante — por email y/o push, avisando que llegó una sugerencia nueva

### 4.2 Suscripción a notificaciones (push)

1. El visitante acepta permisos de notificación en el navegador
2. El frontend obtiene un token único vía Firebase Cloud Messaging (FCM)
3. Se guarda ese token en Firestore (colección `pushSubscriptions`)
4. Cuando publico contenido nuevo, disparo manualmente (o vía Cloud Function) un mensaje a todos los tokens guardados

### 4.3 Suscripción a notificaciones (email)

1. El visitante ingresa su correo en un formulario simple
2. Se guarda en Firestore (colección `emailSubscribers`)
3. Al publicar contenido nuevo, una Cloud Function o script recorre la colección y envía un email vía Resend/SendGrid a cada suscriptor

### 4.4 Publicación de contenido nuevo (proceso manual, por mí)

1. Subo el video/noticia a YouTube o donde corresponda
2. Actualizo (manualmente por ahora) la fuente de "novedades" — puede ser un documento en Firestore o un trigger manual
3. Esto dispara el envío de notificaciones push + email a los suscriptores

---

## 5. Administración de contenido (proyectos y miniblogs)

Los visitantes no tienen cuentas, pero yo (como desarrollador) necesito una forma de agregar y editar proyectos sin tocar código cada vez. Esto es un problema separado del "sin registro" de la sección 1 — es acceso de administrador, no de usuario público.

### Opciones, de más simple a más completa

| Opción | Cómo funciona | Esfuerzo | Cuándo usarla |
|---|---|---|---|
| **Firebase Console** | Agrego/edito documentos manualmente desde la web de Firebase | Ninguno, ya existe | Ahora mismo, mientras hay pocos proyectos |
| **Script de admin (local)** | Un script de Node con el Admin SDK de Firebase que corro desde mi máquina para subir un proyecto nuevo | Bajo | Si prefiero escribir en mi editor de código en vez de una web |
| **Contenido vía Git** | El `content` de cada proyecto vive como archivo markdown en el repo, no en Firestore | Bajo-medio | Si prefiero versionar el contenido junto al código |
| **Panel `/admin` propio** | Una ruta oculta protegida con Firebase Auth, con **una sola cuenta permitida: la mía** | Medio | Cuando el Firebase Console se vuelva incómodo |

### Plan recomendado
Empezar con el **Firebase Console** — cero desarrollo extra y suficiente para pocos proyectos. Cuando resulte tedioso escribir markdown ahí, construir el panel `/admin`:

1. Crear mi cuenta manualmente en Firebase Auth (no hay flujo de registro público)
2. Regla de seguridad: `allow write: if request.auth.uid == "MI_UID_ESPECIFICO"` en `projects`
3. Un formulario simple en `/admin` para crear/editar proyectos y su `content`

Esto no contradice el "sin registro" del sitio: los visitantes jamás ven ni usan esta ruta.

---

## 6. Seguridad

Como el sitio acepta escritura pública sin login, hay riesgos concretos a mitigar antes de lanzar:

### Riesgos y mitigación

| Riesgo | Descripción | Mitigación |
|---|---|---|
| **Spam / abuso de escritura** | Nada impide que un bot mande miles de sugerencias o suscripciones falsas | Firebase App Check (verifica que la escritura venga de la app real) + reCAPTCHA v3 invisible en los formularios |
| **Suscripción de emails ajenos** | Cualquiera puede suscribir el correo de otra persona sin su consentimiento | Double opt-in: enviar email de confirmación antes de marcar `confirmed: true`; solo notificar a confirmados |
| **XSS en el contenido del miniblog** | Si el `content` markdown se renderiza como HTML sin sanitizar, y en el futuro se vuelve editable desde algo menos controlado que el Firebase Console, se abre una vía de inyección | Sanitizar con una librería como `DOMPurify` antes de renderizar, incluso si hoy solo yo edito el contenido |
| **Exposición de claves** | Confundir qué claves son públicas y cuáles no | La config del cliente de Firebase (`apiKey`, etc.) es pública por diseño, se protege con Security Rules. Las claves de Resend/SendGrid y la VAPID privada **nunca** van en el frontend, solo en variables de entorno de la Cloud Function |
| **Reglas de Firestore demasiado abiertas** | `allow create: if true` es necesario para el flujo sin login, pero sin más control es riesgoso | Limitar estrictamente a `create` (nunca `update`/`delete`) y validar en la regla misma el tipo y largo máximo de los campos, para evitar payloads maliciosos o gigantes |
| **Acceso de admin mal configurado** | Si la ruta `/admin` solo verifica "está autenticado" en vez de "es exactamente yo", cualquier cuenta de Auth creada por error podría escribir en `projects` | La regla debe comparar `request.auth.uid` contra mi UID específico, no solo validar que exista sesión |

### Reglas de seguridad de Firestore (resumen de acceso)

| Colección | Escritura pública | Lectura pública | Escritura admin |
|---|---|---|---|
| `suggestions` | Sí (solo `create`) | No | — |
| `pushSubscriptions` | Sí (solo `create`) | No | — |
| `emailSubscribers` | Sí (solo `create`) | No | — |
| `projects` | No | Sí | Sí (solo mi UID) |

### Prioridad de implementación
No es urgente con cero tráfico, pero antes de lanzar públicamente conviene tener como mínimo: **App Check + reglas estrictas de `create`-only + double opt-in en email**. El resto (sanitización, panel de admin) puede sumarse progresivamente.

---

## 7. Servicios externos necesarios

| Servicio | Función | Costo |
|---|---|---|
| **Firebase** (Firestore + Cloud Functions + FCM + Auth) | Base de datos, lógica backend, push notifications, autenticación de admin | Gratis en tier bajo |
| **Vercel** | Hosting del frontend Next.js | Gratis en tier bajo |
| **Resend o SendGrid** | Envío de emails | Gratis en tier bajo (límite de emails/mes) |
| **reCAPTCHA v3** | Prevención de spam en formularios públicos | Gratis |

---

## 8. Roadmap sugerido

1. **Fase 1:** Página principal + enlaces a redes + página de proyectos con miniblog (estático, sin backend)
2. **Fase 2:** Formulario de sugerencias + Firestore + notificación al admin + reglas de seguridad básicas
3. **Fase 3:** Suscripción a notificaciones (push y email) para visitantes + double opt-in
4. **Fase 4:** Panel `/admin` con Firebase Auth para gestionar proyectos sin usar el Firebase Console
5. **Fase 5 (futuro):** Sección interactiva / mini-juego