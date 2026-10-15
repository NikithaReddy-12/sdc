export interface StatItem {
  id: string
  targetNumber: number
  suffix: string
  label: string
  sublabel: string
}

export interface CorePillar {
  id: string
  index: string
  title: string
  description: string
  tag: string
}

export const heroContent = {
  institutionBadge: 'GRIET HYDERABAD · AUTONOMOUS CELL',
  headingAccent: 'SDC',
  headingMain: 'Skill Development Cell, GRIET',
  fullTitle: 'SDC — Skill Development Cell, GRIET',
  tagline:
    'Empowering student engineers through intensive technical mastery, real-world project development, and multidisciplinary industry innovation.',
  ctaPrimary: 'Explore SDC',
  ctaSecondary: 'Key Verticals',
  scrollPrompt: 'Scroll to explore',
}

export const aboutContent = {
  sectionBadge: '// 01 · CELL OVERVIEW',
  heading: 'ABOUT SDC',
  subheading:
    'Bridging academia and modern industry engineering standards at Gokaraju Rangaraju Institute of Engineering and Technology.',
  paragraphs: [
    'The Skill Development Cell (SDC) at GRIET is an autonomous student-driven engineering initiative dedicated to transforming ambitious learners into industry-ready technologists and innovators. We cultivate an ecosystem where theoretical principles translate directly into scalable production applications.',
    'Operating across specialized engineering verticals—from Software Engineering and Artificial Intelligence to Embedded IoT, Cybersecurity, and Cloud Architectures—SDC equips students with modern toolchains, industry-standard practices, and guided development roadmaps.',
    'Through peer-to-peer knowledge sharing, hackathons, open-source projects, and collaborative research, SDC members build high-impact solutions, compete in national arenas, and establish a distinguished legacy of technical leadership.',
  ],
  stats: [
    {
      id: 'members',
      targetNumber: 500,
      suffix: '+',
      label: 'Active Members',
      sublabel: 'Student engineers and technical contributors across departments',
    },
    {
      id: 'events',
      targetNumber: 20,
      suffix: '+',
      label: 'Events & Bootcamps',
      sublabel: 'Hands-on workshops, hackathons, and technical sprints organized annually',
    },
    {
      id: 'years',
      targetNumber: 5,
      suffix: '+',
      label: 'Years of Excellence',
      sublabel: 'Continuous legacy of empowering technical talent at GRIET',
    },
    {
      id: 'domains',
      targetNumber: 10,
      suffix: '+',
      label: 'Specialized Domains',
      sublabel: 'From Web3 and Machine Learning to Robotics and Systems Architecture',
    },
  ] as StatItem[],
  pillars: [
    {
      id: 'hands-on',
      index: '01',
      title: 'Hands-on Engineering',
      tag: 'BUILD-FIRST',
      description:
        'Moving past rote textbook concepts by shipping tangible, production-grade applications and systems.',
    },
    {
      id: 'mentorship',
      index: '02',
      title: 'Peer Mentorship',
      tag: 'COLLABORATIVE',
      description:
        'Structured roadmaps where senior leads and domain specialists guide junior members through complex codebases.',
    },
    {
      id: 'industry',
      index: '03',
      title: 'Industry Alignment',
      tag: 'PRODUCTION READY',
      description:
        'Regular syncs, tech talks, and project reviews with industry engineers, alumni, and technology leaders.',
    },
  ] as CorePillar[],
}

export interface WhatWeDoActivity {
  id: 'learn' | 'build' | 'compete' | 'lead'
  index: string
  title: string
  subtitle: string
  description: string
  deliverables: string[]
  accentColor: string
}

export const whatWeDoContent = {
  sectionBadge: '// 02 · CORE LIFECYCLE',
  heading: 'WHAT WE DO',
  subheading:
    'A cyclical four-stage engineering methodology transforming motivated students into visionary technologists.',
  activities: [
    {
      id: 'learn',
      index: '01',
      title: 'LEARN',
      subtitle: 'FOUNDATIONAL RIGOR & DEEP DOMAIN TRACKS',
      description:
        'Immerse in intensive roadmaps spanning modern full-stack systems, generative AI architectures, distributed cloud primitives, and low-level hardware embedded engineering.',
      deliverables: [
        'Curated Domain Syllabi',
        'Hands-on Code Labs',
        'Architecture Deep-Dives',
      ],
      accentColor: '#7cff7a',
    },
    {
      id: 'build',
      index: '02',
      title: 'BUILD',
      subtitle: 'PRODUCTION-GRADE SHIP CYCLES',
      description:
        'Bridge the gap between theoretical knowledge and real software by architecting, testing, and deploying resilient systems, internal tools, and open-source packages.',
      deliverables: [
        'Production Microservices',
        'Hardware & IoT Prototypes',
        'Campus Utility Platforms',
      ],
      accentColor: '#5ff7f0',
    },
    {
      id: 'compete',
      index: '03',
      title: 'COMPETE',
      subtitle: 'HIGH-VELOCITY HACKATHONS & NATIONAL ARENAS',
      description:
        'Test execution velocity and algorithmic mastery in premier collegiate hackathons, Smart India Hackathon sprints, and open competitive programming contests.',
      deliverables: [
        'Smart India Hackathon Teams',
        'Algorithmic Sprints',
        'Global Bounty Challenges',
      ],
      accentColor: '#bbfefb',
    },
    {
      id: 'lead',
      index: '04',
      title: 'LEAD',
      subtitle: 'MENTORSHIP & ENGINEERING LEADERSHIP',
      description:
        'Cultivate the next generation of engineers. Lead technical vertical pods, run specialized community workshops, publish engineering retrospectives, and drive cell strategy.',
      deliverables: [
        'Domain Pod Leads',
        'Peer-to-Peer Cohorts',
        'Tech Keynotes & Talks',
      ],
      accentColor: '#9bf3b4',
    },
  ] as WhatWeDoActivity[],
}

export type EventType = 'WORKSHOP' | 'HACKATHON' | 'CONTEST' | 'SESSION'

export interface EventItem {
  id: string
  title: string
  date: string
  time: string
  type: EventType
  description: string
  location: string
  seats: string
  status: string
  accentColor: string
}

export const upcomingEventsContent = {
  sectionBadge: '// 03 · CALENDAR & SPRINTS',
  heading: 'UPCOMING EVENTS',
  subheading:
    'Join our upcoming technical bootcamps, continuous hackathons, and expert engineering sessions.',
  events: [
    {
      id: 'neural-sprint-2026',
      title: "NeuralSprint '26: LLM & Autonomous Agents",
      date: 'OCT 14 – 16, 2026',
      time: '10:00 AM IST',
      type: 'HACKATHON',
      description:
        'A 48-hour continuous sprint building production LLM pipelines, multi-agent frameworks, and vector search architectures with industry mentors.',
      location: 'GRIET Tech Block · Lab 3',
      seats: '120 Participants',
      status: 'REGISTRATION OPEN',
      accentColor: '#7cff7a',
    },
    {
      id: 'distributed-systems-lab',
      title: 'Distributed Systems & Go Microservices',
      date: 'OCT 24, 2026',
      time: '02:00 PM IST',
      type: 'WORKSHOP',
      description:
        'Hands-on masterclass architecting high-throughput services with Go, gRPC protocols, Redis caching layers, and Docker containerization.',
      location: 'Seminar Hall 2 · Hybrid',
      seats: '80 Seats',
      status: 'LIMITED SEATS',
      accentColor: '#5ff7f0',
    },
    {
      id: 'codequest-algorithms',
      title: 'CodeQuest: High-Velocity Algo Duel',
      date: 'NOV 05, 2026',
      time: '06:00 PM IST',
      type: 'CONTEST',
      description:
        'Fast-paced algorithmic duel testing advanced graph algorithms, dynamic programming optimizations, and mathematical problem-solving under ICPC constraints.',
      location: 'Online Contest Platform',
      seats: 'Open to All',
      status: 'UPCOMING',
      accentColor: '#bbfefb',
    },
    {
      id: 'eng-leadership-keynote',
      title: 'Architecting for Scale: Industry Keynote',
      date: 'NOV 18, 2026',
      time: '11:00 AM IST',
      type: 'SESSION',
      description:
        'Senior engineering architects and GRIET alumni dissect production war stories, distributed system failures, and engineering career trajectories.',
      location: 'Main Auditorium',
      seats: '150 Seats',
      status: 'REGISTRATION OPEN',
      accentColor: '#9bf3b4',
    },
    {
      id: 'hardware-edge-iot',
      title: 'Edge AI & Autonomous Robotics Sprint',
      date: 'DEC 02 – 04, 2026',
      time: '09:30 AM IST',
      type: 'HACKATHON',
      description:
        'Hardware hacking sprint deploying lightweight vision models and ROS2 control nodes onto edge microcontrollers and custom robotics rigs.',
      location: 'SDC Embedded Hardware Lab',
      seats: '60 Participants',
      status: 'PRE-REGISTRATION',
      accentColor: '#7cff7a',
    },
  ] as EventItem[],
}

export interface TechnologyDomain {
  id: 'ai' | 'web' | 'cloud' | 'cyber'
  name: string
  code: string
  tagline: string
  description: string
  techStack: string[]
  accentColor: string
  stats: string
  position: [number, number, number]
}

export const technologyContent = {
  sectionBadge: '// 04 · TECHNICAL DOMAINS',
  heading: 'TECHNOLOGY',
  subheading:
    'Explore the foundational engineering pillars that power our development roadmaps, student research, and production deployments.',
  centerNode: {
    id: 'sdc',
    name: 'SDC',
    title: 'SKILL DEVELOPMENT CELL',
    description: 'Central engineering hub coordinating cross-functional technical pods.',
  },
  domains: [
    {
      id: 'ai',
      name: 'AI',
      code: '01_AI',
      tagline: 'Deep Learning & Autonomous Intelligent Systems',
      description:
        'Focusing on Large Language Models, autonomous agent frameworks, computer vision pipelines, and fine-tuning neural architectures on edge devices.',
      techStack: ['PyTorch', 'LangChain', 'TensorRT', 'Hugging Face', 'Ollama'],
      accentColor: '#7cff7a',
      stats: '15+ Shipped Models',
      position: [-2.2, 1.3, 0],
    },
    {
      id: 'web',
      name: 'WEB',
      code: '02_WEB',
      tagline: 'High-Throughput Full-Stack Web Architectures',
      description:
        'Building ultra-fast modern interfaces, distributed web applications, WebSockets, real-time sync engines, and accessible frontend systems.',
      techStack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS'],
      accentColor: '#5ff7f0',
      stats: '30+ Live Projects',
      position: [2.2, 1.3, 0],
    },
    {
      id: 'cloud',
      name: 'CLOUD',
      code: '03_CLOUD',
      tagline: 'Resilient Cloud & Distributed Infrastructure',
      description:
        'Architecting containerized microservices, Kubernetes clusters, CI/CD automated deployment pipelines, and serverless edge functions.',
      techStack: ['Docker', 'Kubernetes', 'AWS', 'Go', 'Terraform', 'PostgreSQL'],
      accentColor: '#bbfefb',
      stats: '99.9% Uptime Stacks',
      position: [-2.2, -1.3, 0],
    },
    {
      id: 'cyber',
      name: 'CYBER',
      code: '04_CYBER',
      tagline: 'Defensive Security, Cryptography & Systems Audit',
      description:
        'Auditing codebases for zero-day vulnerabilities, binary exploitation analysis, network defense, penetration testing, and zero-knowledge primitives.',
      techStack: ['Wireshark', 'Burp Suite', 'Ghidra', 'Linux Kernel', 'Cryptography'],
      accentColor: '#9bf3b4',
      stats: '100+ CTF Flags',
      position: [2.2, -1.3, 0],
    },
  ] as TechnologyDomain[],
}

export interface TeamSocials {
  github?: string
  linkedin?: string
  twitter?: string
  email?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  domain: 'LEADERSHIP' | 'AI' | 'WEB' | 'CLOUD' | 'CYBER' | 'COMPETITIVE'
  bio: string
  avatarAccent: string
  initials: string
  photo?: string
  socials: TeamSocials
}

export const teamContent = {
  sectionBadge: '// 05 · CORE ARCHITECTS',
  heading: 'OUR TEAM',
  subheading:
    'The dedicated student engineers, architects, and technical domain leads steering SDC projects and mentorship.',
  members: [
    {
      id: 'lead-1',
      name: 'Rohan Sharma',
      role: 'President & Systems Architect',
      domain: 'LEADERSHIP',
      bio: 'Leading cell strategy, high-throughput microservices architecture, and university-wide engineering hackathons.',
      avatarAccent: '#7cff7a',
      initials: 'RS',
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'rohan@griet.ac.in',
      },
    },
    {
      id: 'lead-2',
      name: 'Ananya Reddy',
      role: 'Vice President & AI Pod Lead',
      domain: 'AI',
      bio: 'Researcher in multi-agent reinforcement learning, fine-tuning open weights LLMs, and distributed inference.',
      avatarAccent: '#5ff7f0',
      initials: 'AR',
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
    },
    {
      id: 'lead-3',
      name: 'Karthik Varma',
      role: 'Technical Lead — Web Systems',
      domain: 'WEB',
      bio: 'Full-stack engineer passionate about high-performance web tooling, WebGL graphics, and scalable UI frameworks.',
      avatarAccent: '#bbfefb',
      initials: 'KV',
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    },
    {
      id: 'lead-4',
      name: 'Sneha Patel',
      role: 'Technical Lead — Cloud & DevOps',
      domain: 'CLOUD',
      bio: 'Specializing in Kubernetes orchestration, immutable infrastructure-as-code, and automated observability telemetry.',
      avatarAccent: '#9bf3b4',
      initials: 'SP',
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'sneha@griet.ac.in',
      },
    },
    {
      id: 'lead-5',
      name: 'Aditya Nair',
      role: 'Technical Lead — Cybersecurity',
      domain: 'CYBER',
      bio: 'CTF team captain, binary reverse engineering specialist, and advocate for defensive security practices.',
      avatarAccent: '#7cff7a',
      initials: 'AN',
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    },
    {
      id: 'lead-6',
      name: 'Pooja Kulkarni',
      role: 'Competitive Programming Lead',
      domain: 'COMPETITIVE',
      bio: 'ICPC Regionalist, algorithms mentor, and author of algorithmic contest challenges at GRIET.',
      avatarAccent: '#5ff7f0',
      initials: 'PK',
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
      },
    },
  ] as TeamMember[],
}

export interface PastEventItem {
  id: string
  name: string
  year: string
  date: string
  category: 'HACKATHON' | 'WORKSHOP' | 'BOOTCAMP' | 'CONFERENCE' | 'TECH SUMMIT'
  description: string
  stats: string
  accentColor: string
  technologies: string[]
  link?: string
}

export const pastEventsContent = {
  sectionBadge: '// 06 · HISTORICAL TIMELINE',
  heading: 'PAST EVENTS',
  subheading:
    'A chronological retrospective of technical bootcamps, competitive arenas, and flagship hackathons hosted by SDC.',
  events: [
    {
      id: 'hackgriet-2025',
      name: 'HackGRIET 2025: Autonomous Systems',
      year: '2025',
      date: 'NOV 12 – 14, 2025',
      category: 'HACKATHON',
      description:
        'National 36-hour hackathon bringing together over 60 collegiate teams to engineer autonomous multi-agent systems and real-time vision pipelines.',
      stats: '350+ Hackers · 12 Industry Judges',
      accentColor: '#7cff7a',
      technologies: ['PyTorch', 'ROS2', 'WebSockets', 'LangGraph'],
      link: '#',
    },
    {
      id: 'cloud-summit-2025',
      name: 'CloudNative & Microservices Summit',
      year: '2025',
      date: 'AUG 22, 2025',
      category: 'TECH SUMMIT',
      description:
        'Masterclass and sprint series dissecting Kubernetes orchestration, service mesh routing with Istio, and zero-downtime canary deployments.',
      stats: '200+ Engineers · 8 Deep-Dives',
      accentColor: '#5ff7f0',
      technologies: ['Kubernetes', 'Go', 'Docker', 'Envoy'],
      link: '#',
    },
    {
      id: 'cybershield-2024',
      name: 'CyberShield CTF: Defensive Ops',
      year: '2024',
      date: 'OCT 18, 2024',
      category: 'BOOTCAMP',
      description:
        'High-intensity Capture The Flag competition challenging students in binary exploitation, reverse engineering, and defensive web forensics.',
      stats: '45 Teams · 100+ Flags Captured',
      accentColor: '#bbfefb',
      technologies: ['Ghidra', 'Wireshark', 'Burp Suite', 'GDB'],
      link: '#',
    },
    {
      id: 'ai-horizons-2024',
      name: 'AI Horizons: Foundations of LLMs',
      year: '2024',
      date: 'MAR 29 – 30, 2024',
      category: 'WORKSHOP',
      description:
        'Hands-on immersion workshop covering transformer attention mechanisms, tokenization pipelines, and fine-tuning quantized models on local GPUs.',
      stats: '150 Participants · 100% Code Labs',
      accentColor: '#9bf3b4',
      technologies: ['Transformers', 'PyTorch', 'vLLM', 'Ollama'],
      link: '#',
    },
    {
      id: 'codesprint-2023',
      name: 'CodeSprint Collegiate Algo Duel',
      year: '2023',
      date: 'NOV 04, 2023',
      category: 'HACKATHON',
      description:
        'Collegiate speed-coding tournament focused on graph theory algorithms, dynamic programming optimizations, and mathematical problem-solving under ICPC constraints.',
      stats: '180 Competitors · 5 Problem Tiers',
      accentColor: '#7cff7a',
      technologies: ['C++', 'Algorithms', 'Data Structures', 'Competitive Math'],
      link: '#',
    },
    {
      id: 'embedded-iot-2023',
      name: 'Edge IoT & Hardware Prototyping Sprint',
      year: '2023',
      date: 'APR 15, 2023',
      category: 'WORKSHOP',
      description:
        'Hardware sprint constructing sensor telemetry nodes, MQTT broking architectures, and edge computer vision modules on low-power ARM microcontrollers.',
      stats: '75 Hardware Kits · 18 Deployed Nodes',
      accentColor: '#5ff7f0',
      technologies: ['ESP32', 'FreeRTOS', 'MQTT', 'C/C++'],
      link: '#',
    },
  ] as PastEventItem[],
}

export interface PastLead {
  name: string
  role: string
  domain: string
  linkedin?: string
  github?: string
}

export interface PastTeamBatch {
  id: string
  year: string
  batch: string
  teamName: string
  leads: PastLead[]
  majorProject: string
  projectTagline: string
  projectDescription: string
  workCompleted: string[]
  technologies: string[]
  projectLink?: string
  githubLink?: string
  accentColor: string
}

export const pastTeamContent = {
  sectionBadge: '// 07 · LEGACY & CONTRIBUTIONS',
  heading: 'PAST TEAM & THEIR WORK',
  subheading:
    'Honoring the pioneering student architects who established SDC frameworks, built enduring campus utilities, and passed down the engineering torch.',
  batches: [
    {
      id: 'batch-2024-2025',
      year: '2024–2025',
      batch: 'BATCH OF 2024–2025',
      teamName: 'Executive Directorate Alpha',
      accentColor: '#7cff7a',
      leads: [
        { name: 'Varun Teja', role: 'Former President', domain: 'LEADERSHIP', linkedin: 'https://linkedin.com' },
        { name: 'Meghana Rao', role: 'Former AI Pod Lead', domain: 'AI', github: 'https://github.com' },
        { name: 'Siddharth Jain', role: 'Former Cloud Architect', domain: 'CLOUD', linkedin: 'https://linkedin.com' },
        { name: 'Pooja Hegde', role: 'Former Web Lead', domain: 'WEB', github: 'https://github.com' },
      ],
      majorProject: 'Nexus: Distributed Multi-Agent Campus Brain',
      projectTagline: 'Autonomous AI orchestration engine for campus research and student workflows.',
      projectDescription:
        'Engineered an enterprise-grade multi-agent autonomous platform connecting over 12 academic databases with fine-tuned local models, processing 20,000+ student queries with sub-second latency.',
      workCompleted: [
        'Organized HackGRIET 2025 with 350+ national participants and ₹1.5L prize pool.',
        'Architected high-throughput CI/CD test automation for university projects.',
        'Mentored 180+ first- and second-year student engineers across 4 technical tracks.',
        'Published 3 open-source utility packages adopted by collegiate developer cells.',
      ],
      technologies: ['FastAPI', 'LangGraph', 'Docker', 'Redis', 'PostgreSQL', 'TypeScript'],
      githubLink: 'https://github.com',
      projectLink: '#',
    },
    {
      id: 'batch-2023-2024',
      year: '2023–2024',
      batch: 'BATCH OF 2023–2024',
      teamName: 'Executive Directorate Beta',
      accentColor: '#5ff7f0',
      leads: [
        { name: 'Arjun Sen', role: 'Former President', domain: 'LEADERSHIP', linkedin: 'https://linkedin.com' },
        { name: 'Divya Nair', role: 'Former Web Architect', domain: 'WEB', github: 'https://github.com' },
        { name: 'Manoj Kumar', role: 'Former Security Lead', domain: 'CYBER', linkedin: 'https://linkedin.com' },
      ],
      majorProject: 'GRIET Portal V2 & Unified Auth Mesh',
      projectTagline: 'Modern decoupled campus portal and role-based OAuth2 authentication gateway.',
      projectDescription:
        'Redesigned the collegiate student services portal from ground up using Next.js and distributed microservices, achieving a 98+ Google Lighthouse performance score.',
      workCompleted: [
        'Shipped full-stack authentication gateway servicing 4,000+ daily student logins.',
        'Hosted CyberShield CTF with 45 collegiate teams and zero infrastructure downtime.',
        'Built automated code evaluation sandbox for intra-college competitive sprints.',
        'Secured 4 National Smart India Hackathon finalist allocations.',
      ],
      technologies: ['Next.js', 'Go', 'TailwindCSS', 'OAuth2', 'JWT', 'MongoDB'],
      githubLink: 'https://github.com',
      projectLink: '#',
    },
    {
      id: 'batch-2022-2023',
      year: '2022–2023',
      batch: 'BATCH OF 2022–2023',
      teamName: 'Founding Directorate',
      accentColor: '#bbfefb',
      leads: [
        { name: 'Kiranmai S', role: 'Founding Lead', domain: 'LEADERSHIP', linkedin: 'https://linkedin.com' },
        { name: 'Vikram Joshi', role: 'Systems Lead', domain: 'SYSTEMS', github: 'https://github.com' },
        { name: 'Harsha Vardhan', role: 'Open Source Lead', domain: 'OSS', linkedin: 'https://linkedin.com' },
      ],
      majorProject: 'OpenCert: Tamper-Proof Digital Credential Ledger',
      projectTagline: 'Cryptographically verifiable certificate issuance and verification protocol.',
      projectDescription:
        'Implemented an open cryptographic ledger for generating and instantaneously verifying student certificates and workshop credentials, completely eliminating forged credentials.',
      workCompleted: [
        'Formally established the SDC constitution, pods, and domain curriculum.',
        'Organized the inaugural CodeSprint tournament with 180 competitors.',
        'Launched first peer mentorship sprint onboarding 120 ambitious juniors.',
        'Built open-source repository templates now used across student clubs.',
      ],
      technologies: ['Node.js', 'Cryptography', 'Express', 'React', 'Docker'],
      githubLink: 'https://github.com',
      projectLink: '#',
    },
  ] as PastTeamBatch[],
}

export const joinSdcContent = {
  sectionBadge: '// 08 · APPRENTICESHIP & RECRUITMENT',
  heading: 'JOIN SDC',
  tagline: 'Step into an engineering culture built on shipping, mentorship, and technical audacity.',
  paragraph:
    'Whether you specialize in distributed systems, machine learning architectures, web engineering, or embedded hardware, SDC gives you the toolchains, peers, and real-world projects to accelerate your trajectory. Applications open each semester for aspiring student developers, leads, and domain mentors.',
  ctaButtonText: 'Join SDC',
  googleFormUrl: 'https://forms.gle/sdc-griet-recruitment-placeholder',
  benefits: [
    { title: 'Peer Code Sprints', desc: 'Collaborate on production codebases under senior mentorship.' },
    { title: 'Industry Alignment', desc: 'Tech talks, architectural reviews, and alumni masterclasses.' },
    { title: 'Hackathon Arenas', desc: 'Represent GRIET in national hackathons and prize bounties.' },
    { title: 'Dedicated Infrastructure', desc: 'Lab servers, GPU compute, and embedded hardware rigs.' },
  ],
}

export const contactContent = {
  sectionBadge: '// 09 · CONNECT WITH SDC',
  heading: 'CONTACT',
  subheading:
    'Have questions about our technical pods, collaborative sprints, or sponsorship? Reach out to the SDC Secretariat.',
  institution: 'Gokaraju Rangaraju Institute of Engineering and Technology (Autonomous)',
  address: 'Skill Development Cell, Tech Block 2 · GRIET Campus, Bachupally, Kukatpally, Hyderabad, Telangana — 500090',
  email: 'sdc@griet.ac.in',
  phone: '+91 (040) 6586 4440',
  socials: [
    { name: 'GitHub', url: 'https://github.com', handle: 'github.com/sdc-griet' },
    { name: 'LinkedIn', url: 'https://linkedin.com', handle: 'linkedin.com/company/sdc-griet' },
    { name: 'X / Twitter', url: 'https://twitter.com', handle: '@sdc_griet' },
    { name: 'Instagram', url: 'https://instagram.com', handle: '@sdcgriet' },
  ],
}
