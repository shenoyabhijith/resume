export interface ContentData {
  meta: {
    title: string;
    description: string;
  };
  theme: {
    color: "green" | "amber" | "white" | string;
    crtCurvature: boolean;
    scanlines: boolean;
    flicker: number;
  };
  prompt: string;
  banner: {
    asciiArt: string;
    subtitle: string;
  };
  commands: {
    about: {
      title: string;
      content: string;
    };
    skills: {
      title: string;
      list: SkillItem[];
    };
    projects: ProjectItem[];
    experience: ExperienceItem[];
    education: EducationItem[];
    contact: {
      email: string;
      links: Record<string, string>;
    };
  };
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface ProjectItem {
  name: string;
  tagline: string;
  url: string;
  tech: string[];
}

export interface ExperienceItem {
  company: string;
  position: string;
  period: string;
  description: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
} 