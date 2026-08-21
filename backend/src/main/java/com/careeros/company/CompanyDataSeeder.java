package com.careeros.company;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CompanyDataSeeder implements ApplicationRunner {

    private final CompanyRepository companyRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (companyRepository.count() > 0) {
            log.info("Companies table already seeded (count={}). Skipping seed.", companyRepository.count());
            return;
        }

        log.info("Seeding production company profiles, interview processes, and preparation topics...");

        List<CompanyEntity> companies = List.of(
                buildGoogle(),
                buildMicrosoft(),
                buildAmazon(),
                buildAtlassian(),
                buildAdobe(),
                buildGoldmanSachs(),
                buildUber(),
                buildFlipkart()
        );

        companyRepository.saveAll(companies);
        log.info("Successfully seeded {} companies with interview processes and preparation topics.", companies.size());
    }

    private CompanyEntity buildGoogle() {
        CompanyEntity c = CompanyEntity.builder()
                .name("Google")
                .slug("google")
                .logoUrl("G")
                .website("https://careers.google.com")
                .description("Google LLC is an American multinational technology company focusing on search, cloud computing, software, and AI.")
                .industry("Technology & Cloud")
                .packageInfo("₹45–60 LPA")
                .location("Bengaluru, Hyderabad, Pune")
                .difficulty("Hard")
                .active(true)
                .roles(new ArrayList<>())
                .interviewProcesses(new ArrayList<>())
                .prepTopics(new ArrayList<>())
                .build();

        c.getRoles().add(CompanyRoleEntity.builder()
                .company(c)
                .title("Software Engineer - Early Career / L3")
                .location("Bengaluru / Hyderabad")
                .experienceLevel("Fresher to 1 Year")
                .eligibilityInfo("B.Tech / M.Tech in CS/IT or related field, 7.5+ CGPA preferred")
                .requiredSkills("DSA, C++, Java, Python, System Design Fundamentals")
                .build());

        c.getRoles().add(CompanyRoleEntity.builder()
                .company(c)
                .title("Associate Site Reliability Engineer")
                .location("Hyderabad")
                .experienceLevel("0–2 Years")
                .eligibilityInfo("B.Tech in CS/IT/ECE, strong fundamentals in OS & Networking")
                .requiredSkills("Linux Internals, Networking, Python, Go, Distributed Systems")
                .build());

        // Process rounds
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(1).roundName("Online Assessment").roundType("ONLINE_ASSESSMENT")
                .description("2 hard algorithmic problems on Google internal platform (90 mins).")
                .preparationRequirements("Focus on Graphs, DP on Trees, and Segment Trees with O(N log N) constraints.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(2).roundName("Technical Interview 1 — Data Structures").roundType("DSA")
                .description("Live problem solving on Google Docs or CoderPad without compiler execution.")
                .preparationRequirements("Explain edge cases, invariant preservation, and precise time/space complexity.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(3).roundName("Technical Interview 2 — Advanced Algorithms").roundType("TECHNICAL")
                .description("Complex multi-part problem (e.g. Graph traversals with caching, Shortest path variations).")
                .preparationRequirements("Write clean modular code and handle follow-up scale questions.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(4).roundName("Googliness & Behavioral Round").roundType("BEHAVIORAL")
                .description("Hypothetical and past behavioral questions assessing collaboration, ambiguity handling, and ethics.")
                .preparationRequirements("Use STAR method; highlight team-first mindset and intellectual humility.")
                .build());

        // Prep Topics
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("DSA").topic("Dynamic Programming on Trees & Bitmask DP")
                .priority("High").estimatedEffort("8 hours")
                .resourcesJson("[{\"title\":\"Google Tagged DP Problems\",\"url\":\"https://leetcode.com\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("DSA").topic("Graph Algorithms (Dijkstra, Tarjan SCC, Topological Sort)")
                .priority("High").estimatedEffort("6 hours")
                .resourcesJson("[{\"title\":\"Graph Theory Masterclass\",\"url\":\"https://cp-algorithms.com\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("Core CS").topic("Operating Systems & Memory Management (Paging, TLB, Virtual Memory)")
                .priority("Medium").estimatedEffort("4 hours")
                .resourcesJson("[{\"title\":\"OSTEP Notes\",\"url\":\"https://pages.cs.wisc.edu/~remzi/OSTEP/\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("Behavioral").topic("Googliness & Leadership Scenarios (STAR Framework)")
                .priority("High").estimatedEffort("3 hours")
                .resourcesJson("[{\"title\":\"Googliness Principles Guide\",\"url\":\"https://careers.google.com\"}]")
                .build());

        return c;
    }

    private CompanyEntity buildMicrosoft() {
        CompanyEntity c = CompanyEntity.builder()
                .name("Microsoft")
                .slug("microsoft")
                .logoUrl("MS")
                .website("https://careers.microsoft.com")
                .description("Microsoft Corporation is an American multinational technology corporation producing computer software, cloud computing, and hardware.")
                .industry("Cloud & Enterprise Software")
                .packageInfo("₹42–52 LPA")
                .location("Hyderabad, Bengaluru, Noida")
                .difficulty("Medium")
                .active(true)
                .roles(new ArrayList<>())
                .interviewProcesses(new ArrayList<>())
                .prepTopics(new ArrayList<>())
                .build();

        c.getRoles().add(CompanyRoleEntity.builder()
                .company(c)
                .title("Software Engineer - University Graduate")
                .location("Hyderabad / Bengaluru / Noida")
                .experienceLevel("Fresher")
                .eligibilityInfo("B.Tech/B.E/M.Tech with 7.0+ CGPA")
                .requiredSkills("DSA, OOP, C#, Java, C++, Low-Level Design")
                .build());

        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(1).roundName("Codility Online Assessment").roundType("ONLINE_ASSESSMENT")
                .description("3 coding problems in 90 minutes testing arrays, strings, and hash maps.")
                .preparationRequirements("Focus on clean syntax and 100% test case pass rate.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(2).roundName("Technical Round 1 — DSA & Problem Solving").roundType("DSA")
                .description("Binary Trees, Linked Lists, and Recursion with live code execution.")
                .preparationRequirements("Explain solution out loud and test on custom test cases.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(3).roundName("Technical Round 2 — OOP & Low-Level Design").roundType("TECHNICAL")
                .description("Design patterns (Factory, Observer, Singleton) and Class diagram implementation.")
                .preparationRequirements("SOLID principles, clean architecture, and exception handling.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(4).roundName("AA (As-Appropriate) Managerial Round").roundType("HR")
                .description("Culture fit, project architecture deep-dive, and leadership principles.")
                .preparationRequirements("Be ready to defend architectural choices made in resume projects.")
                .build());

        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("DSA").topic("Trees & Binary Search Trees (LCA, Views, Traversals)")
                .priority("High").estimatedEffort("5 hours")
                .resourcesJson("[{\"title\":\"Tree Mastery Problems\",\"url\":\"https://leetcode.com\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("Design").topic("Object-Oriented Design Patterns & SOLID Principles")
                .priority("High").estimatedEffort("6 hours")
                .resourcesJson("[{\"title\":\"Refactoring Guru Design Patterns\",\"url\":\"https://refactoring.guru\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("Core CS").topic("Database Systems (Indexing, Normalization, SQL queries)")
                .priority("Medium").estimatedEffort("4 hours")
                .resourcesJson("[{\"title\":\"SQL Interview Prep\",\"url\":\"https://leetcode.com\"}]")
                .build());

        return c;
    }

    private CompanyEntity buildAmazon() {
        CompanyEntity c = CompanyEntity.builder()
                .name("Amazon")
                .slug("amazon")
                .logoUrl("A")
                .website("https://amazon.jobs")
                .description("Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing (AWS), and digital streaming.")
                .industry("E-Commerce & Cloud (AWS)")
                .packageInfo("₹44–54 LPA")
                .location("Bengaluru, Hyderabad, Chennai, Gurugram")
                .difficulty("Medium")
                .active(true)
                .roles(new ArrayList<>())
                .interviewProcesses(new ArrayList<>())
                .prepTopics(new ArrayList<>())
                .build();

        c.getRoles().add(CompanyRoleEntity.builder()
                .company(c)
                .title("Software Development Engineer I (SDE-I)")
                .location("Bengaluru / Hyderabad")
                .experienceLevel("Fresher to 1 Year")
                .eligibilityInfo("Bachelor's or Master's in Computer Science or related field")
                .requiredSkills("Java, C++, DSA, OOP, AWS Basics, 16 Leadership Principles")
                .build());

        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(1).roundName("Amazon Online Assessment (OA)").roundType("ONLINE_ASSESSMENT")
                .description("2 Coding problems + Work Simulation & Work Style Assessment (105 mins).")
                .preparationRequirements("Practice 16 Leadership Principles in work simulation choices.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(2).roundName("Technical Interview 1 — Coding & LP").roundType("DSA")
                .description("DSA Problem + 15 mins deep-dive on 2 Leadership Principles with STAR stories.")
                .preparationRequirements("Have 2 unique stories per Leadership Principle ready.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(3).roundName("Technical Interview 2 — Advanced DSA & OOP").roundType("TECHNICAL")
                .description("Multi-threading, Priority Queues, Hash Maps, and Object-Oriented Modeling.")
                .preparationRequirements("Write compile-ready modular code with clean variable naming.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(4).roundName("Bar Raiser Interview").roundType("MIXED")
                .description("Independent Amazonian evaluating whether candidate raises the company bar.")
                .preparationRequirements("Demonstrate Customer Obsession, Ownership, and Bias for Action.")
                .build());

        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("Behavioral").topic("Amazon 16 Leadership Principles (STAR Stories Matrix)")
                .priority("High").estimatedEffort("6 hours")
                .resourcesJson("[{\"title\":\"Amazon LP Guide\",\"url\":\"https://amazon.jobs/principles\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("DSA").topic("Heaps, Priority Queues & Top K Elements")
                .priority("High").estimatedEffort("4 hours")
                .resourcesJson("[{\"title\":\"Amazon Tagged Heap Problems\",\"url\":\"https://leetcode.com\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("DSA").topic("Breadth-First Search & Dijkstra on Grids")
                .priority("High").estimatedEffort("5 hours")
                .resourcesJson("[{\"title\":\"Grid BFS Masterclass\",\"url\":\"https://leetcode.com\"}]")
                .build());

        return c;
    }

    private CompanyEntity buildAtlassian() {
        CompanyEntity c = CompanyEntity.builder()
                .name("Atlassian")
                .slug("atlassian")
                .logoUrl("AT")
                .website("https://www.atlassian.com/company/careers")
                .description("Atlassian Corporation is an Australian software company that develops products for software developers, project managers, and content management (Jira, Confluence, Trello).")
                .industry("Developer Tools & SaaS")
                .packageInfo("₹50–65 LPA")
                .location("Bengaluru (Remote First)")
                .difficulty("Hard")
                .active(true)
                .roles(new ArrayList<>())
                .interviewProcesses(new ArrayList<>())
                .prepTopics(new ArrayList<>())
                .build();

        c.getRoles().add(CompanyRoleEntity.builder()
                .company(c)
                .title("Associate Software Engineer")
                .location("Bengaluru / Remote")
                .experienceLevel("Fresher to 1 Year")
                .eligibilityInfo("B.Tech / M.Tech in Computer Science")
                .requiredSkills("Java, Kotlin, TypeScript, React, System Design, Concurrency")
                .build());

        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(1).roundName("Online Coding Assessment").roundType("ONLINE_ASSESSMENT")
                .description("Hackerrank 3 algorithmic problems (90 mins).")
                .preparationRequirements("Focus on Hash Maps, Intervals, and Rate Limiting logic.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(2).roundName("Coding & Data Structures").roundType("DSA")
                .description("Live interactive coding with emphasis on code maintainability and testability.")
                .preparationRequirements("Write unit tests and follow clean code conventions.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(3).roundName("System Design / Craft Round").roundType("SYSTEM_DESIGN")
                .description("Designing collaborative real-time tools (e.g. Document editor, Jira sprint board).")
                .preparationRequirements("WebSockets, Caching, Event-driven architecture, and Database schema design.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(4).roundName("Values & Culture Interview").roundType("BEHAVIORAL")
                .description("Evaluating Atlassian 5 Core Values (e.g. 'Open company, no bullshit').")
                .preparationRequirements("Provide transparent, authentic retrospective examples from past projects.")
                .build());

        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("System Design").topic("Real-time Collaborative Systems & WebSockets")
                .priority("High").estimatedEffort("8 hours")
                .resourcesJson("[{\"title\":\"Designing Data-Intensive Applications\",\"url\":\"https://dataintensive.net\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("DSA").topic("Interval Scheduling & Sliding Window Patterns")
                .priority("High").estimatedEffort("4 hours")
                .resourcesJson("[{\"title\":\"Interval LeetCode Tagged\",\"url\":\"https://leetcode.com\"}]")
                .build());

        return c;
    }

    private CompanyEntity buildAdobe() {
        CompanyEntity c = CompanyEntity.builder()
                .name("Adobe")
                .slug("adobe")
                .logoUrl("AD")
                .website("https://www.adobe.com/careers.html")
                .description("Adobe Inc. is an American multinational computer software company focusing on creativity and multimedia software products.")
                .industry("Creative & Digital Experience Software")
                .packageInfo("₹40–50 LPA")
                .location("Noida, Bengaluru")
                .difficulty("Medium")
                .active(true)
                .roles(new ArrayList<>())
                .interviewProcesses(new ArrayList<>())
                .prepTopics(new ArrayList<>())
                .build();

        c.getRoles().add(CompanyRoleEntity.builder()
                .company(c)
                .title("Software Engineer - Digital Media")
                .location("Noida / Bengaluru")
                .experienceLevel("Fresher to 1 Year")
                .eligibilityInfo("B.Tech / M.Tech in CS/IT/ECE with 7.5+ CGPA")
                .requiredSkills("C++, Java, Graphics Fundamentals, Multi-threading, DSA")
                .build());

        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(1).roundName("Aptitude & Technical OA").roundType("ONLINE_ASSESSMENT")
                .description("MCQs on C++/Java, OS, DBMS, and 2 Coding Questions.")
                .preparationRequirements("Brush up Core CS fundamentals and pointers/references.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(2).roundName("Technical Interview 1 — Core DSA").roundType("DSA")
                .description("Arrays, Strings, Recursion, and Bit Manipulation.")
                .preparationRequirements("Focus on optimal time and in-place space complexity.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(3).roundName("Technical Interview 2 — CS Fundamentals & Low-Level Code").roundType("TECHNICAL")
                .description("Operating Systems, Thread safety, Garbage collection, and Database transactions.")
                .preparationRequirements("Explain ACID properties, Mutex vs Semaphore, and Virtual Functions.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(4).roundName("Director / HR Round").roundType("HR")
                .description("Discussion on aspirations, product ideas, and cultural fit.")
                .preparationRequirements("Show genuine interest in Adobe's AI (Firefly) & Cloud tools.")
                .build());

        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("DSA").topic("Bit Manipulation & Array In-Place Transformations")
                .priority("Medium").estimatedEffort("4 hours")
                .resourcesJson("[{\"title\":\"Bit Manipulation Tricks\",\"url\":\"https://leetcode.com\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("Core CS").topic("Multi-threading, Locks, and Concurrency in Java/C++")
                .priority("High").estimatedEffort("6 hours")
                .resourcesJson("[{\"title\":\"Java Concurrency in Practice\",\"url\":\"https://jcip.net\"}]")
                .build());

        return c;
    }

    private CompanyEntity buildGoldmanSachs() {
        CompanyEntity c = CompanyEntity.builder()
                .name("Goldman Sachs")
                .slug("goldman-sachs")
                .logoUrl("GS")
                .website("https://www.goldmansachs.com/careers")
                .description("The Goldman Sachs Group, Inc. is a leading global investment banking, securities and investment management firm.")
                .industry("Fintech & Investment Banking")
                .packageInfo("₹38–48 LPA")
                .location("Bengaluru, Hyderabad")
                .difficulty("Hard")
                .active(true)
                .roles(new ArrayList<>())
                .interviewProcesses(new ArrayList<>())
                .prepTopics(new ArrayList<>())
                .build();

        c.getRoles().add(CompanyRoleEntity.builder()
                .company(c)
                .title("Analyst - Global Markets / Core Engineering")
                .location("Bengaluru")
                .experienceLevel("Fresher to 1 Year")
                .eligibilityInfo("B.Tech / M.Tech in CS/EE/Math with 7.0+ CGPA")
                .requiredSkills("Java, C++, High-Performance Computing, Data Structures, Mathematics")
                .build());

        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(1).roundName("HackerRank Coding & Math OA").roundType("ONLINE_ASSESSMENT")
                .description("Advanced DSA problems + Quantitative Aptitude & Mathematics section.")
                .preparationRequirements("Probability, Combinatorics, and Number Theory practice.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(2).roundName("Technical Round 1 — Algorithmic Problem Solving").roundType("DSA")
                .description("Hash Maps, Two Pointers, String manipulation, and dynamic programming.")
                .preparationRequirements("Write clean, modular code with minimal memory overhead.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(3).roundName("Technical Round 2 — Mathematics, Puzzles & Systems").roundType("TECHNICAL")
                .description("Probability puzzles, low-latency considerations, and multi-threaded data structures.")
                .preparationRequirements("Practice 50 classic Goldman Sachs interview puzzles.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(4).roundName("Managing Director Round").roundType("HR")
                .description("Integrity, high-pressure handling, and commitment to financial ethics.")
                .preparationRequirements("Understand basic financial concepts and show composure.")
                .build());

        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("Math & Puzzles").topic("Probability, Combinatorics & Classic Quant Puzzles")
                .priority("High").estimatedEffort("6 hours")
                .resourcesJson("[{\"title\":\"Heard on the Street Puzzles\",\"url\":\"https://www.amazon.com/Heard-Street-Quantitative-Questions-Interviews/dp/0998116328\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("DSA").topic("Two Pointers, Sliding Window & Hash Maps")
                .priority("High").estimatedEffort("5 hours")
                .resourcesJson("[{\"title\":\"GS Tagged Problems\",\"url\":\"https://leetcode.com\"}]")
                .build());

        return c;
    }

    private CompanyEntity buildUber() {
        CompanyEntity c = CompanyEntity.builder()
                .name("Uber")
                .slug("uber")
                .logoUrl("UB")
                .website("https://www.uber.com/careers")
                .description("Uber Technologies, Inc. is an American multinational transportation company providing ride-hailing, food delivery, and freight services.")
                .industry("Mobility & Logistics Tech")
                .packageInfo("₹48–60 LPA")
                .location("Bengaluru, Hyderabad")
                .difficulty("Hard")
                .active(true)
                .roles(new ArrayList<>())
                .interviewProcesses(new ArrayList<>())
                .prepTopics(new ArrayList<>())
                .build();

        c.getRoles().add(CompanyRoleEntity.builder()
                .company(c)
                .title("Software Engineer - Uber Mobility")
                .location("Bengaluru / Hyderabad")
                .experienceLevel("Fresher to 1 Year")
                .eligibilityInfo("B.Tech / M.Tech in CS/IT")
                .requiredSkills("Go, Java, Python, Microservices, Geospatial Indexes (H3), Kafka")
                .build());

        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(1).roundName("Online Assessment").roundType("ONLINE_ASSESSMENT")
                .description("3 complex algorithmic problems testing dynamic programming and graphs.")
                .preparationRequirements("High speed and edge case verification.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(2).roundName("Technical Interview 1 — Graphs & Hard DSA").roundType("DSA")
                .description("Shortest path, Graph BFS/DFS, and Trie implementations.")
                .preparationRequirements("Explain time complexity and space trade-offs accurately.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(3).roundName("Technical Interview 2 — Machine Coding / LLD").roundType("TECHNICAL")
                .description("Design a ride-matching system or ride rate limiter in 60 minutes with working code.")
                .preparationRequirements("Clean object modeling, thread safety, and test cases.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(4).roundName("Hiring Manager & Culture").roundType("BEHAVIORAL")
                .description("Uber core competencies: Build with heart, See the forest and trees, Great minds don't think alike.")
                .preparationRequirements("STAR format on overcoming engineering challenges.")
                .build());

        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("DSA").topic("Tries & Prefix Trees with Autocomplete")
                .priority("High").estimatedEffort("4 hours")
                .resourcesJson("[{\"title\":\"Trie Practice Set\",\"url\":\"https://leetcode.com\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("System Design").topic("Geospatial Indexing (H3, QuadTrees, GeoHashing)")
                .priority("High").estimatedEffort("7 hours")
                .resourcesJson("[{\"title\":\"Uber Engineering Blog: H3\",\"url\":\"https://www.uber.com/blog/h3/\"}]")
                .build());

        return c;
    }

    private CompanyEntity buildFlipkart() {
        CompanyEntity c = CompanyEntity.builder()
                .name("Flipkart")
                .slug("flipkart")
                .logoUrl("FK")
                .website("https://www.flipkartcareers.com")
                .description("Flipkart is one of India's leading e-commerce marketplaces with businesses including Myntra, Flipkart Wholesale, and Cleartrip.")
                .industry("E-Commerce & Supply Chain")
                .packageInfo("₹32–42 LPA")
                .location("Bengaluru")
                .difficulty("Medium")
                .active(true)
                .roles(new ArrayList<>())
                .interviewProcesses(new ArrayList<>())
                .prepTopics(new ArrayList<>())
                .build();

        c.getRoles().add(CompanyRoleEntity.builder()
                .company(c)
                .title("Software Development Engineer - I (SDE-1)")
                .location("Bengaluru")
                .experienceLevel("Fresher")
                .eligibilityInfo("B.Tech / M.Tech in CS/IT or related field, 7.0+ CGPA")
                .requiredSkills("Java, Multi-threading, OOP, Machine Coding, Low Level Design")
                .build());

        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(1).roundName("Online Coding Test").roundType("ONLINE_ASSESSMENT")
                .description("3 DSA questions on Arrays, DP, and Trees (90 mins).")
                .preparationRequirements("Focus on standard LeetCode Medium/Hard patterns.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(2).roundName("Machine Coding Round (Famous Flipkart Round)").roundType("TECHNICAL")
                .description("Design and code a fully functional Object-Oriented system (e.g. Snake & Ladder, In-Memory DB, Splitwise) in 90 mins.")
                .preparationRequirements("Clean OOP, clean separation of concerns, interfaces, and driving main class.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(3).roundName("DSA & Problem Solving Round").roundType("DSA")
                .description("Complex DSA problem with live optimization.")
                .preparationRequirements("Focus on tree/graph traversals and heap optimizations.")
                .build());
        c.getInterviewProcesses().add(InterviewProcessEntity.builder()
                .company(c).roundNumber(4).roundName("Hiring Manager Round").roundType("HR")
                .description("Cultural alignment, work ethics, and project deep dives.")
                .preparationRequirements("Demonstrate problem-solving tenacity and customer focus.")
                .build());

        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("Design").topic("Machine Coding Round Mastery (OOP, Clean Architecture, SOLID)")
                .priority("High").estimatedEffort("8 hours")
                .resourcesJson("[{\"title\":\"Flipkart Machine Coding Guide\",\"url\":\"https://workat.tech/machine-coding\"}]")
                .build());
        c.getPrepTopics().add(CompanyPreparationTopicEntity.builder()
                .company(c).subject("DSA").topic("Dynamic Programming with State Optimization")
                .priority("High").estimatedEffort("6 hours")
                .resourcesJson("[{\"title\":\"DP State Optimization\",\"url\":\"https://leetcode.com\"}]")
                .build());

        return c;
    }
}
