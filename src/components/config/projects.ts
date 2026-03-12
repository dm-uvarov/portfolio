export type Project = {
  title: string;
  description: string;
  href?: string;
  tags: string[];
};

export const projects: Project[] = [
  {
    title: "cs493-tarpaulin-go",
    description: "REST API service in Go with Gin, cloud deployment, and backend-focused architecture.",
    href: "https://github.com/dm-uvarov/cs493-tarpaulin-go",
    tags: ["API", "Go", "Backend", "GCloud", "Gin Gonic"],
  },
  {
    title: "Textera",
    description: "Team TypeScript text adventure platform.",
    href: "https://github.com/cs461-text-adventure/code",
    tags: ["Capstone", "TypeScript", "Team Work"],
  },
  {
    title: "CG_final",
    description: "OpenGL graphics final project focused on real-time rendering and scene composition.",
    href: "https://github.com/dm-uvarov/CG_final",
    tags: ["Computer Graphics", "OpenGL", "Final Project"],
  },
  {
    title: "cs361",
    description: "Course engineering project with modular services, API integration, and iterative development.",
    href: "https://github.com/dm-uvarov/cs361",
    tags: ["API", "Services", "Course Project"],
  },
  {
    title: "photos-from-space",
    description: "Web app that fetches and presents space imagery from external APIs with clean gallery UX.",
    href: "https://github.com/dm-uvarov/photos-from-space",
    tags: ["Space Images", "API", "Web App"],
  },
];
