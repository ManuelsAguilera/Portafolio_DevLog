export type BlogEntry = {
  date: string;
  title: string;
  body: string;
  tags: string[];
};

export type Project = {
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

export const statusLabel: Record<Project["status"], string> = {
  past: "Finalizado",
  current: "En curso",
  future: "Próximo",
};

export const statusColor: Record<Project["status"], string> = {
  past: "border-[#C9A334] text-[#C9A334]",
  current: "border-[#34C94E] text-[#34C94E]",
  future: "border-[#C93453] text-[#C93453]",
};

export const sketchyShadow = "shadow-[2px_3px_0px_#45744D]";
export const sketchyShadowHover = "hover:shadow-[3px_4px_0px_#45744D] hover:-translate-y-px";


