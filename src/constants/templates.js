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
    },
    executive: {
        templateId: 'executive',
        basicInfo: {
            fullName: "James H. Sterling",
            email: "j.sterling@enterprise.corp",
            phone: "+82 10-1234-9999",
            summary: "Visionary Executive with 15+ years of leadership experience in driving operational excellence and revenue growth. Proven track record of turning around underperforming units and leading global teams.",
            role: "Chief Operating Officer"
        },
        education: [
            { school: "Stanford GSB", major: "MBA", year: "2010" }
        ],
        experience: [
            { company: "Enterprise Corp", role: "VP of Operations", period: "2018 - Present", desc: "Oversaw global operations across 3 continents. Increased efficiency by 35%." },
            { company: "Global Consult", role: "Senior Consultant", period: "2012 - 2018", desc: "Advised Fortune 500 companies on strategic mergers and acquisitions." }
        ],
        skills: "Strategic Planning, Change Management, P&L Mgmt, Leadership"
    },
    startup: {
        templateId: 'startup',
        basicInfo: {
            fullName: "Sarah J. Kim",
            email: "sarah.kim@rocket.growth",
            phone: "+82 10-5678-1234",
            summary: "Growth Hacker & Product Owner who thrives in chaos. 3x Exit Experience. I build products that people actually want and scale them from 0 to 1M users.",
            role: "Head of Growth"
        },
        education: [
            { school: "Y Combinator", major: "S21 Batch", year: "2021" },
            { school: "KAIST", major: "Industrial Design", year: "2018" }
        ],
        experience: [
            { company: "Rocket Launch", role: "Co-Founder", period: "2021 - Present", desc: "Bootstrapped from $0 to $1M ARR in 12 months." },
            { company: "Unicorn Inc", role: "Product Manager", period: "2018 - 2021", desc: "Led the mobile app redesign resulting in 200% retention lift." }
        ],
        skills: "A/B Testing, SQL, Product Strategy, UX Research, Figma"
    }
};
