import { AwardInfo, EducationInfo, ExperienceItem, ProjectDetail, SkillCategory } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'Pirai Soodan G.',
  role: 'Associate Software Engineer / Java Backend Software Engineer',
  headline: 'Java Backend Engineer | Spring Boot | Microservices | REST APIs',
  location: 'India',
  intro: 'I build and modernize backend services using Java and Spring Boot, with a focus on REST APIs, microservices, database integration, and reliable application development.',
  email: 'piraigps25@gmail.com',
  linkedin: 'https://www.linkedin.com/in/pirai-soodan-g-99a79722b/',
  github: 'https://github.com/Pirai1421',
  portfolioUrl: 'https://portfolio-git-master-pirai-soodan-gs-projects.vercel.app',
  resumePath: '/Pirai_Soodan_G_Resume.pdf',
};

export const ABOUT_ME = {
  summary: `I am a backend software engineer with professional experience at Purchasing Power. My work includes Java application modernization, Spring Boot upgrades, REST API development and integration, third-party API health monitoring, testing, debugging, and production support.

I enjoy understanding backend systems, improving maintainability, and building reliable services.`,
};

export const EDUCATION: EducationInfo = {
  degree: 'B.Tech in Computer and Communication Engineering',
  institution: 'Amrita Vishwa Vidyapeetham, Coimbatore',
  period: '2021–2025',
  cgpa: '8.3/10',
  location: 'Coimbatore, India',
  details: [
    'Focused on core computer science foundations, communication networks, database systems, and object-oriented programming.',
    'Graduated with 8.3/10 Cumulative Grade Point Average.'
  ],
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Programming',
    description: 'Core languages utilized for backend services, scripting, and database querying',
    skills: ['Java 8', 'Java 17', 'Python', 'SQL'],
  },
  {
    category: 'AI & Data Engineering',
    description: 'Machine learning fundamentals, predictive modeling, data analysis, and AI-assisted workflows',
    skills: [
      'Python',
      'Machine Learning Concepts',
      'Predictive Modeling',
      'Data Preprocessing (Pandas)',
      'Feature Engineering',
      'Model Evaluation',
      'AI-Assisted Development',
    ],
  },
  {
    category: 'Backend Development',
    description: 'Frameworks and persistence technologies for scalable microservices',
    skills: [
      'Spring Framework',
      'Spring Boot',
      'REST APIs',
      'Microservices',
      'Hibernate',
      'Spring Data JPA',
      'JDBC',
      'Object-Oriented Programming',
    ],
  },
  {
    category: 'Databases',
    description: 'Relational database systems and schema interactions',
    skills: ['MySQL', 'PostgreSQL', 'Relational Database Concepts'],
  },
  {
    category: 'Testing and Development Tools',
    description: 'Automated testing libraries, version control, build tools, and containerization',
    skills: [
      'JUnit',
      'Mockito',
      'Postman',
      'Git',
      'GitHub',
      'Maven',
      'Jenkins',
      'Docker',
    ],
  },
  {
    category: 'Engineering Practices',
    description: 'Reliability methodologies, lifecycle management, and collaborative standards',
    skills: [
      'Unit and Integration Testing',
      'Debugging',
      'Code Reviews',
      'Agile / Scrum',
      'CI/CD Concepts',
      'Software Development Lifecycle (SDLC)',
    ],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Associate Software Engineer',
    company: 'Purchasing Power',
    period: 'July 2025–Present',
    type: 'Full-time',
    summary: 'Full-time backend engineer driving microservices modernization, Spring Boot upgrades, REST API development, and production reliability.',
    responsibilities: [
      'Modernized 8 microservices from Java 11 to Java 17, ensuring runtime compatibility and taking advantage of modern language improvements.',
      'Upgraded applications from Spring Boot 2.x to Spring Boot 3+, adapting Jakarta EE migrations and updated configuration models.',
      'Developed and integrated REST APIs and backend business logic for core purchasing services.',
      'Supported database integration, testing, code reviews, and deployment readiness.',
      'Implemented health-check monitoring for third-party vendor APIs to improve observability.',
      'Helped investigate production issues in active collaboration with QA and DevOps teams.',
      'Contributed to secure coding standards, sprint planning, and production support.'
    ],
    technologies: ['Java 17', 'Spring Boot 3+', 'Microservices', 'REST APIs', 'Spring Data JPA', 'MySQL', 'Jenkins', 'Docker', 'JUnit', 'Mockito'],
  },
  {
    id: 'exp-2',
    role: 'Software Engineer Intern',
    company: 'Purchasing Power',
    period: 'January 2025–July 2025',
    type: 'Internship',
    summary: 'Backend engineering internship contributing to Java/Spring Boot services, persistence layer enhancements, and integration test coverage.',
    responsibilities: [
      'Developed and enhanced Java and Spring Boot backend functionality.',
      'Worked with Hibernate and REST APIs to handle data persistence and external integrations.',
      'Supported bug fixing, integration testing, legacy code improvements, and deployment readiness.',
      'Collaborated within an Agile engineering team participating in code reviews and daily standups.'
    ],
    technologies: ['Java', 'Spring Boot', 'Hibernate', 'REST APIs', 'MySQL', 'Postman', 'Git', 'JUnit'],
  },
];

export const PROJECTS: ProjectDetail[] = [
  {
    id: 'proj-1',
    title: 'DAO to Spring Data JPA Migration',
    category: 'Enterprise Backend',
    summary: 'Refactored enterprise data access layer from legacy manual DAO implementations to declarative Spring Data JPA repositories.',
    technologies: ['Java', 'Spring Boot', 'Spring Data JPA', 'Hibernate', 'SQL'],
    problemStatement: 'Legacy services relied on verbose DAO classes with repetitive boilerplate JDBC/Hibernate session boilerplate, increasing maintenance overhead and slowing feature delivery.',
    myContribution: 'Identified redundant DAO query methods and transitioned them to Spring Data JPA repository interfaces with derived query methods and custom JPQL queries.',
    technicalImplementation: [
      'Replaced custom DAO implementations with Spring Data JPA repository interfaces.',
      'Migrated native SQL/HQL statements to type-safe JPQL and Spring Data query derivation.',
      'Integrated Hibernate transactional boundaries and verified rollback behaviors.',
      'Wrote comprehensive unit and repository integration tests using Mockito and Spring Boot Test.'
    ],
    challengesAndSolutions: [
      {
        challenge: 'Handling complex custom queries with vendor-specific SQL functions during migration.',
        solution: 'Refactored specialized queries using explicit JPQL `@Query` annotations and validated compatibility against the target database.'
      },
      {
        challenge: 'Ensuring transaction semantics remained identical without introducing subtle session leaks.',
        solution: 'Implemented declarative `@Transactional` boundaries and verified lifecycle behavior across test suites.'
      }
    ],
    outcome: 'Significantly simplified persistence layer codebase, enhanced maintainability, and streamlined onboarding for engineering teams working on new features.'
  },
  {
    id: 'proj-2',
    title: 'SAP Commerce Recycling Fee Integration',
    category: 'E-Commerce / Integrations',
    summary: 'Engineered backend recycling-fee calculation logic for SAP Commerce (Hybris) across checkout and order processing workflows.',
    technologies: ['Java', 'SAP Commerce (Hybris)', 'Backend Business Logic', 'Database Integration', 'REST APIs'],
    problemStatement: 'Regulatory compliance required applying a 0.15% fee based on item price across specific product categories during cart, checkout, and order placement.',
    myContribution: 'Implemented backend fee calculation logic, integrated it into the cart and checkout pipeline, and ensured consistency across 12+ product categories.',
    technicalImplementation: [
      'Developed fee calculation service logic applying the 0.15% computation based on item pricing.',
      'Integrated the calculation hook into cart recalculation, checkout, and order fulfillment workflows.',
      'Configured category-level rules covering 12+ targeted product categories.',
      'Ensured database persistence of fee line-items and exposed fee breakdown through REST APIs for checkout interfaces.'
    ],
    challengesAndSolutions: [
      {
        challenge: 'Preventing double-calculation of fees during cart re-evaluations and promotions.',
        solution: 'Designed idempotent fee reconciliation handlers that clear and recalculate during the standardized cart calculation lifecycle.'
      },
      {
        challenge: 'Supporting multi-currency precision without rounding discrepancies in financial totals.',
        solution: 'Applied `BigDecimal` arithmetic with rigorous rounding modes matching SAP Commerce financial standards.'
      }
    ],
    outcome: 'Successfully met regulatory fee compliance across all target categories without impacting order placement performance or cart latency.'
  },
  {
    id: 'proj-3',
    title: 'Third-Party API Health Monitoring',
    category: 'Observability',
    summary: 'Implemented automated health-check monitoring for external partner and vendor APIs to boost backend service observability.',
    technologies: ['Java', 'Spring Boot', 'REST APIs', 'Monitoring and Error Handling'],
    problemStatement: 'Intermittent third-party vendor downtime previously caused downstream errors without clear attribution, hindering fast incident response.',
    myContribution: 'Created automated periodic health check monitors and diagnostic probes to verify external API availability and status.',
    technicalImplementation: [
      'Developed scheduled probe jobs invoking vendor heartbeat endpoints with strict timeout constraints.',
      'Implemented structured logging and status indicators reflecting vendor endpoint availability.',
      'Engineered graceful fallback error handling so external hiccups degrade gracefully rather than crashing parent operations.'
    ],
    challengesAndSolutions: [
      {
        challenge: 'Preventing health checks from causing rate-limit exhaustion on vendor endpoints.',
        solution: 'Implemented configurable polling intervals and lightweight HEAD/status check calls.'
      }
    ],
    outcome: 'Significantly improved backend service observability, enabling faster troubleshooting and immediate identification of vendor-side integration issues.'
  },
  {
    id: 'proj-4',
    title: 'Spotify Music Recommendation System',
    category: 'Machine Learning',
    summary: 'Academic and personal machine-learning project exploring music recommendation algorithms using a Spotify audio dataset.',
    technologies: ['Python', 'Data Processing', 'Machine Learning Algorithms', 'Pandas'],
    problemStatement: 'Explored how acoustic features (tempo, energy, acousticness, valence) can be modeled to generate relevant song recommendations for users.',
    myContribution: 'Preprocessed audio feature datasets, normalized data points, and implemented recommendation experiments.',
    technicalImplementation: [
      'Explored Spotify song feature datasets including valence, danceability, and tempo.',
      'Cleaned, normalized, and engineered feature vectors.',
      'Evaluated distance-based and similarity algorithms for playlist recommendations.'
    ],
    challengesAndSolutions: [
      {
        challenge: 'Handling high-dimensional feature spaces and varying scales across attributes.',
        solution: 'Applied standard min-max scaling to balance acoustic feature influence.'
      }
    ],
    outcome: 'Strengthened understanding of data preprocessing, feature engineering, and recommendation system heuristics.'
  },
  {
    id: 'proj-5',
    title: 'Heart Disease Prediction',
    category: 'Machine Learning',
    summary: 'Academic and personal machine-learning project utilizing classification techniques to explore predictive health risk factors.',
    technologies: ['Python', 'Machine Learning Tools', 'Classification Models', 'Data Analysis'],
    problemStatement: 'Explored binary classification models to predict potential cardiovascular risk based on clinical measurement datasets.',
    myContribution: 'Performed exploratory data analysis, handled missing values, and trained classification models.',
    technicalImplementation: [
      'Preprocessed clinical tabular dataset and performed feature selection.',
      'Trained and evaluated standard classification algorithms (logistic regression, decision trees).',
      'Assessed validation performance metrics to observe model behavior.'
    ],
    challengesAndSolutions: [
      {
        challenge: 'Mitigating class imbalance in sample distributions.',
        solution: 'Experimented with stratified sampling and evaluated recall alongside precision.'
      }
    ],
    outcome: 'Gained hands-on experience in practical machine-learning workflows, model evaluation, and structured tabular data analysis.'
  }
];

export const RECOGNITION: AwardInfo = {
  title: 'STAR Award — Q2 2026',
  period: 'Q2 2026',
  organization: 'Purchasing Power',
  recognition: 'Best Employee and Star Performer of the Quarter',
  description: 'Awarded in recognition of exceptional dedication, high performance, and impactful contributions to backend engineering and microservices modernization at Purchasing Power.',
};

export const SUGGESTED_QUESTIONS = [
  "What is Pirai's current role?",
  "What experience does he have with Java and Spring Boot?",
  "Tell me about his microservices modernization work.",
  "Explain his SAP Commerce project.",
  "What technologies does he use?",
  "What award did he receive?",
  "How can I contact him?",
];
