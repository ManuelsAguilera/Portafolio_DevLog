import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const keyPath = resolve(
  __dirname,
  "../manudevlog-firebase-adminsdk-fbsvc-3656f64ab1.json"
);

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf-8"));

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

type BlogEntry = {
  date: string;
  title: string;
  body: string;
  tags: string[];
};

type Project = {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  link: string;
  status: "past" | "current" | "future";
  tech: string[];
  likes: number;
  blog: BlogEntry[];
};

const projects: Project[] = [
  {
    id: 1,
    slug: "gestion-escolar",
    title: "Sistema de gestión escolar",
    description: "Plataforma web para administrar estudiantes, calificaciones y horarios de un colegio.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=640&h=360&fit=crop&auto=format",
    link: "#",
    status: "past",
    tech: ["React", "Node.js", "PostgreSQL"],
    likes: 0,
    blog: [
      {
        date: "2024-03-10",
        title: "El problema con los sistemas escolares existentes",
        body: "Empecé este proyecto porque la escuela donde da clases mi madre usaba hojas de cálculo para todo. Calificaciones, asistencia, horarios — todo en archivos Excel que se perdían o se corrompían. La primera semana la dediqué a entender el flujo real de trabajo antes de escribir una sola línea de código.",
        tags: ["inicio", "investigación"],
      },
      {
        date: "2024-04-02",
        title: "Diseñando el modelo de datos",
        body: "El mayor reto fue modelar los horarios. Un estudiante puede estar en varios grupos, un profesor puede dar varias materias, y los horarios cambian por semestre. Terminé usando una tabla de relación ternaria entre grupo, materia y profesor, con un campo de periodo para manejar los cambios históricos.",
        tags: ["base de datos", "diseño"],
      },
      {
        date: "2024-05-18",
        title: "Lecciones aprendidas al cerrar el proyecto",
        body: "Lo que más tiempo tomó no fue el código sino la capacitación. Una interfaz perfecta no sirve de nada si los usuarios no saben usarla. Aprendí a diseñar con el usuario final en mente desde el día uno, no como un pensamiento de último momento.",
        tags: ["reflexión", "UX"],
      },
    ],
  },
  {
    id: 2,
    slug: "api-ecommerce",
    title: "API REST de e-commerce",
    description: "Backend con Node.js y PostgreSQL para gestionar productos, órdenes y pagos.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&h=360&fit=crop&auto=format",
    link: "#",
    status: "past",
    tech: ["Node.js", "Express", "PostgreSQL", "Stripe"],
    likes: 0,
    blog: [
      {
        date: "2024-06-05",
        title: "Por qué elegí PostgreSQL sobre MongoDB para esto",
        body: "La mayoría de tutoriales de e-commerce usan MongoDB. Yo quería entender cuándo tiene sentido una base de datos relacional. Los pedidos tienen una estructura muy predecible y las transacciones de pago necesitan garantías ACID que Mongo no ofrece fácilmente.",
        tags: ["base de datos", "decisiones técnicas"],
      },
      {
        date: "2024-07-20",
        title: "Integrando Stripe sin volverte loco",
        body: "Los webhooks de Stripe son el punto más delicado. Si tu servidor falla mientras procesa un evento de pago confirmado, tu base de datos queda inconsistente. Implementé idempotencia con un campo stripe_event_id único para que los reintentos no dupliquen órdenes.",
        tags: ["pagos", "Stripe", "backend"],
      },
    ],
  },
  {
    id: 3,
    slug: "dashboard-analiticas",
    title: "Dashboard de analíticas",
    description: "Visualización de datos en tiempo real para un negocio de logística.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=360&fit=crop&auto=format",
    link: "#",
    status: "past",
    tech: ["React", "Recharts", "WebSocket", "Redis"],
    likes: 0,
    blog: [
      {
        date: "2024-09-14",
        title: "Tiempo real sin matar el servidor",
        body: "El cliente quería actualizaciones en vivo de las rutas de entrega. Empecé con polling cada 2 segundos, lo que generó 180 peticiones por minuto por usuario. Con 50 usuarios activos eso era inaceptable. Migré a WebSockets con Redis Pub/Sub y el uso del servidor cayó un 94%.",
        tags: ["tiempo real", "WebSocket", "optimización"],
      },
    ],
  },
  {
    id: 4,
    slug: "portafolio",
    title: "Portafolio / Devlog",
    description: "Este mismo sitio — un espacio para documentar lo que construyo y lo que aprendo.",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=640&h=360&fit=crop&auto=format",
    link: "#",
    status: "current",
    tech: ["React", "Next.js", "Tailwind"],
    likes: 0,
    blog: [
      {
        date: "2026-06-28",
        title: "¿Por qué un devlog y no solo un portafolio?",
        body: "Un portafolio clásico muestra resultados. Un devlog muestra el proceso. Me interesa más documentar cómo pienso un problema que simplemente listar tecnologías en un CV. Este sitio es mi cuaderno de notas público.",
        tags: ["meta", "escritura"],
      },
      {
        date: "2026-07-01",
        title: "Diseñando con la restricción como punto de partida",
        body: "Decidí usar solo blanco y verde como colores principales porque me obligaba a ser más cuidadoso con la jerarquía tipográfica. Cuando no puedes esconderte detrás de los degradados, el espaciado y el tamaño de fuente tienen que hacer todo el trabajo.",
        tags: ["diseño", "CSS", "tipografía"],
      },
    ],
  },
  {
    id: 5,
    slug: "app-habitos",
    title: "App de hábitos diarios",
    description: "Aplicación móvil con React Native para seguimiento de hábitos y metas personales.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=640&h=360&fit=crop&auto=format",
    link: "#",
    status: "current",
    tech: ["React Native", "Expo", "SQLite"],
    likes: 0,
    blog: [
      {
        date: "2026-05-10",
        title: "El problema con las apps de hábitos existentes",
        body: "Probé siete apps diferentes en un mes. Todas fallan en lo mismo: demasiada fricción para registrar algo simple. Si tardas más de 3 segundos en marcar un hábito como completado, dejas de usarla. Mi objetivo es que la interacción principal sea un solo toque.",
        tags: ["UX", "mobile", "investigación"],
      },
    ],
  },
  {
    id: 6,
    slug: "plugin-vscode",
    title: "Plugin de VS Code",
    description: "Extensión para generar documentación automática usando IA localmente.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop&auto=format",
    link: "#",
    status: "current",
    tech: ["TypeScript", "VS Code API", "Ollama"],
    likes: 0,
    blog: [
      {
        date: "2026-04-22",
        title: "Modelos locales para no enviar tu código a la nube",
        body: "Muchos equipos no pueden usar GitHub Copilot por políticas de seguridad. La solución: correr un modelo localmente con Ollama. El truco está en el prompt engineering — los modelos pequeños (7B parámetros) generan buena documentación si les das contexto suficiente sobre el archivo.",
        tags: ["IA", "privacidad", "VS Code"],
      },
    ],
  },
  {
    id: 7,
    slug: "busqueda-semantica",
    title: "Motor de búsqueda semántica",
    description: "Herramienta de búsqueda en documentos propios usando embeddings y modelos locales.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&h=360&fit=crop&auto=format",
    link: "#",
    status: "future",
    tech: ["Python", "FastAPI", "pgvector", "Ollama"],
    likes: 0,
    blog: [
      {
        date: "2026-06-15",
        title: "La idea: buscar ideas, no palabras",
        body: "Google busca palabras exactas. Yo quiero buscar conceptos. Si escribo 'cómo manejar errores en async' debería encontrar mi nota sobre 'patrones de manejo de excepciones en código asíncrono', aunque no comparta ninguna palabra. Los embeddings hacen esto posible.",
        tags: ["idea", "NLP", "búsqueda"],
      },
    ],
  },
  {
    id: 8,
    slug: "compilador",
    title: "Compilador de lenguaje propio",
    description: "Lenguaje de scripting minimalista con sintaxis en español, compilado a bytecode.",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=640&h=360&fit=crop&auto=format",
    link: "#",
    status: "future",
    tech: ["Rust", "LLVM"],
    likes: 0,
    blog: [
      {
        date: "2026-05-30",
        title: "¿Para qué construir un lenguaje en español?",
        body: "No es para uso en producción. Es para entender cómo funcionan los lenguajes que uso todos los días. Y porque me parece curioso que toda la programación asuma el inglés como idioma base. Un experimento mental: ¿cómo sería aprender a programar si los keywords fueran en tu idioma nativo?",
        tags: ["compiladores", "experimento", "Rust"],
      },
    ],
  },
  {
    id: 9,
    slug: "microblogging",
    title: "Plataforma de microblogging",
    description: "Red social descentralizada con protocolo ActivityPub y almacenamiento propio.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=640&h=360&fit=crop&auto=format",
    link: "#",
    status: "future",
    tech: ["Go", "ActivityPub", "PostgreSQL"],
    likes: 0,
    blog: [
      {
        date: "2026-06-01",
        title: "Fediverso: la web como debería ser",
        body: "La idea de que tu cuenta en una instancia pueda seguir cuentas en otra instancia, sin que ninguna empresa controle la conversación, me parece la dirección correcta para las redes sociales. Quiero entender ActivityPub construyendo una implementación mínima desde cero.",
        tags: ["fediverso", "protocolo", "Go"],
      },
    ],
  },
];

async function seed() {
  console.log(`Seeding ${projects.length} projects...`);

  const batch = db.batch();

  for (const project of projects) {
    const ref = db.collection("projects").doc(project.slug);
    const { id: _, ...data } = project;
    batch.set(ref, {
      ...data,
      createdAt: new Date().toISOString(),
    });
  }

  await batch.commit();
  console.log("✅ Done — projects collection seeded");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
