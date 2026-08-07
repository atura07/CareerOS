export type TargetCompany =
  | 'Google'
  | 'Microsoft'
  | 'Amazon'
  | 'Adobe'
  | 'Oracle'
  | 'IBM'
  | 'JP Morgan'
  | 'Flipkart'
  | 'Walmart'
  | 'Deloitte'

export type TargetRole =
  | 'SDE'
  | 'Backend Developer'
  | 'Frontend Developer'
  | 'Full Stack Developer'
  | 'Data Analyst'
  | 'Data Scientist'

export type SkillName =
  | 'Java'
  | 'C++'
  | 'Python'
  | 'React'
  | 'Spring Boot'
  | 'SQL'
  | 'DSA'
  | 'DBMS'
  | 'OS'
  | 'CN'

export type Duration = '30 Days' | '60 Days' | '90 Days' | '180 Days'

export interface WeekPlan {
  weekNumber: number
  dsaTasks: string[]
  developmentTasks: string[]
  projects: string[]
  resumeTasks: string[]
  leetCodeGoal: string
  githubGoal: string
  mockInterviewGoal: string
  resources: string[]
}

export interface Roadmap {
  id: string
  company: TargetCompany
  role: TargetRole
  duration: Duration
  currentSkills: SkillName[]
  totalWeeks: number
  weeklyPlans: WeekPlan[]
  focusAreas: string[]
}

export const TARGET_COMPANIES: TargetCompany[] = [
  'Google',
  'Microsoft',
  'Amazon',
  'Adobe',
  'Oracle',
  'IBM',
  'JP Morgan',
  'Flipkart',
  'Walmart',
  'Deloitte',
]

export const TARGET_ROLES: TargetRole[] = [
  'SDE',
  'Backend Developer',
  'Frontend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
]

export const CURRENT_SKILLS: SkillName[] = [
  'Java',
  'C++',
  'Python',
  'React',
  'Spring Boot',
  'SQL',
  'DSA',
  'DBMS',
  'OS',
  'CN',
]

export const DURATIONS: Duration[] = ['30 Days', '60 Days', '90 Days', '180 Days']

/** Base DSA progression pool, rotated across weeks. */
const DSA_WEEKS: string[][] = [
  ['Arrays & Hashing', 'Two Pointers', 'Sliding Window'],
  ['Stacks & Queues', 'Linked Lists', 'Binary Search'],
  ['Trees & BST', 'Recursion & Backtracking'],
  ['Graphs (BFS/DFS)', 'Topological Sort', 'Union-Find'],
  ['Dynamic Programming I', 'Greedy Algorithms'],
  ['Dynamic Programming II', 'Advanced Graph Algorithms'],
]

/** Company-specific focus areas, interview prep, and resources. */
interface CompanyProfile {
  focus: string[]
  systemDesign: string
  resources: string[]
  leetcodeGoal: string
  githubGoal: string
  mockGoal: string
}

const COMPANY_PROFILES: Record<TargetCompany, CompanyProfile> = {
  Google: {
    focus: ['Graphs', 'Dynamic Programming', 'System Design', 'Complexity Analysis'],
    systemDesign: 'Design large-scale systems with low-latency, high-availability trade-offs',
    resources: ['Google Foo Bar Challenges', 'Cracking the Coding Interview'],
    leetcodeGoal: 'Solve Google-tagged DP & graph problems',
    githubGoal: 'Publish a scalable system-design case study',
    mockGoal: 'Mock system design interview',
  },
  Microsoft: {
    focus: ['Linked Lists', 'Trees', 'STAR Behavioral', 'Azure Cloud'],
    systemDesign: 'Design cloud-native services on Azure',
    resources: ['Microsoft Learn', 'LeetCode Microsoft-tagged problems'],
    leetcodeGoal: 'Solve Microsoft-tagged DSA problems',
    githubGoal: 'Build a cloud-deployed demo project',
    mockGoal: 'Mock STAR behavioral round',
  },
  Amazon: {
    focus: ['Arrays', 'Greedy', 'Priority Queues', 'Leadership Principles'],
    systemDesign: 'Design scalable e-commerce services',
    resources: ['Amazon Leadership Principles Guide', 'LeetCode Amazon-tagged problems'],
    leetcodeGoal: 'Solve Amazon-tagged medium problems',
    githubGoal: 'Document projects mapped to Leadership Principles',
    mockGoal: 'Mock Bar Raiser round',
  },
  Adobe: {
    focus: ['Recursion', 'Strings', 'JavaScript/Algorithms'],
    systemDesign: 'Design creative cloud / media rendering pipelines',
    resources: ['Adobe Tech Blog', 'LeetCode Adobe-tagged problems'],
    leetcodeGoal: 'Solve JavaScript & algorithm problems',
    githubGoal: 'Build a creative/UI-focused project',
    mockGoal: 'Mock creative problem-solving round',
  },
  Oracle: {
    focus: ['Java OOP', 'SQL & DBMS', 'Hashing'],
    systemDesign: 'Design database-backed enterprise applications',
    resources: ['Oracle Java Docs', 'LeetCode Database practice'],
    leetcodeGoal: 'Solve SQL + DSA problems',
    githubGoal: 'Create a database-driven side project',
    mockGoal: 'Mock Java + SQL technical round',
  },
  IBM: {
    focus: ['Python', 'Cloud', 'AI Concepts', 'Hashing'],
    systemDesign: 'Design AI/cloud service integrations',
    resources: ['IBM SkillsBuild', 'LeetCode IBM-tagged problems'],
    leetcodeGoal: 'Solve Python & AI-oriented problems',
    githubGoal: 'Contribute to an open-source AI repo',
    mockGoal: 'Mock technical + AI concepts round',
  },
  'JP Morgan': {
    focus: ['Stacks', 'Queues', 'Finance/Algo', 'Hashing'],
    systemDesign: 'Design low-latency trading/analytics systems',
    resources: ['JPMorgan Tech Blog', 'LeetCode JPMorgan-tagged problems'],
    leetcodeGoal: 'Solve quant/finance-inspired problems',
    githubGoal: 'Build a financial data dashboard',
    mockGoal: 'Mock quant + DSA round',
  },
  Flipkart: {
    focus: ['Graphs', 'Heap', 'Machine Coding'],
    systemDesign: 'Design e-commerce catalog & cart systems',
    resources: ['System Design Primer', 'LeetCode Flipkart-tagged problems'],
    leetcodeGoal: 'Solve Flipkart-tagged DSA problems',
    githubGoal: 'Build and deploy a machine-coding project',
    mockGoal: 'Mock machine coding round',
  },
  Walmart: {
    focus: ['Spring Boot', 'Microservices', 'Trees', 'Hashing'],
    systemDesign: 'Design microservices for retail supply chain',
    resources: ['Spring Boot in Practice', 'LeetCode Walmart-tagged problems'],
    leetcodeGoal: 'Solve Walmart-tagged DSA problems',
    githubGoal: 'Build a Spring Boot microservices demo',
    mockGoal: 'Mock backend (Spring) round',
  },
  Deloitte: {
    focus: ['SQL', 'Analytics', 'Case Logic'],
    systemDesign: 'Design data analytics & reporting pipelines',
    resources: ['LeetCode Database practice', 'Deloitte career insights'],
    leetcodeGoal: 'Solve SQL & analytics problems',
    githubGoal: 'Publish a data analysis notebook',
    mockGoal: 'Mock case + SQL round',
  },
}

/** Role-specific development tasks, projects, and resume tasks. */
interface RoleProfile {
  devTasks: string[]
  projects: string[]
  resumeTasks: string[]
  resources: string[]
}

const ROLE_PROFILES: Record<TargetRole, RoleProfile> = {
  SDE: {
    devTasks: [
      'Build a REST API with Spring Boot',
      'Add database layer (SQL) & write unit tests',
      'Build frontend with React & integrate the API',
      'Containerize with Docker & add caching',
      'Implement CI/CD pipeline',
      'Optimize queries & add monitoring',
    ],
    projects: [
      'Personal portfolio website',
      'To-do app with authentication',
      'E-commerce store frontend',
      'Real-time chat application',
      'Job board full-stack app',
      'Scalable microservices demo',
    ],
    resumeTasks: [
      'Create ATS-friendly resume',
      'Write a strong summary',
      'Add projects section',
      'Polish skills section with keywords',
      'Quantify achievements with metrics',
      'Finalize one-page resume',
    ],
    resources: ['Spring Boot Documentation', 'System Design Primer', 'GitHub Actions Guide'],
  },
  'Backend Developer': {
    devTasks: [
      'Design database schema & build REST endpoints',
      'Implement authentication & authorization',
      'Add caching (Redis) & message queues',
      'Write integration tests & API docs',
      'Containerize & deploy with CI/CD',
      'Add monitoring, logging & performance tuning',
    ],
    projects: [
      'REST API with rate limiting',
      'User authentication service',
      'Event-driven notification system',
      'E-commerce backend with order flow',
      'Payment gateway integration demo',
      'High-throughput API gateway',
    ],
    resumeTasks: [
      'Highlight backend & database skills',
      'Add API documentation links',
      'Quantify API performance metrics',
      'Showcase concurrency & caching work',
      'Add system design projects',
      'Finalize concise backend resume',
    ],
    resources: ['Spring Boot Documentation', 'REST API Design Guide', 'Database Indexing Guide'],
  },
  'Frontend Developer': {
    devTasks: [
      'Set up React + Vite project structure',
      'Build reusable UI components',
      'Add state management & routing',
      'Integrate REST APIs & handle loading states',
      'Optimize performance & accessibility',
      'Add animations & responsive polish',
    ],
    projects: [
      'Interactive portfolio site',
      'Dashboard with charts',
      'E-commerce product grid',
      'Real-time chat UI',
      'Task board with drag & drop',
      'Design-system component library',
    ],
    resumeTasks: [
      'Showcase UI/UX projects',
      'List React & frontend tools',
      'Add accessibility improvements',
      'Quantify performance wins',
      'Include design-system work',
      'Finalize frontend portfolio resume',
    ],
    resources: ['React Official Docs', 'TailwindCSS Docs', 'Web Accessibility Guide'],
  },
  'Full Stack Developer': {
    devTasks: [
      'Scaffold full-stack app (frontend + API)',
      'Build auth + database layer',
      'Connect React UI to REST API',
      'Add caching, validation & error handling',
      'Containerize & deploy frontend + backend',
      'Add CI/CD & monitoring',
    ],
    projects: [
      'Full-stack to-do app',
      'Blog with CMS backend',
      'E-commerce marketplace',
      'Real-time collaborative app',
      'Job board with filters',
      'Microservices full-stack demo',
    ],
    resumeTasks: [
      'Highlight full-stack capabilities',
      'List the complete tech stack',
      'Add deployed project links',
      'Quantify end-to-end outcomes',
      'Add architecture diagrams',
      'Finalize full-stack resume',
    ],
    resources: ['Spring Boot Documentation', 'React Official Docs', 'Full-Stack Project Guide'],
  },
  'Data Analyst': {
    devTasks: [
      'Set up Python + SQL environment',
      'Load & clean a real dataset',
      'Build SQL queries & aggregations',
      'Create visualizations & dashboards',
      'Write analysis reports with insights',
      'Automate reporting pipeline',
    ],
    projects: [
      'Sales data analysis dashboard',
      'Customer churn analysis',
      'Marketing performance report',
      'Financial trend analysis',
      'Operations KPI dashboard',
      'End-to-end analytics notebook',
    ],
    resumeTasks: [
      'Highlight SQL & analytics skills',
      'Add dashboard links',
      'Quantify insights & impact',
      'Showcase data storytelling',
      'Add tools (Excel, Tableau, Python)',
      'Finalize analytics resume',
    ],
    resources: ['LeetCode Database practice', 'Kaggle Datasets', 'SQL Practice (HackerRank)'],
  },
  'Data Scientist': {
    devTasks: [
      'Set up Python + ML environment',
      'Perform EDA on a dataset',
      'Build & tune ML models',
      'Feature engineering & evaluation',
      'Deploy a model as an API',
      'Write ML experiment reports',
    ],
    projects: [
      'Predictive model for housing prices',
      'Classification model (churn/disease)',
      'Recommendation system demo',
      'NLP text analysis project',
      'Time-series forecasting',
      'MLOps pipeline with model registry',
    ],
    resumeTasks: [
      'Highlight ML & statistics skills',
      'Add model metrics & evaluations',
      'Quantify prediction improvements',
      'Add Kaggle/public notebooks',
      'Showcase deployment work',
      'Finalize data science resume',
    ],
    resources: ['Kaggle Notebooks', 'scikit-learn Docs', 'MLOps Guide'],
  },
}

/** Weekly goal progression templates (cycled by week index). */
const LEETCODE_GOALS = [
  'Solve 15 easy problems',
  'Solve 20 easy problems',
  'Solve 15 medium problems',
  'Solve 20 medium problems',
  'Solve 25 medium problems',
  'Tackle mixed hard problems',
]

const GITHUB_GOALS = [
  'Push 5 commits & create 2 repos',
  'Open 1 PR to an open-source repo',
  'Deploy a project to GitHub Pages',
  'Write READMEs for all repos',
  'Contribute to 2 open-source repos',
  'Build a portfolio repo with project docs',
]

const MOCK_GOALS = [
  '1 mock interview (self-assessed)',
  '2 mock interviews',
  '3 mock interviews',
  '4 mock interviews',
  '2 peer mock interviews',
  'Mock system design interview',
]

export function buildMockRoadmap(
  company: TargetCompany,
  role: TargetRole,
  duration: Duration,
  currentSkills: SkillName[],
): Roadmap {
  const totalWeeks =
    duration === '30 Days' ? 4 : duration === '60 Days' ? 6 : duration === '90 Days' ? 9 : 12

  const companyProfile = COMPANY_PROFILES[company]
  const roleProfile = ROLE_PROFILES[role]

  const plans: WeekPlan[] = Array.from({ length: totalWeeks }, (_, i) => {
    const dsaPool = DSA_WEEKS[i % DSA_WEEKS.length]
    const devTask = roleProfile.devTasks[i % roleProfile.devTasks.length]
    const project = roleProfile.projects[i % roleProfile.projects.length]
    const resumeTask = roleProfile.resumeTasks[i % roleProfile.resumeTasks.length]

    return {
      weekNumber: i + 1,
      dsaTasks: [...dsaPool, ...(i === 0 ? companyProfile.focus.slice(0, 1) : [])],
      developmentTasks: [devTask],
      projects: [project],
      resumeTasks: [resumeTask],
      leetCodeGoal: i === 0 ? companyProfile.leetcodeGoal : LEETCODE_GOALS[i % LEETCODE_GOALS.length],
      githubGoal: i === 0 ? companyProfile.githubGoal : GITHUB_GOALS[i % GITHUB_GOALS.length],
      mockInterviewGoal:
        i === 0 ? companyProfile.mockGoal : MOCK_GOALS[i % MOCK_GOALS.length],
      resources:
        i === 0
          ? [...companyProfile.resources, ...roleProfile.resources]
          : [roleProfile.resources[i % roleProfile.resources.length]],
    }
  })

  return {
    id: `${company.toLowerCase()}-${role.toLowerCase().replace(/\s+/g, '-')}-${duration.replace(/\s+/g, '-')}`,
    company,
    role,
    duration,
    currentSkills,
    totalWeeks,
    weeklyPlans: plans,
    focusAreas: companyProfile.focus,
  }
}
