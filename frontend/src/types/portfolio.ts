export interface ProjectDetail {
  id: string;
  title: string;
  category: 'Enterprise Backend' | 'E-Commerce / Integrations' | 'Observability' | 'Machine Learning';
  summary: string;
  technologies: string[];
  problemStatement: string;
  myContribution: string;
  technicalImplementation: string[];
  challengesAndSolutions: { challenge: string; solution: string }[];
  outcome: string;
  architectureDiagram?: string;
  githubUrl?: string; // Only real verified URLs; undefined if none
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  type: 'Full-time' | 'Internship';
  summary: string;
  responsibilities: string[];
  technologies: string[];
}

export interface SkillCategory {
  category: string;
  description: string;
  skills: string[];
}

export interface EducationInfo {
  degree: string;
  institution: string;
  period: string;
  cgpa: string;
  location: string;
  details: string[];
}

export interface AwardInfo {
  title: string;
  period: string;
  organization: string;
  recognition: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  mode?: 'LIVE_AI' | 'VERIFIED_KNOWLEDGE_BASE';
  isOffTopic?: boolean;
}

export interface AssistantStatus {
  status: string;
  mode: string;
  model: string;
  liveAiAvailable: boolean;
  greeting: string;
}
