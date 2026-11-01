export interface KnowledgeChunk {
  id: string;
  topic: string;
  keywords: string[];
  content: string;
}

export const KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  {
    id: 'exp_associate',
    topic: 'Purchasing Power Associate Software Engineer',
    keywords: ['purchasing power', 'role', 'associate', 'job', 'work', 'current', 'microservice', 'java 17', 'java 11', 'spring boot 3', 'experience'],
    content: `ROLE & PROFESSIONAL EXPERIENCE:
- Pirai Soodan G. is an Associate Software Engineer at Purchasing Power (July 2025–Present).
- Modernized 8 microservices from Java 11 to Java 17; upgraded applications from Spring Boot 2.x to 3+.
- Developed and integrated REST APIs and backend business logic.
- Implemented health-check monitoring for third-party external vendor APIs.
- Supported database integration, testing, code reviews, and deployment readiness.
- Investigated production issues with QA and DevOps teams.`
  },
  {
    id: 'exp_intern',
    topic: 'Purchasing Power Software Engineer Internship',
    keywords: ['intern', 'internship', 'purchasing power', 'hibernate', 'past experience', 'history'],
    content: `INTERNSHIP EXPERIENCE:
- Software Engineer Intern at Purchasing Power (January 2025–July 2025).
- Developed Java/Spring Boot backend services and Hibernate database interactions.
- Supported bug fixes, integration testing, and legacy application modernization.`
  },
  {
    id: 'proj_jpa',
    topic: 'DAO to Spring Data JPA Migration Project',
    keywords: ['dao', 'jpa', 'spring data jpa', 'migration', 'persistence', 'hibernate', 'database', 'sql'],
    content: `PROJECT: DAO to Spring Data JPA Migration
- Migrated enterprise data access layer from legacy DAO implementations to Spring Data JPA repositories.
- Simplified persistence code, reduced boilerplate, and improved maintainability.
- Tech: Java, Spring Boot, Spring Data JPA, Hibernate, SQL.`
  },
  {
    id: 'proj_sap',
    topic: 'SAP Commerce Recycling Fee Integration Project',
    keywords: ['sap', 'commerce', 'hybris', 'recycling', 'fee', '0.15', 'cart', 'checkout', 'order'],
    content: `PROJECT: SAP Commerce Recycling Fee Integration
- Implemented backend recycling-fee calculation logic (0.15% fee based on item price) for SAP Commerce (Hybris).
- Integrated across cart, checkout, and order workflows for 12+ product categories.
- Tech: Java, SAP Commerce (Hybris), backend business logic, database integration, REST APIs.`
  },
  {
    id: 'proj_health',
    topic: 'Third-Party API Health Monitoring Project',
    keywords: ['health', 'monitoring', 'third-party', 'vendor', 'api health', 'observability', 'probe'],
    content: `PROJECT: Third-Party API Health Monitoring
- Implemented automated health check probes for external vendor APIs.
- Improved backend service observability and accelerated integration troubleshooting.
- Tech: Java, Spring Boot, REST APIs, monitoring, and error handling.`
  },
  {
    id: 'proj_ai_ml',
    topic: 'Academic / Personal Machine Learning Projects',
    keywords: ['spotify', 'music', 'heart disease', 'machine learning', 'ml', 'python', 'recommendation', 'prediction', 'data analysis', 'ai'],
    content: `PROJECTS (MACHINE LEARNING):
1. Spotify Music Recommendation System: Machine learning recommendation modeling using Spotify audio dataset in Python.
2. Heart Disease Prediction: Classification modeling using clinical tabular data in Python.`
  },
  {
    id: 'skills_all',
    topic: 'Technical Skills & Tooling',
    keywords: ['skill', 'skills', 'technolog', 'stack', 'languages', 'tools', 'java', 'python', 'spring', 'mysql', 'docker', 'jenkins', 'git', 'junit', 'mockito', 'dsa', 'data structure', 'ai'],
    content: `TECHNICAL SKILLS:
- Languages: Java 8, Java 17, Python, SQL.
- Backend: Spring Boot, Spring Framework, Microservices, REST APIs, Hibernate, Spring Data JPA, JDBC, OOP.
- AI & Data Engineering: Machine Learning Concepts, Predictive Modeling, Data Preprocessing (Pandas), Feature Engineering, AI-Assisted Development.
- Databases: MySQL, PostgreSQL.
- Testing & Tools: JUnit, Mockito, Git, GitHub, Maven, Jenkins, Docker, Postman.
- Practices: Unit & integration testing, debugging, code reviews, Agile/Scrum, CI/CD.`
  },
  {
    id: 'education',
    topic: 'Academic Education & Degree',
    keywords: ['education', 'degree', 'college', 'university', 'amrita', 'cgpa', 'b.tech', 'cce', 'coimbatore', 'study'],
    content: `EDUCATION:
- Degree: B.Tech in Computer and Communication Engineering.
- Institution: Amrita Vishwa Vidyapeetham, Coimbatore.
- Period: 2021–2025.
- CGPA: 8.3/10.`
  },
  {
    id: 'recognition',
    topic: 'STAR Award & Recognition',
    keywords: ['award', 'star', 'recognition', 'honor', 'achievement', 'performer', 'best employee'],
    content: `HONORS & RECOGNITION:
- STAR Award — Q2 2026 at Purchasing Power.
- Best Employee and Star Performer of the Quarter for microservices modernization contributions.`
  },
  {
    id: 'contact',
    topic: 'Contact & Public Profiles',
    keywords: ['contact', 'email', 'reach', 'hire', 'linkedin', 'github', 'portfolio', 'connect'],
    content: `CONTACT:
- Email: piraigps25@gmail.com
- LinkedIn: https://www.linkedin.com/in/pirai-soodan-g-99a79722b/
- GitHub: https://github.com/Pirai1421
- Portfolio: https://portfolio-git-master-pirai-soodan-gs-projects.vercel.app`
  }
];

export function retrieveRelevantContext(query: string): string {
  if (!query || !query.trim()) {
    return KNOWLEDGE_CHUNKS[0].content;
  }

  const lowerQuery = query.toLowerCase().trim();
  const queryWords = lowerQuery.split(/\W+/);

  const scored = KNOWLEDGE_CHUNKS.map((chunk) => {
    let score = 0;
    for (const kw of chunk.keywords) {
      if (lowerQuery.includes(kw)) {
        score += 4;
      }
      for (const word of queryWords) {
        if (word.length > 2 && kw.includes(word)) {
          score += 1;
        }
      }
    }
    return { chunk, score };
  });

  const matching = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);

  if (matching.length === 0) {
    // Default top 2 chunks (role + skills)
    return [KNOWLEDGE_CHUNKS[0].content, KNOWLEDGE_CHUNKS[6].content].join('\n---\n');
  }

  // Take top 3 chunks (usually 150-300 tokens)
  return matching.slice(0, 3).map((m) => m.chunk.content).join('\n---\n');
}
