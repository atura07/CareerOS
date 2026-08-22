package com.careeros.ats.engine;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Pattern;

@Component
public class SkillTaxonomyEngine {

    public enum SkillCategory {
        PROGRAMMING_LANGUAGES("Programming Languages"),
        WEB_AND_FRAMEWORKS("Web & Frameworks"),
        DATABASES_AND_STORAGE("Databases & Storage"),
        DEVOPS_TOOLS_AND_CLOUD("DevOps, Tools & Cloud"),
        CS_FUNDAMENTALS("CS Fundamentals & Architecture");

        private final String displayName;

        SkillCategory(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public record SkillDefinition(String canonicalName, SkillCategory category, List<String> aliases, Pattern pattern) {}

    private final List<SkillDefinition> skillDefinitions = new ArrayList<>();
    private final Map<String, SkillDefinition> aliasToDefinition = new HashMap<>();

    public SkillTaxonomyEngine() {
        initTaxonomy();
    }

    private void initTaxonomy() {
        // 1. PROGRAMMING LANGUAGES
        addSkill("Java", SkillCategory.PROGRAMMING_LANGUAGES, List.of("java", "core java", "java 8", "java 11", "java 17", "java 21", "jvm"),
                "\\b(java|core java|java 8|java 11|java 17|java 21|jvm)\\b(?!script|fx)");
        addSkill("Python", SkillCategory.PROGRAMMING_LANGUAGES, List.of("python", "python3", "python 3", "py"),
                "\\b(python|python3|python 3)\\b");
        addSkill("C++", SkillCategory.PROGRAMMING_LANGUAGES, List.of("c++", "cpp", "c plus plus"),
                "(\\bc\\+\\+|\\bcpp\\b|\\bc\\s+plus\\s+plus\\b)");
        addSkill("C", SkillCategory.PROGRAMMING_LANGUAGES, List.of("c language"),
                "(?<![a-zA-Z0-9#+])c(?![a-zA-Z0-9#+]|\\s*\\+|\\s*plus|\\s*#|\\s*sharp)");
        addSkill("C#", SkillCategory.PROGRAMMING_LANGUAGES, List.of("c#", "csharp", "c sharp"),
                "(\\bc#(?![a-zA-Z0-9#])|\\bcsharp\\b|\\bc\\s+sharp\\b)");
        addSkill("JavaScript", SkillCategory.PROGRAMMING_LANGUAGES, List.of("javascript", "ecmascript", "es6", "vanilla js"),
                "(?<!react|node|next|vue|nest|express|angular|three|d3|chart)[.\\s]?(javascript|ecmascript|es6|vanilla js)\\b|(?<![a-zA-Z0-9.-])js(?![a-zA-Z0-9.-])");
        addSkill("TypeScript", SkillCategory.PROGRAMMING_LANGUAGES, List.of("typescript", "ts"),
                "\\b(typescript)\\b|(?<![a-zA-Z0-9.-])ts(?![a-zA-Z0-9.-])");
        addSkill("Go", SkillCategory.PROGRAMMING_LANGUAGES, List.of("golang"),
                "\\b(golang)\\b|(?<![a-zA-Z0-9])go(?![a-zA-Z0-9]|ing|es|od|ld|ogle)");
        addSkill("Rust", SkillCategory.PROGRAMMING_LANGUAGES, List.of("rust", "rustlang"),
                "\\b(rust|rustlang)\\b");
        addSkill("Ruby", SkillCategory.PROGRAMMING_LANGUAGES, List.of("ruby"),
                "\\b(ruby)\\b(?! on rails)");
        addSkill("PHP", SkillCategory.PROGRAMMING_LANGUAGES, List.of("php", "php7", "php8"),
                "\\b(php|php7|php8)\\b");
        addSkill("Kotlin", SkillCategory.PROGRAMMING_LANGUAGES, List.of("kotlin"),
                "\\b(kotlin)\\b");
        addSkill("Swift", SkillCategory.PROGRAMMING_LANGUAGES, List.of("swift", "swiftui"),
                "\\b(swift|swiftui)\\b");
        addSkill("Scala", SkillCategory.PROGRAMMING_LANGUAGES, List.of("scala"),
                "\\b(scala)\\b");
        addSkill("SQL", SkillCategory.PROGRAMMING_LANGUAGES, List.of("sql", "t-sql", "pl/sql", "plsql"),
                "\\b(sql|t-sql|pl/sql|plsql)\\b(?!ite)");
        addSkill("R", SkillCategory.PROGRAMMING_LANGUAGES, List.of("r programming"),
                "\\br\\s+programming\\b|\\br-lang\\b");
        addSkill("Dart", SkillCategory.PROGRAMMING_LANGUAGES, List.of("dart"),
                "\\b(dart)\\b");
        addSkill("HTML", SkillCategory.PROGRAMMING_LANGUAGES, List.of("html", "html5"),
                "\\b(html|html5)\\b");
        addSkill("CSS", SkillCategory.PROGRAMMING_LANGUAGES, List.of("css", "css3"),
                "\\b(css|css3)\\b");
        addSkill("Bash", SkillCategory.PROGRAMMING_LANGUAGES, List.of("bash", "shell scripting", "zsh"),
                "\\b(bash|shell scripting|zsh)\\b");

        // 2. WEB & FRAMEWORKS
        addSkill("React", SkillCategory.WEB_AND_FRAMEWORKS, List.of("react", "react.js", "reactjs", "react native"),
                "\\b(react|react\\.js|reactjs|react native)\\b");
        addSkill("Node.js", SkillCategory.WEB_AND_FRAMEWORKS, List.of("node.js", "nodejs", "node js"),
                "\\b(node\\.js|nodejs|node\\s+js)\\b");
        addSkill("Express.js", SkillCategory.WEB_AND_FRAMEWORKS, List.of("express", "express.js", "expressjs"),
                "\\b(express\\.js|expressjs|express\\s+framework)\\b|\\bexpress\\b(?=\\s*(server|backend|api|route|middleware))");
        addSkill("Spring Boot", SkillCategory.WEB_AND_FRAMEWORKS, List.of("spring boot", "springboot", "spring framework", "spring mvc"),
                "\\b(spring boot|springboot|spring framework|spring mvc)\\b");
        addSkill("Next.js", SkillCategory.WEB_AND_FRAMEWORKS, List.of("next.js", "nextjs", "next js"),
                "\\b(next\\.js|nextjs|next\\s+js)\\b");
        addSkill("Angular", SkillCategory.WEB_AND_FRAMEWORKS, List.of("angular", "angularjs", "angular.js"),
                "\\b(angular|angularjs|angular\\.js)\\b");
        addSkill("Vue.js", SkillCategory.WEB_AND_FRAMEWORKS, List.of("vue", "vue.js", "vuejs"),
                "\\b(vue|vue\\.js|vuejs)\\b");
        addSkill("Django", SkillCategory.WEB_AND_FRAMEWORKS, List.of("django", "django rest framework", "drf"),
                "\\b(django|django rest framework|drf)\\b");
        addSkill("Flask", SkillCategory.WEB_AND_FRAMEWORKS, List.of("flask"),
                "\\b(flask)\\b");
        addSkill("FastAPI", SkillCategory.WEB_AND_FRAMEWORKS, List.of("fastapi", "fast api"),
                "\\b(fastapi|fast api)\\b");
        addSkill(".NET", SkillCategory.WEB_AND_FRAMEWORKS, List.of(".net", ".net core", "dotnet", "dot net", "asp.net", "asp.net core"),
                "((?<![a-zA-Z0-9])\\.net(?![a-zA-Z0-9])|\\bdotnet\\b|\\bdot\\s+net\\b|\\basp\\.net(?![a-zA-Z0-9])|\\bnet\\s+core\\b)");
        addSkill("Ruby on Rails", SkillCategory.WEB_AND_FRAMEWORKS, List.of("ruby on rails", "rails"),
                "\\b(ruby on rails|rails)\\b");
        addSkill("NestJS", SkillCategory.WEB_AND_FRAMEWORKS, List.of("nestjs", "nest.js"),
                "\\b(nestjs|nest\\.js)\\b");
        addSkill("TailwindCSS", SkillCategory.WEB_AND_FRAMEWORKS, List.of("tailwindcss", "tailwind css", "tailwind"),
                "\\b(tailwindcss|tailwind css|tailwind)\\b");
        addSkill("Bootstrap", SkillCategory.WEB_AND_FRAMEWORKS, List.of("bootstrap", "bootstrap 5"),
                "\\b(bootstrap|bootstrap 5)\\b");
        addSkill("REST APIs", SkillCategory.WEB_AND_FRAMEWORKS, List.of("rest api", "rest apis", "restful api", "restful apis"),
                "\\b(rest\\s*apis?|restful\\s*apis?|rest\\s+web\\s+services)\\b");
        addSkill("GraphQL", SkillCategory.WEB_AND_FRAMEWORKS, List.of("graphql", "graph ql"),
                "\\b(graphql|graph ql)\\b");
        addSkill("Microservices", SkillCategory.WEB_AND_FRAMEWORKS, List.of("microservices", "microservice architecture", "micro-services"),
                "\\b(microservices|microservice architecture|micro-services)\\b");
        addSkill("WebSockets", SkillCategory.WEB_AND_FRAMEWORKS, List.of("websockets", "websocket", "socket.io"),
                "\\b(websockets|websocket|socket\\.io)\\b");

        // 3. DATABASES & STORAGE
        addSkill("PostgreSQL", SkillCategory.DATABASES_AND_STORAGE, List.of("postgresql", "postgres", "psql"),
                "\\b(postgresql|postgres|psql)\\b");
        addSkill("MySQL", SkillCategory.DATABASES_AND_STORAGE, List.of("mysql"),
                "\\b(mysql)\\b");
        addSkill("MongoDB", SkillCategory.DATABASES_AND_STORAGE, List.of("mongodb", "mongo"),
                "\\b(mongodb|mongo)\\b");
        addSkill("Redis", SkillCategory.DATABASES_AND_STORAGE, List.of("redis"),
                "\\b(redis)\\b");
        addSkill("SQLite", SkillCategory.DATABASES_AND_STORAGE, List.of("sqlite", "sqlite3"),
                "\\b(sqlite|sqlite3)\\b");
        addSkill("Oracle Database", SkillCategory.DATABASES_AND_STORAGE, List.of("oracle db", "oracle database", "oracle 11g", "oracle 12c"),
                "\\b(oracle db|oracle database|oracle 11g|oracle 12c)\\b");
        addSkill("Cassandra", SkillCategory.DATABASES_AND_STORAGE, List.of("cassandra", "apache cassandra"),
                "\\b(cassandra|apache cassandra)\\b");
        addSkill("Elasticsearch", SkillCategory.DATABASES_AND_STORAGE, List.of("elasticsearch", "elastic search", "elk stack"),
                "\\b(elasticsearch|elastic search|elk stack)\\b");
        addSkill("DynamoDB", SkillCategory.DATABASES_AND_STORAGE, List.of("dynamodb", "dynamo db", "aws dynamodb"),
                "\\b(dynamodb|dynamo db|aws dynamodb)\\b");
        addSkill("Firebase", SkillCategory.DATABASES_AND_STORAGE, List.of("firebase", "firestore", "firebase auth"),
                "\\b(firebase|firestore|firebase auth)\\b");
        addSkill("Prisma", SkillCategory.DATABASES_AND_STORAGE, List.of("prisma", "prisma orm"),
                "\\b(prisma|prisma orm)\\b");
        addSkill("Hibernate", SkillCategory.DATABASES_AND_STORAGE, List.of("hibernate", "jpa", "spring data jpa"),
                "\\b(hibernate|jpa|spring data jpa)\\b");

        // 4. DEVOPS, TOOLS & CLOUD
        addSkill("Git", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("git"),
                "\\bgit\\b(?!hub|lab)");
        addSkill("GitHub", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("github", "github actions"),
                "\\b(github|github actions)\\b");
        addSkill("GitLab", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("gitlab", "gitlab ci"),
                "\\b(gitlab|gitlab ci)\\b");
        addSkill("Docker", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("docker", "dockerfile", "docker compose"),
                "\\b(docker|dockerfile|docker compose)\\b");
        addSkill("Kubernetes", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("kubernetes", "k8s"),
                "\\b(kubernetes|k8s)\\b");
        addSkill("Linux", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("linux", "ubuntu", "centos", "debian", "redhat"),
                "\\b(linux|ubuntu|centos|debian|redhat)\\b");
        addSkill("Postman", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("postman"),
                "\\b(postman)\\b");
        addSkill("AWS", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("aws", "amazon web services", "ec2", "s3", "lambda"),
                "\\b(aws|amazon web services|ec2|s3|lambda|cloudformation)\\b");
        addSkill("Azure", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("azure", "microsoft azure", "azure devops"),
                "\\b(azure|microsoft azure|azure devops)\\b");
        addSkill("GCP", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("gcp", "google cloud", "google cloud platform"),
                "\\b(gcp|google cloud|google cloud platform)\\b");
        addSkill("CI/CD", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("ci/cd", "ci-cd", "continuous integration"),
                "\\b(ci/cd|ci-cd|continuous integration|continuous deployment)\\b");
        addSkill("Jenkins", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("jenkins"),
                "\\b(jenkins)\\b");
        addSkill("Nginx", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("nginx"),
                "\\b(nginx)\\b");
        addSkill("Terraform", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("terraform"),
                "\\b(terraform)\\b");
        addSkill("Kafka", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("kafka", "apache kafka"),
                "\\b(kafka|apache kafka)\\b");
        addSkill("RabbitMQ", SkillCategory.DEVOPS_TOOLS_AND_CLOUD, List.of("rabbitmq"),
                "\\b(rabbitmq)\\b");

        // 5. CS FUNDAMENTALS & ARCHITECTURE
        addSkill("Data Structures", SkillCategory.CS_FUNDAMENTALS, List.of("data structures", "dsa"),
                "\\b(data structures|dsa|linked lists|trees|graphs|hash maps)\\b");
        addSkill("Algorithms", SkillCategory.CS_FUNDAMENTALS, List.of("algorithms", "dynamic programming"),
                "\\b(algorithms|dynamic programming|sorting algorithms|binary search)\\b");
        addSkill("OOP", SkillCategory.CS_FUNDAMENTALS, List.of("object oriented programming", "oop", "oops"),
                "\\b(object oriented programming|object-oriented programming|oop|oops)\\b");
        addSkill("DBMS", SkillCategory.CS_FUNDAMENTALS, List.of("database management systems", "dbms", "rdbms"),
                "\\b(database management systems|dbms|rdbms|acid properties)\\b");
        addSkill("Operating Systems", SkillCategory.CS_FUNDAMENTALS, List.of("operating systems", "multithreading"),
                "\\b(operating systems|multithreading|concurrency|process synchronization)\\b");
        addSkill("Computer Networks", SkillCategory.CS_FUNDAMENTALS, List.of("computer networks", "tcp/ip", "http/https"),
                "\\b(computer networks|tcp/ip|http/https|osi model)\\b");
        addSkill("System Design", SkillCategory.CS_FUNDAMENTALS, List.of("system design", "lld", "hld"),
                "\\b(system design|low level design|lld|high level design|hld|scalability)\\b");
        addSkill("Unit Testing", SkillCategory.CS_FUNDAMENTALS, List.of("unit testing", "junit", "mockito", "jest", "pytest"),
                "\\b(unit testing|junit|mockito|jest|pytest|test driven development|tdd)\\b");
        addSkill("Agile / Scrum", SkillCategory.CS_FUNDAMENTALS, List.of("agile", "scrum", "jira"),
                "\\b(agile|scrum|jira|sprint planning)\\b");
    }

    private void addSkill(String canonicalName, SkillCategory category, List<String> aliases, String customRegex) {
        for (String alias : aliases) {
            aliasToDefinition.put(alias.toLowerCase(), new SkillDefinition(canonicalName, category, aliases, null));
        }
        Pattern pattern = Pattern.compile("(?i)" + customRegex);
        SkillDefinition def = new SkillDefinition(canonicalName, category, aliases, pattern);
        skillDefinitions.add(def);
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExtractedSkillsResult {
        private Set<String> normalizedSkills;
        private Map<String, List<String>> skillsByCategory;
        private int distinctCount;
        private int categoriesCovered;
    }

    public ExtractedSkillsResult extractSkills(String text) {
        if (text == null || text.isBlank()) {
            return new ExtractedSkillsResult(Collections.emptySet(), Collections.emptyMap(), 0, 0);
        }

        Set<String> normalized = new LinkedHashSet<>();
        Map<String, List<String>> byCategory = new LinkedHashMap<>();

        for (SkillCategory cat : SkillCategory.values()) {
            byCategory.put(cat.getDisplayName(), new ArrayList<>());
        }

        for (SkillDefinition def : skillDefinitions) {
            if (def.pattern.matcher(text).find()) {
                if (normalized.add(def.canonicalName)) {
                    byCategory.get(def.category.getDisplayName()).add(def.canonicalName);
                }
            }
        }

        int activeCategories = (int) byCategory.values().stream().filter(list -> !list.isEmpty()).count();

        return ExtractedSkillsResult.builder()
                .normalizedSkills(normalized)
                .skillsByCategory(byCategory)
                .distinctCount(normalized.size())
                .categoriesCovered(activeCategories)
                .build();
    }

    public String normalizeSkillName(String rawSkill) {
        if (rawSkill == null || rawSkill.isBlank()) return rawSkill;
        String clean = rawSkill.trim().toLowerCase();
        SkillDefinition def = aliasToDefinition.get(clean);
        if (def != null) {
            return def.canonicalName;
        }
        for (SkillDefinition d : skillDefinitions) {
            if (d.pattern.matcher(rawSkill).find()) {
                return d.canonicalName;
            }
        }
        return rawSkill.trim();
    }
}
