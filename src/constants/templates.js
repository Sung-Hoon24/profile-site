export const TEMPLATES = {
    developer: {
        basicInfo: {
            fullName: "Hong Gil Dong",
            role: "Senior Frontend Developer",
            email: "hong@example.com",
            phone: "010-1234-5678",
            summary: "Passionate logic-driven developer with 5+ years of experience in building scalable web applications using React and Node.js."
        },
        experience: [
            {
                id: 1,
                company: "Tech Corp",
                role: "Frontend Team Lead",
                period: "2022 - Present",
                desc: "Led the migration from legacy jQuery to React 18. Improved site performance by 40%."
            },
            {
                id: 2,
                company: "Startup Inc",
                role: "Web Developer",
                period: "2019 - 2022",
                desc: "Developed and maintained the main e-commerce platform. Implemented payment gateway integration."
            }
        ],
        education: [
            {
                id: 1,
                school: "Seoul National University",
                major: "Computer Science",
                year: "2019"
            }
        ],
        skills: "React, TypeScript, Node.js, AWS, Docker, GraphQL",
        templateId: "developer"
    },
    designer: {
        basicInfo: {
            fullName: "Kim Min Ji",
            role: "Product Designer",
            email: "minji@design.com",
            phone: "010-9876-5432",
            summary: "Creative designer focused on UI/UX with a strong belief in user-centered design principles."
        },
        experience: [
            {
                id: 1,
                company: "Creative Studio",
                role: "Senior Designer",
                period: "2021 - Present",
                desc: "Designed mobile app interfaces for fintech clients. Conducted user research and A/B testing."
            }
        ],
        education: [
            {
                id: 1,
                school: "Hongik University",
                major: "Visual Design",
                year: "2020"
            }
        ],
        skills: "Figma, Adobe XD, Photoshop, Principle, HTML/CSS",
        templateId: "designer"
    },
    future: {
        templateId: 'future',
        basicInfo: {
            fullName: "Alex 'Neo' Chen",
            email: "neo@cyber.net",
            phone: "010-0000-1010",
            summary: "Constructing secure and scalable digital fortresses. Specializing in offensive security and AI-driven defense mechanisms.",
            role: "Cyber Security Architect"
        },
        education: [
            { school: "MIT", major: "Computer Science & AI", year: "2018 - 2022" }
        ],
        experience: [
            { company: "Global Defense Corp", role: "Lead Pen-Tester", period: "2023 - Present", desc: "Identified and patched 50+ critical vulnerabilities in core infrastructure." },
            { company: "Startup AI", role: "Security Engineer", period: "2022 - 2023", desc: "Implemented zero-trust architecture for cloud services." }
        ],
        skills: "Python, Rust, Penetration Testing, Cryptography, AI Security"
    }
};
