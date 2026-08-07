/**
 * Mock Interview Dashboard — data model (UI only).
 * No AI, no backend, no API. All data is local mock data.
 */

export type InterviewType = 'HR' | 'Technical' | 'System Design' | 'DSA'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Company {
  id: string
  name: string
  industry: string
}

export interface InterviewQuestion {
  id: string
  question: string
  category: InterviewType
  difficulty: Difficulty
  company: string
  expectedTopics: string[]
}

export interface InterviewSession {
  id: string
  company: string
  type: InterviewType
  difficulty: Difficulty
  duration: number
  questions: InterviewQuestion[]
}

export interface InterviewScore {
  communication: number
  technical: number
  confidence: number
  problemSolving: number
  overall: number
}

export interface Feedback {
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
}

export interface InterviewRecord {
  id: string
  company: string
  date: string
  type: InterviewType
  score: number
  duration: number
  result: 'Passed' | 'Needs Work' | 'Excellent'
}

/* ------------------------------- Mock Companies ------------------------------- */

export const MOCK_COMPANIES: Company[] = [
  { id: 'google', name: 'Google', industry: 'Technology' },
  { id: 'microsoft', name: 'Microsoft', industry: 'Technology' },
  { id: 'amazon', name: 'Amazon', industry: 'E-commerce' },
  { id: 'adobe', name: 'Adobe', industry: 'Software' },
  { id: 'oracle', name: 'Oracle', industry: 'Database' },
  { id: 'ibm', name: 'IBM', industry: 'Technology' },
  { id: 'jpmorgan', name: 'JP Morgan', industry: 'Finance' },
  { id: 'flipkart', name: 'Flipkart', industry: 'E-commerce' },
  { id: 'walmart', name: 'Walmart', industry: 'Retail' },
  { id: 'highradius', name: 'HighRadius', industry: 'FinTech' },
]

/* ------------------------------- Interview Types ------------------------------- */

export const INTERVIEW_TYPES: InterviewType[] = [
  'HR',
  'Technical',
  'System Design',
  'DSA',
]

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard']

export const DURATIONS_MIN: number[] = [15, 30, 45, 60]

/* ------------------------------- Question Bank ------------------------------- */

/**
 * Question bank. At least:
 * 40 HR, 40 Technical, 30 DSA, and 20 System Design questions.
 */
export const QUESTION_BANK: InterviewQuestion[] = [
  // ── HR (40) ──────────────────────────────────────────────────────────
  { id: 'hr-01', question: 'Tell me about yourself.', category: 'HR', difficulty: 'Easy', company: 'Google', expectedTopics: ['career', 'skills', 'experience'] },
  { id: 'hr-02', question: 'Why do you want to work here?', category: 'HR', difficulty: 'Easy', company: 'Microsoft', expectedTopics: ['company', 'values', 'growth'] },
  { id: 'hr-03', question: 'Describe a time you led a team.', category: 'HR', difficulty: 'Medium', company: 'Amazon', expectedTopics: ['leadership', 'team', 'outcome'] },
  { id: 'hr-04', question: 'Where do you see yourself in 5 years?', category: 'HR', difficulty: 'Easy', company: 'Adobe', expectedTopics: ['goals', 'career path', 'ambition'] },
  { id: 'hr-05', question: 'What is your biggest strength?', category: 'HR', difficulty: 'Easy', company: 'Oracle', expectedTopics: ['strength', 'example', 'impact'] },
  { id: 'hr-06', question: 'What is your biggest weakness?', category: 'HR', difficulty: 'Medium', company: 'IBM', expectedTopics: ['weakness', 'self-awareness', 'improvement'] },
  { id: 'hr-07', question: 'Tell me about a time you faced a conflict.', category: 'HR', difficulty: 'Medium', company: 'JP Morgan', expectedTopics: ['conflict', 'resolution', 'teamwork'] },
  { id: 'hr-08', question: 'Why should we hire you?', category: 'HR', difficulty: 'Easy', company: 'Flipkart', expectedTopics: ['value', 'skills', 'fit'] },
  { id: 'hr-09', question: 'Describe a failure you overcame.', category: 'HR', difficulty: 'Medium', company: 'Walmart', expectedTopics: ['failure', 'learning', 'resilience'] },
  { id: 'hr-10', question: 'How do you handle pressure?', category: 'HR', difficulty: 'Medium', company: 'HighRadius', expectedTopics: ['pressure', 'deadline', 'calm'] },
  { id: 'hr-11', question: 'Tell me about a time you took initiative.', category: 'HR', difficulty: 'Medium', company: 'Google', expectedTopics: ['initiative', 'proactive', 'result'] },
  { id: 'hr-12', question: 'How do you prioritize tasks?', category: 'HR', difficulty: 'Easy', company: 'Microsoft', expectedTopics: ['prioritize', 'urgency', 'importance'] },
  { id: 'hr-13', question: 'Describe your ideal work environment.', category: 'HR', difficulty: 'Easy', company: 'Amazon', expectedTopics: ['environment', 'culture', 'preference'] },
  { id: 'hr-14', question: 'Why did you choose computer science?', category: 'HR', difficulty: 'Easy', company: 'Adobe', expectedTopics: ['passion', 'motivation', 'journey'] },
  { id: 'hr-15', question: 'Tell me about a time you worked in a team.', category: 'HR', difficulty: 'Easy', company: 'Oracle', expectedTopics: ['teamwork', 'collaboration', 'role'] },
  { id: 'hr-16', question: 'How do you deal with criticism?', category: 'HR', difficulty: 'Medium', company: 'IBM', expectedTopics: ['criticism', 'feedback', 'growth'] },
  { id: 'hr-17', question: 'What are your salary expectations?', category: 'HR', difficulty: 'Medium', company: 'JP Morgan', expectedTopics: ['compensation', 'market', 'negotiation'] },
  { id: 'hr-18', question: 'Describe a time you went above and beyond.', category: 'HR', difficulty: 'Medium', company: 'Flipkart', expectedTopics: ['effort', 'extra mile', 'achievement'] },
  { id: 'hr-19', question: 'How do you stay updated with technology?', category: 'HR', difficulty: 'Easy', company: 'Walmart', expectedTopics: ['learning', 'blogs', 'courses'] },
  { id: 'hr-20', question: 'Tell me about your projects.', category: 'HR', difficulty: 'Easy', company: 'HighRadius', expectedTopics: ['projects', 'tech', 'contribution'] },
  { id: 'hr-21', question: 'Why do you want to leave your current job?', category: 'HR', difficulty: 'Medium', company: 'Google', expectedTopics: ['growth', 'opportunity', 'positive'] },
  { id: 'hr-22', question: 'Describe a time you had to learn quickly.', category: 'HR', difficulty: 'Medium', company: 'Microsoft', expectedTopics: ['learning', 'adaptive', 'speed'] },
  { id: 'hr-23', question: 'What motivates you?', category: 'HR', difficulty: 'Easy', company: 'Amazon', expectedTopics: ['motivation', 'drive', 'passion'] },
  { id: 'hr-24', question: 'How do you handle ambiguity?', category: 'HR', difficulty: 'Medium', company: 'Adobe', expectedTopics: ['ambiguity', 'decision', 'clarify'] },
  { id: 'hr-25', question: 'Tell me about a time you made a mistake.', category: 'HR', difficulty: 'Medium', company: 'Oracle', expectedTopics: ['mistake', 'accountability', 'lesson'] },
  { id: 'hr-26', question: 'What are your career goals?', category: 'HR', difficulty: 'Easy', company: 'IBM', expectedTopics: ['goals', 'development', 'aspiration'] },
  { id: 'hr-27', question: 'Describe a time you persuaded someone.', category: 'HR', difficulty: 'Medium', company: 'JP Morgan', expectedTopics: ['persuasion', 'influence', 'result'] },
  { id: 'hr-28', question: 'How do you manage time?', category: 'HR', difficulty: 'Easy', company: 'Flipkart', expectedTopics: ['time', 'planning', 'tools'] },
  { id: 'hr-29', question: 'Tell me about your academic background.', category: 'HR', difficulty: 'Easy', company: 'Walmart', expectedTopics: ['education', 'courses', 'achievements'] },
  { id: 'hr-30', question: 'Why this role and not another?', category: 'HR', difficulty: 'Medium', company: 'HighRadius', expectedTopics: ['role', 'interest', 'fit'] },
  { id: 'hr-31', question: 'Describe a time you received tough feedback.', category: 'HR', difficulty: 'Medium', company: 'Google', expectedTopics: ['feedback', 'improvement', 'response'] },
  { id: 'hr-32', question: 'How do you set goals?', category: 'HR', difficulty: 'Easy', company: 'Microsoft', expectedTopics: ['goals', 'measurement', 'review'] },
  { id: 'hr-33', question: 'Tell me about a stressful situation.', category: 'HR', difficulty: 'Medium', company: 'Amazon', expectedTopics: ['stress', 'management', 'outcome'] },
  { id: 'hr-34', question: 'What do you know about our company?', category: 'HR', difficulty: 'Easy', company: 'Adobe', expectedTopics: ['research', 'products', 'culture'] },
  { id: 'hr-35', question: 'Describe your communication style.', category: 'HR', difficulty: 'Easy', company: 'Oracle', expectedTopics: ['communication', 'clarity', 'listening'] },
  { id: 'hr-36', question: 'How do you approach new challenges?', category: 'HR', difficulty: 'Medium', company: 'IBM', expectedTopics: ['challenge', 'approach', 'problem'] },
  { id: 'hr-37', question: 'Tell me about a time you exceeded expectations.', category: 'HR', difficulty: 'Medium', company: 'JP Morgan', expectedTopics: ['exceed', 'delivery', 'impact'] },
  { id: 'hr-38', question: 'What makes you unique?', category: 'HR', difficulty: 'Easy', company: 'Flipkart', expectedTopics: ['unique', 'differentiator', 'value'] },
  { id: 'hr-39', question: 'How do you handle multiple deadlines?', category: 'HR', difficulty: 'Medium', company: 'Walmart', expectedTopics: ['deadlines', 'priority', 'organization'] },
  { id: 'hr-40', question: 'Describe a time you disagreed with a manager.', category: 'HR', difficulty: 'Hard', company: 'HighRadius', expectedTopics: ['disagreement', 'respect', 'resolution'] },

  // ── Technical (40) ───────────────────────────────────────────────────
  { id: 'tech-01', question: 'Explain the difference between Stack and Queue.', category: 'Technical', difficulty: 'Easy', company: 'Google', expectedTopics: ['lifo', 'fifo', 'operations'] },
  { id: 'tech-02', question: 'What is the difference between == and === in JavaScript?', category: 'Technical', difficulty: 'Easy', company: 'Microsoft', expectedTopics: ['loose equality', 'strict equality', 'type coercion'] },
  { id: 'tech-03', question: 'Explain closures in JavaScript.', category: 'Technical', difficulty: 'Medium', company: 'Amazon', expectedTopics: ['closure', 'scope', 'lexical'] },
  { id: 'tech-04', question: 'What is the difference between a process and a thread?', category: 'Technical', difficulty: 'Medium', company: 'Adobe', expectedTopics: ['process', 'thread', 'memory', 'scheduling'] },
  { id: 'tech-05', question: 'Explain Indexing in databases.', category: 'Technical', difficulty: 'Medium', company: 'Oracle', expectedTopics: ['index', 'query', 'b-tree'] },
  { id: 'tech-06', question: 'What is a REST API?', category: 'Technical', difficulty: 'Easy', company: 'IBM', expectedTopics: ['rest', 'http', 'resources'] },
  { id: 'tech-07', question: 'Explain normalization in DBMS.', category: 'Technical', difficulty: 'Medium', company: 'JP Morgan', expectedTopics: ['1nf', '2nf', '3nf', 'redundancy'] },
  { id: 'tech-08', question: 'What is the event loop in Node.js?', category: 'Technical', difficulty: 'Medium', company: 'Flipkart', expectedTopics: ['event loop', 'async', 'call stack'] },
  { id: 'tech-09', question: 'Explain the OSI model.', category: 'Technical', difficulty: 'Medium', company: 'Walmart', expectedTopics: ['layers', 'network', 'protocols'] },
  { id: 'tech-10', question: 'What is a deadlock?', category: 'Technical', difficulty: 'Hard', company: 'HighRadius', expectedTopics: ['deadlock', 'mutual exclusion', 'circular wait'] },
  { id: 'tech-11', question: 'Explain HashMaps and how they work.', category: 'Technical', difficulty: 'Medium', company: 'Google', expectedTopics: ['hash', 'collision', 'bucket'] },
  { id: 'tech-12', question: 'What is the difference between SQL and NoSQL?', category: 'Technical', difficulty: 'Easy', company: 'Microsoft', expectedTopics: ['relational', 'document', 'scalability'] },
  { id: 'tech-13', question: 'Explain TCP vs UDP.', category: 'Technical', difficulty: 'Easy', company: 'Amazon', expectedTopics: ['reliability', 'connection', 'speed'] },
  { id: 'tech-14', question: 'What is the difference between OOP and functional programming?', category: 'Technical', difficulty: 'Medium', company: 'Adobe', expectedTopics: ['objects', 'functions', 'state'] },
  { id: 'tech-15', question: 'Explain garbage collection.', category: 'Technical', difficulty: 'Medium', company: 'Oracle', expectedTopics: ['memory', 'gc', 'reachability'] },
  { id: 'tech-16', question: 'What is the difference between GET and POST?', category: 'Technical', difficulty: 'Easy', company: 'IBM', expectedTopics: ['idempotent', 'body', 'caching'] },
  { id: 'tech-17', question: 'Explain ACID properties.', category: 'Technical', difficulty: 'Medium', company: 'JP Morgan', expectedTopics: ['atomicity', 'consistency', 'isolation', 'durability'] },
  { id: 'tech-18', question: 'What is a microservice?', category: 'Technical', difficulty: 'Medium', company: 'Flipkart', expectedTopics: ['service', 'decentralized', 'scalability'] },
  { id: 'tech-19', question: 'Explain load balancing.', category: 'Technical', difficulty: 'Medium', company: 'Walmart', expectedTopics: ['distribution', 'traffic', 'availability'] },
  { id: 'tech-20', question: 'What is caching and why use it?', category: 'Technical', difficulty: 'Easy', company: 'HighRadius', expectedTopics: ['cache', 'latency', 'eviction'] },
  { id: 'tech-21', question: 'Explain polymorphism in OOP.', category: 'Technical', difficulty: 'Medium', company: 'Google', expectedTopics: ['compile-time', 'runtime', 'override'] },
  { id: 'tech-22', question: 'What is the difference between an interface and abstract class?', category: 'Technical', difficulty: 'Medium', company: 'Microsoft', expectedTopics: ['interface', 'abstract', 'inheritance'] },
  { id: 'tech-23', question: 'Explain how the browser renders a page.', category: 'Technical', difficulty: 'Medium', company: 'Amazon', expectedTopics: ['dom', 'cssom', 'render tree'] },
  { id: 'tech-24', question: 'What is a Promise in JavaScript?', category: 'Technical', difficulty: 'Medium', company: 'Adobe', expectedTopics: ['promise', 'async', 'resolve', 'reject'] },
  { id: 'tech-25', question: 'Explain database transactions.', category: 'Technical', difficulty: 'Medium', company: 'Oracle', expectedTopics: ['transaction', 'commit', 'rollback'] },
  { id: 'tech-26', question: 'What is a primary key vs foreign key?', category: 'Technical', difficulty: 'Easy', company: 'IBM', expectedTopics: ['unique', 'reference', 'relationship'] },
  { id: 'tech-27', question: 'Explain HTTP status codes.', category: 'Technical', difficulty: 'Easy', company: 'JP Morgan', expectedTopics: ['2xx', '4xx', '5xx'] },
  { id: 'tech-28', question: 'What is a race condition?', category: 'Technical', difficulty: 'Hard', company: 'Flipkart', expectedTopics: ['concurrency', 'shared state', 'synchronization'] },
  { id: 'tech-29', question: 'Explain SOLID principles.', category: 'Technical', difficulty: 'Hard', company: 'Walmart', expectedTopics: ['srp', 'ocp', 'lsp', 'isp', 'dip'] },
  { id: 'tech-30', question: 'What is the difference between authentication and authorization?', category: 'Technical', difficulty: 'Easy', company: 'HighRadius', expectedTopics: ['identity', 'permissions', 'access'] },
  { id: 'tech-31', question: 'Explain API rate limiting.', category: 'Technical', difficulty: 'Medium', company: 'Google', expectedTopics: ['limit', 'throttle', 'token bucket'] },
  { id: 'tech-32', question: 'What is horizontal vs vertical scaling?', category: 'Technical', difficulty: 'Medium', company: 'Microsoft', expectedTopics: ['more machines', 'more power', 'tradeoffs'] },
  { id: 'tech-33', question: 'Explain shallow vs deep copy.', category: 'Technical', difficulty: 'Medium', company: 'Amazon', expectedTopics: ['reference', 'clone', 'nested'] },
  { id: 'tech-34', question: 'What is a CDN?', category: 'Technical', difficulty: 'Easy', company: 'Adobe', expectedTopics: ['content', 'edge', 'latency'] },
  { id: 'tech-35', question: 'Explain the concept of a database index.', category: 'Technical', difficulty: 'Medium', company: 'Oracle', expectedTopics: ['index', 'lookup', 'overhead'] },
  { id: 'tech-36', question: 'What is a WebSocket?', category: 'Technical', difficulty: 'Medium', company: 'IBM', expectedTopics: ['full-duplex', 'persistent', 'realtime'] },
  { id: 'tech-37', question: 'Explain model–view–controller pattern.', category: 'Technical', difficulty: 'Medium', company: 'JP Morgan', expectedTopics: ['model', 'view', 'controller', 'separation'] },
  { id: 'tech-38', question: 'What is the difference between a linked list and an array?', category: 'Technical', difficulty: 'Easy', company: 'Flipkart', expectedTopics: ['contiguous', 'nodes', 'access'] },
  { id: 'tech-39', question: 'Explain memory stack vs heap.', category: 'Technical', difficulty: 'Medium', company: 'Walmart', expectedTopics: ['stack', 'heap', 'allocation'] },
  { id: 'tech-40', question: 'What is idempotency in APIs?', category: 'Technical', difficulty: 'Hard', company: 'HighRadius', expectedTopics: ['same request', 'no side effect', 'retry'] },

  // ── DSA (30) ─────────────────────────────────────────────────────────
  { id: 'dsa-01', question: 'Reverse a linked list.', category: 'DSA', difficulty: 'Easy', company: 'Google', expectedTopics: ['linked list', 'pointers', 'iteration'] },
  { id: 'dsa-02', question: 'Find the longest substring without repeating characters.', category: 'DSA', difficulty: 'Medium', company: 'Microsoft', expectedTopics: ['sliding window', 'hashmap', 'unique'] },
  { id: 'dsa-03', question: 'Implement binary search.', category: 'DSA', difficulty: 'Easy', company: 'Amazon', expectedTopics: ['binary search', 'sorted', 'log n'] },
  { id: 'dsa-04', question: 'Detect a cycle in a linked list.', category: 'DSA', difficulty: 'Medium', company: 'Adobe', expectedTopics: ['cycle', 'floyd', 'tortoise'] },
  { id: 'dsa-05', question: 'Solve the two-sum problem.', category: 'DSA', difficulty: 'Easy', company: 'Oracle', expectedTopics: ['hashmap', 'pair', 'complement'] },
  { id: 'dsa-06', question: 'Implement merge sort.', category: 'DSA', difficulty: 'Medium', company: 'IBM', expectedTopics: ['divide', 'conquer', 'merge'] },
  { id: 'dsa-07', question: 'Find the longest palindromic substring.', category: 'DSA', difficulty: 'Hard', company: 'JP Morgan', expectedTopics: ['palindrome', 'expand', 'dp'] },
  { id: 'dsa-08', question: 'Implement a stack using arrays.', category: 'DSA', difficulty: 'Easy', company: 'Flipkart', expectedTopics: ['stack', 'push', 'pop'] },
  { id: 'dsa-09', question: 'Solve the knapsack problem using DP.', category: 'DSA', difficulty: 'Hard', company: 'Walmart', expectedTopics: ['dynamic programming', 'optimization', 'capacity'] },
  { id: 'dsa-10', question: 'Traverse a binary tree in order.', category: 'DSA', difficulty: 'Medium', company: 'HighRadius', expectedTopics: ['binary tree', 'inorder', 'recursion'] },
  { id: 'dsa-11', question: 'Find the maximum subarray sum.', category: 'DSA', difficulty: 'Medium', company: 'Google', expectedTopics: ['kadane', 'subarray', 'max'] },
  { id: 'dsa-12', question: 'Implement breadth-first search on a graph.', category: 'DSA', difficulty: 'Medium', company: 'Microsoft', expectedTopics: ['bfs', 'queue', 'visited'] },
  { id: 'dsa-13', question: 'Detect a cycle in a directed graph.', category: 'DSA', difficulty: 'Hard', company: 'Amazon', expectedTopics: ['dfs', 'recursion stack', 'cycle'] },
  { id: 'dsa-14', question: 'Find the kth largest element.', category: 'DSA', difficulty: 'Medium', company: 'Adobe', expectedTopics: ['heap', 'quickselect', 'partition'] },
  { id: 'dsa-15', question: 'Implement a queue using two stacks.', category: 'DSA', difficulty: 'Medium', company: 'Oracle', expectedTopics: ['queue', 'stack', 'amortized'] },
  { id: 'dsa-16', question: 'Merge two sorted arrays.', category: 'DSA', difficulty: 'Easy', company: 'IBM', expectedTopics: ['merge', 'two pointers', 'sorted'] },
  { id: 'dsa-17', question: 'Find the lowest common ancestor in a BST.', category: 'DSA', difficulty: 'Medium', company: 'JP Morgan', expectedTopics: ['bst', 'lca', 'traversal'] },
  { id: 'dsa-18', question: 'Solve the coin change problem.', category: 'DSA', difficulty: 'Hard', company: 'Flipkart', expectedTopics: ['dp', 'coins', 'minimum'] },
  { id: 'dsa-19', question: 'Implement quick sort.', category: 'DSA', difficulty: 'Medium', company: 'Walmart', expectedTopics: ['partition', 'pivot', 'recursion'] },
  { id: 'dsa-20', question: 'Check if a string has valid parentheses.', category: 'DSA', difficulty: 'Easy', company: 'HighRadius', expectedTopics: ['stack', 'matching', 'brackets'] },
  { id: 'dsa-21', question: 'Find the number of islands in a grid.', category: 'DSA', difficulty: 'Medium', company: 'Google', expectedTopics: ['dfs', 'grid', 'connected'] },
  { id: 'dsa-22', question: 'Implement a priority queue.', category: 'DSA', difficulty: 'Medium', company: 'Microsoft', expectedTopics: ['heap', 'priority', 'insert'] },
  { id: 'dsa-23', question: 'Find the medians of two sorted arrays.', category: 'DSA', difficulty: 'Hard', company: 'Amazon', expectedTopics: ['binary search', 'median', 'partition'] },
  { id: 'dsa-24', question: 'Rotate an array by k positions.', category: 'DSA', difficulty: 'Easy', company: 'Adobe', expectedTopics: ['rotation', 'reverse', 'in-place'] },
  { id: 'dsa-25', question: 'Implement longest increasing subsequence.', category: 'DSA', difficulty: 'Hard', company: 'Oracle', expectedTopics: ['lis', 'dp', 'binary search'] },
  { id: 'dsa-26', question: 'Find the top frequent elements.', category: 'DSA', difficulty: 'Medium', company: 'IBM', expectedTopics: ['frequency', 'heap', 'hashmap'] },
  { id: 'dsa-27', question: 'Implement a trie (prefix tree).', category: 'DSA', difficulty: 'Hard', company: 'JP Morgan', expectedTopics: ['trie', 'prefix', 'search'] },
  { id: 'dsa-28', question: 'Check if a binary tree is balanced.', category: 'DSA', difficulty: 'Medium', company: 'Flipkart', expectedTopics: ['height', 'recursion', 'balanced'] },
  { id: 'dsa-29', question: 'Find the shortest path (Dijkstra).', category: 'DSA', difficulty: 'Hard', company: 'Walmart', expectedTopics: ['dijkstra', 'graph', 'shortest'] },
  { id: 'dsa-30', question: 'Reverse words in a string.', category: 'DSA', difficulty: 'Medium', company: 'HighRadius', expectedTopics: ['string', 'split', 'reverse'] },

  // ── System Design (20) ───────────────────────────────────────────────
  { id: 'sys-01', question: 'Design a URL shortener.', category: 'System Design', difficulty: 'Medium', company: 'Google', expectedTopics: ['hash', 'short url', 'redirect'] },
  { id: 'sys-02', question: 'Design a chat application.', category: 'System Design', difficulty: 'Medium', company: 'Microsoft', expectedTopics: ['websocket', 'realtime', 'message'] },
  { id: 'sys-03', question: 'Design a rate limiter.', category: 'System Design', difficulty: 'Medium', company: 'Amazon', expectedTopics: ['token bucket', 'throttle', 'requests'] },
  { id: 'sys-04', question: 'Design a news feed.', category: 'System Design', difficulty: 'Hard', company: 'Adobe', expectedTopics: ['feed', 'ranking', 'fanout'] },
  { id: 'sys-05', question: 'Design a database schema for an e-commerce app.', category: 'System Design', difficulty: 'Medium', company: 'Oracle', expectedTopics: ['schema', 'products', 'orders'] },
  { id: 'sys-06', question: 'Design a distributed cache.', category: 'System Design', difficulty: 'Hard', company: 'IBM', expectedTopics: ['cache', 'eviction', 'distribution'] },
  { id: 'sys-07', question: 'Design a payment system.', category: 'System Design', difficulty: 'Hard', company: 'JP Morgan', expectedTopics: ['transaction', 'idempotency', 'security'] },
  { id: 'sys-08', question: 'Design a recommendation system.', category: 'System Design', difficulty: 'Hard', company: 'Flipkart', expectedTopics: ['recommendation', 'collaborative', 'ranking'] },
  { id: 'sys-09', question: 'Design a ride-sharing service.', category: 'System Design', difficulty: 'Hard', company: 'Walmart', expectedTopics: ['matching', 'live location', 'scalability'] },
  { id: 'sys-10', question: 'Design a file storage service.', category: 'System Design', difficulty: 'Medium', company: 'HighRadius', expectedTopics: ['storage', 'upload', 'retrieval'] },
  { id: 'sys-11', question: 'Design Twitter.', category: 'System Design', difficulty: 'Hard', company: 'Google', expectedTopics: ['tweets', 'timeline', 'fanout'] },
  { id: 'sys-12', question: 'Design a notification service.', category: 'System Design', difficulty: 'Medium', company: 'Microsoft', expectedTopics: ['push', 'queue', 'delivery'] },
  { id: 'sys-13', question: 'Design a search autocomplete system.', category: 'System Design', difficulty: 'Medium', company: 'Amazon', expectedTopics: ['trie', 'suggestions', 'ranking'] },
  { id: 'sys-14', question: 'Design a video streaming platform.', category: 'System Design', difficulty: 'Hard', company: 'Adobe', expectedTopics: ['cdn', 'streaming', 'transcoding'] },
  { id: 'sys-15', question: 'Design a logging system.', category: 'System Design', difficulty: 'Medium', company: 'Oracle', expectedTopics: ['log', 'ingestion', 'storage'] },
  { id: 'sys-16', question: 'Design a load balancer.', category: 'System Design', difficulty: 'Medium', company: 'IBM', expectedTopics: ['routing', 'health check', 'scaling'] },
  { id: 'sys-17', question: 'Design a job scheduler.', category: 'System Design', difficulty: 'Hard', company: 'JP Morgan', expectedTopics: ['queue', 'cron', 'priority'] },
  { id: 'sys-18', question: 'Design a content delivery network.', category: 'System Design', difficulty: 'Medium', company: 'Flipkart', expectedTopics: ['edge', 'cache', 'latency'] },
  { id: 'sys-19', question: 'Design an online booking system.', category: 'System Design', difficulty: 'Medium', company: 'Walmart', expectedTopics: ['booking', 'availability', 'concurrency'] },
  { id: 'sys-20', question: 'Design a real-time analytics dashboard.', category: 'System Design', difficulty: 'Hard', company: 'HighRadius', expectedTopics: ['streaming', 'aggregation', 'visualization'] },
]

/* ------------------------------- Helpers ------------------------------- */

/** Get questions for a given interview type. */
export function getQuestionsForType(type: InterviewType): InterviewQuestion[] {
  return QUESTION_BANK.filter((q) => q.category === type)
}

/** Build a mock interview session from the selected options. */
export function buildMockInterviewSession(
  company: string,
  type: InterviewType,
  difficulty: Difficulty,
  duration: number,
): InterviewSession {
  const pool = QUESTION_BANK.filter(
    (q) => q.category === type && q.difficulty === difficulty,
  ).concat(QUESTION_BANK.filter((q) => q.category === type && q.difficulty !== difficulty))

  const count = Math.min(duration === 60 ? 8 : duration === 45 ? 6 : duration === 30 ? 5 : 4, pool.length)
  const picked = pool.slice(0, count)

  return {
    id: `${type.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    company,
    type,
    difficulty,
    duration,
    questions: picked,
  }
}

/** Deterministic mock score breakdown. */
export function computeInterviewScore(
  session: InterviewSession,
  answeredCount: number,
): InterviewScore {
  const total = session.questions.length
  const ratio = total > 0 ? answeredCount / total : 0
  const base = Math.round(ratio * 100)
  const difficultyOffset =
    session.difficulty === 'Easy' ? 6 : session.difficulty === 'Medium' ? 0 : -6

  const communication = clamp(base + difficultyOffset, 20, 100)
  const technical = clamp(base - 4 + difficultyOffset, 20, 100)
  const confidence = clamp(base + 8 + difficultyOffset, 20, 100)
  const problemSolving = clamp(base - 2 + difficultyOffset, 20, 100)
  const overall = Math.round(
    (communication + technical + confidence + problemSolving) / 4,
  )

  return { communication, technical, confidence, problemSolving, overall }
}

/** Build mock feedback from a score. */
export function buildFeedback(score: InterviewScore): Feedback {
  if (score.overall >= 80) {
    return {
      strengths: ['Clear and structured communication', 'Strong technical depth', 'Good time management under pressure'],
      weaknesses: ['Could go deeper on edge cases', 'Occasionally rushed explanations'],
      suggestions: ['Practice explaining out loud', 'Revisit advanced system design trade-offs'],
    }
  }
  if (score.overall >= 60) {
    return {
      strengths: ['Good participation', 'Solid grasp of core concepts'],
      weaknesses: ['Needs stronger conceptual clarity', 'Answers could be more concise'],
      suggestions: ['Review core fundamentals', 'Practice timed mock interviews'],
    }
  }
  return {
    strengths: ['Willingness to engage with questions'],
    weaknesses: ['Needs deeper preparation', 'Weak on core fundamentals'],
    suggestions: ['Revise fundamentals first', 'Do more mock interviews to build confidence'],
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/* ------------------------------- Seeded history ------------------------------- */

export const SEEDED_HISTORY: InterviewRecord[] = [
  { id: 'iv-001', company: 'Google', date: '2025-08-02', type: 'DSA', score: 82, duration: 45, result: 'Passed' },
  { id: 'iv-002', company: 'Microsoft', date: '2025-08-05', type: 'HR', score: 88, duration: 15, result: 'Excellent' },
  { id: 'iv-003', company: 'Amazon', date: '2025-08-09', type: 'Technical', score: 74, duration: 30, result: 'Passed' },
  { id: 'iv-004', company: 'Adobe', date: '2025-08-12', type: 'System Design', score: 91, duration: 60, result: 'Excellent' },
  { id: 'iv-005', company: 'Flipkart', date: '2025-08-15', type: 'DSA', score: 58, duration: 30, result: 'Needs Work' },
]
