export type ProjectStatus = "past" | "current" | "future";

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
  status: ProjectStatus;
  tech: string[];
  likes: number;
  blog: BlogEntry[];
};

export type Suggestion = {
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type PushSubscription = {
  token: string;
  createdAt: string;
};

export type EmailSubscriber = {
  email: string;
  subscribedAt: string;
  confirmed: boolean;
};
