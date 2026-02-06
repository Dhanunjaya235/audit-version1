// Comprehensive Mock Data for Audit Management MVP
// Covers all scenarios: various statuses, scores, priorities, and edge cases

import type {
    AuditListItem,
    Audit,
    AuditReport,
    ActionItem,
    Project,
    AuditTemplate,
    User,
} from '../types';

// =====================
// Users
// =====================
export const mockUsers: User[] = [
    { id: 'user-1', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'PracticeLead' },
    { id: 'user-2', name: 'Michael Rodriguez', email: 'michael.r@company.com', role: 'Auditor' },
    { id: 'user-3', name: 'Emily Thompson', email: 'emily.t@company.com', role: 'Auditor' },
    { id: 'user-4', name: 'David Kim', email: 'david.kim@company.com', role: 'Delivery' },
    { id: 'user-5', name: 'Jessica Williams', email: 'jessica.w@company.com', role: 'Delivery' },
    { id: 'user-6', name: 'Robert Johnson', email: 'robert.j@company.com', role: 'Leadership' },
    { id: 'user-7', name: 'Amanda Foster', email: 'amanda.f@company.com', role: 'PracticeLead' },
    { id: 'user-8', name: 'James Wilson', email: 'james.w@company.com', role: 'Auditor' },
];

// =====================
// Projects
// =====================
export const mockProjects: Project[] = [
    {
        id: 'proj-1',
        name: 'Phoenix Banking Platform',
        description: 'Core banking modernization initiative',
        templateId: 'tmpl-1',
    },
    {
        id: 'proj-2',
        name: 'Atlas Healthcare System',
        description: 'Patient management and EHR integration',
        templateId: 'tmpl-1',
    },
    {
        id: 'proj-3',
        name: 'Velocity E-Commerce',
        description: 'Next-gen e-commerce platform',
        templateId: 'tmpl-2',
    },
    {
        id: 'proj-4',
        name: 'Horizon Analytics',
        description: 'Real-time data analytics dashboard',
        templateId: 'tmpl-2',
    },
    {
        id: 'proj-5',
        name: 'Nexus IoT Platform',
        description: 'Industrial IoT device management',
        templateId: 'tmpl-1',
    },
];

// =====================
// Templates
// =====================
export const mockTemplates: AuditTemplate[] = [
    {
        id: 'tmpl-1',
        name: 'Enterprise Software Audit',
        description: 'Comprehensive audit for enterprise software projects covering architecture, security, and delivery practices',
        version: '2.1',
        areaCount: 5,
        questionCount: 42,
    },
    {
        id: 'tmpl-2',
        name: 'Agile Delivery Assessment',
        description: 'Assessment framework for agile teams focusing on practices, team dynamics, and continuous improvement',
        version: '1.5',
        areaCount: 4,
        questionCount: 35,
    },
    {
        id: 'tmpl-3',
        name: 'Security & Compliance Review',
        description: 'Security-focused audit template for projects with compliance requirements',
        version: '3.0',
        areaCount: 6,
        questionCount: 58,
    },
];

// =====================
// Audit List Items (Dashboard)
// =====================
export const mockAuditList: AuditListItem[] = [
    // Phoenix Banking Platform - 5 audits
    {
        id: 'audit-1',
        projectId: 'proj-1',
        projectName: 'Phoenix Banking Platform',
        templateName: 'Enterprise Software Audit',
        auditDate: '2026-02-15',
        status: 'In Progress',
        score: 72,
        participants: [mockUsers[1], mockUsers[2]],
        createdBy: mockUsers[0],
    },
    {
        id: 'audit-6',
        projectId: 'proj-1',
        projectName: 'Phoenix Banking Platform',
        templateName: 'Security & Compliance Review',
        auditDate: '2026-01-15',
        status: 'Completed',
        score: 45,
        participants: [mockUsers[7]],
        createdBy: mockUsers[0],
    },
    {
        id: 'audit-8',
        projectId: 'proj-1',
        projectName: 'Phoenix Banking Platform',
        templateName: 'Enterprise Software Audit',
        auditDate: '2025-11-20',
        status: 'Closed',
        score: 68,
        participants: [mockUsers[1], mockUsers[2]],
        createdBy: mockUsers[0],
    },
    {
        id: 'audit-9',
        projectId: 'proj-1',
        projectName: 'Phoenix Banking Platform',
        templateName: 'Agile Delivery Assessment',
        auditDate: '2025-09-10',
        status: 'Closed',
        score: 78,
        participants: [mockUsers[2], mockUsers[7]],
        createdBy: mockUsers[6],
    },
    {
        id: 'audit-10',
        projectId: 'proj-1',
        projectName: 'Phoenix Banking Platform',
        templateName: 'Security & Compliance Review',
        auditDate: '2025-06-05',
        status: 'Closed',
        score: 52,
        participants: [mockUsers[1]],
        createdBy: mockUsers[0],
    },
    // Atlas Healthcare System - 4 audits
    {
        id: 'audit-2',
        projectId: 'proj-2',
        projectName: 'Atlas Healthcare System',
        templateName: 'Enterprise Software Audit',
        auditDate: '2026-02-10',
        status: 'Completed',
        score: 85,
        participants: [mockUsers[2], mockUsers[7]],
        createdBy: mockUsers[0],
    },
    {
        id: 'audit-7',
        projectId: 'proj-2',
        projectName: 'Atlas Healthcare System',
        templateName: 'Security & Compliance Review',
        auditDate: '2026-02-08',
        status: 'In Progress',
        score: 58,
        participants: [mockUsers[1], mockUsers[2]],
        createdBy: mockUsers[6],
    },
    {
        id: 'audit-11',
        projectId: 'proj-2',
        projectName: 'Atlas Healthcare System',
        templateName: 'Agile Delivery Assessment',
        auditDate: '2025-12-15',
        status: 'Closed',
        score: 82,
        participants: [mockUsers[2]],
        createdBy: mockUsers[0],
    },
    {
        id: 'audit-12',
        projectId: 'proj-2',
        projectName: 'Atlas Healthcare System',
        templateName: 'Enterprise Software Audit',
        auditDate: '2025-08-22',
        status: 'Closed',
        score: 71,
        participants: [mockUsers[1], mockUsers[7]],
        createdBy: mockUsers[6],
    },
    // Velocity E-Commerce - 3 audits
    {
        id: 'audit-3',
        projectId: 'proj-3',
        projectName: 'Velocity E-Commerce',
        templateName: 'Agile Delivery Assessment',
        auditDate: '2026-02-20',
        status: 'Scheduled',
        score: null,
        participants: [mockUsers[1]],
        createdBy: mockUsers[6],
    },
    {
        id: 'audit-13',
        projectId: 'proj-3',
        projectName: 'Velocity E-Commerce',
        templateName: 'Enterprise Software Audit',
        auditDate: '2025-12-01',
        status: 'Completed',
        score: 76,
        participants: [mockUsers[2], mockUsers[7]],
        createdBy: mockUsers[0],
    },
    {
        id: 'audit-14',
        projectId: 'proj-3',
        projectName: 'Velocity E-Commerce',
        templateName: 'Security & Compliance Review',
        auditDate: '2025-10-15',
        status: 'Closed',
        score: 64,
        participants: [mockUsers[1]],
        createdBy: mockUsers[6],
    },
    // Horizon Analytics - 2 audits
    {
        id: 'audit-4',
        projectId: 'proj-4',
        projectName: 'Horizon Analytics',
        templateName: 'Agile Delivery Assessment',
        auditDate: '2026-01-28',
        status: 'Closed',
        score: 91,
        participants: [mockUsers[2], mockUsers[7]],
        createdBy: mockUsers[0],
    },
    {
        id: 'audit-15',
        projectId: 'proj-4',
        projectName: 'Horizon Analytics',
        templateName: 'Enterprise Software Audit',
        auditDate: '2025-11-05',
        status: 'Completed',
        score: 88,
        participants: [mockUsers[1], mockUsers[2]],
        createdBy: mockUsers[6],
    },
    // Nexus IoT Platform - 1 audit
    {
        id: 'audit-5',
        projectId: 'proj-5',
        projectName: 'Nexus IoT Platform',
        templateName: 'Enterprise Software Audit',
        auditDate: '2026-02-25',
        status: 'Draft',
        score: null,
        participants: [mockUsers[1], mockUsers[2], mockUsers[7]],
        createdBy: mockUsers[6],
    },
];

// =====================
// Full Audit Details (for Conduct/Preparation screens)
// =====================
export const mockAuditDetails: Record<string, Audit> = {
    'audit-1': {
        id: 'audit-1',
        projectId: 'proj-1',
        projectName: 'Phoenix Banking Platform',
        templateId: 'tmpl-1',
        templateName: 'Enterprise Software Audit',
        auditDate: '2026-02-15',
        status: 'In Progress',
        participants: [mockUsers[1], mockUsers[2]],
        createdBy: mockUsers[0],
        areas: [
            {
                id: 'area-1',
                name: 'Architecture & Design',
                description: 'Assessment of system architecture, design patterns, and technical decisions',
                order: 1,
                scopes: [
                    {
                        id: 'scope-1-1',
                        name: 'System Architecture',
                        order: 1,
                        questions: [
                            {
                                id: 'q-1-1-1',
                                text: 'Is the system architecture well-documented and up-to-date?',
                                order: 1,
                                isMandatory: true,
                                response: {
                                    score: 4,
                                    comment: 'Architecture diagrams are maintained in Confluence with regular updates.',
                                    recommendation: null,
                                    evidences: [
                                        { id: 'ev-1', fileName: 'architecture-diagram.pdf', fileUrl: '/files/architecture-diagram.pdf' }
                                    ],
                                    isAnswered: true,
                                },
                            },
                            {
                                id: 'q-1-1-2',
                                text: 'Are architectural decisions properly documented with ADRs?',
                                order: 2,
                                isMandatory: true,
                                response: {
                                    score: 3,
                                    comment: 'Some ADRs exist but coverage is inconsistent.',
                                    recommendation: 'Implement a mandatory ADR process for all significant decisions.',
                                    evidences: [],
                                    isAnswered: true,
                                },
                            },
                            {
                                id: 'q-1-1-3',
                                text: 'Is there a clear separation of concerns in the architecture?',
                                order: 3,
                                isMandatory: false,
                                response: null,
                            },
                        ],
                    },
                    {
                        id: 'scope-1-2',
                        name: 'Design Patterns',
                        order: 2,
                        questions: [
                            {
                                id: 'q-1-2-1',
                                text: 'Are appropriate design patterns used consistently across the codebase?',
                                order: 1,
                                isMandatory: true,
                                response: {
                                    score: 4,
                                    comment: 'Repository, Factory, and Strategy patterns are well-implemented.',
                                    recommendation: null,
                                    evidences: [],
                                    isAnswered: true,
                                },
                            },
                            {
                                id: 'q-1-2-2',
                                text: 'Is the SOLID principle followed in the object-oriented design?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'area-2',
                name: 'Code Quality',
                description: 'Evaluation of coding standards, maintainability, and technical debt',
                order: 2,
                scopes: [
                    {
                        id: 'scope-2-1',
                        name: 'Coding Standards',
                        order: 1,
                        questions: [
                            {
                                id: 'q-2-1-1',
                                text: 'Are coding standards documented and enforced through automation?',
                                order: 1,
                                isMandatory: true,
                                response: {
                                    score: 5,
                                    comment: 'ESLint, Prettier, and SonarQube are integrated into CI/CD pipeline.',
                                    recommendation: null,
                                    evidences: [
                                        { id: 'ev-2', fileName: 'sonar-report.pdf', fileUrl: '/files/sonar-report.pdf' }
                                    ],
                                    isAnswered: true,
                                },
                            },
                            {
                                id: 'q-2-1-2',
                                text: 'Is code review mandatory for all changes?',
                                order: 2,
                                isMandatory: true,
                                response: {
                                    score: 5,
                                    comment: 'All PRs require at least one approval before merging.',
                                    recommendation: null,
                                    evidences: [],
                                    isAnswered: true,
                                },
                            },
                            {
                                id: 'q-2-1-3',
                                text: 'Are there established guidelines for code complexity?',
                                order: 3,
                                isMandatory: false,
                                response: {
                                    score: 3,
                                    comment: 'Complexity limits exist but are not strictly enforced.',
                                    recommendation: 'Add complexity gates to the CI pipeline.',
                                    evidences: [],
                                    isAnswered: true,
                                },
                            },
                        ],
                    },
                    {
                        id: 'scope-2-2',
                        name: 'Technical Debt',
                        order: 2,
                        questions: [
                            {
                                id: 'q-2-2-1',
                                text: 'Is technical debt tracked and prioritized?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-2-2-2',
                                text: 'Is there a dedicated time allocation for resolving technical debt?',
                                order: 2,
                                isMandatory: false,
                                response: null,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'area-3',
                name: 'Testing & Quality Assurance',
                description: 'Assessment of testing practices, coverage, and quality gates',
                order: 3,
                scopes: [
                    {
                        id: 'scope-3-1',
                        name: 'Test Coverage',
                        order: 1,
                        questions: [
                            {
                                id: 'q-3-1-1',
                                text: 'Is there adequate unit test coverage (>80%)?',
                                order: 1,
                                isMandatory: true,
                                response: {
                                    score: 4,
                                    comment: 'Current coverage is at 78%, close to target.',
                                    recommendation: 'Focus on increasing coverage for critical business logic modules.',
                                    evidences: [
                                        { id: 'ev-3', fileName: 'coverage-report.html', fileUrl: '/files/coverage-report.html' }
                                    ],
                                    isAnswered: true,
                                },
                            },
                            {
                                id: 'q-3-1-2',
                                text: 'Are integration tests in place for critical workflows?',
                                order: 2,
                                isMandatory: true,
                                response: {
                                    score: 3,
                                    comment: 'Integration tests exist but are flaky in CI environment.',
                                    recommendation: 'Implement test containers for stable integration testing.',
                                    evidences: [],
                                    isAnswered: true,
                                },
                            },
                        ],
                    },
                    {
                        id: 'scope-3-2',
                        name: 'Quality Gates',
                        order: 2,
                        questions: [
                            {
                                id: 'q-3-2-1',
                                text: 'Are quality gates enforced before deployment?',
                                order: 1,
                                isMandatory: true,
                                response: {
                                    score: 5,
                                    comment: 'All deployments must pass quality gates including tests, linting, and security scans.',
                                    recommendation: null,
                                    evidences: [],
                                    isAnswered: true,
                                },
                            },
                        ],
                    },
                ],
            },
            {
                id: 'area-4',
                name: 'Security',
                description: 'Security practices, vulnerability management, and compliance',
                order: 4,
                scopes: [
                    {
                        id: 'scope-4-1',
                        name: 'Security Practices',
                        order: 1,
                        questions: [
                            {
                                id: 'q-4-1-1',
                                text: 'Are security scans integrated into the CI/CD pipeline?',
                                order: 1,
                                isMandatory: true,
                                response: {
                                    score: 4,
                                    comment: 'SAST and dependency scanning are in place.',
                                    recommendation: 'Consider adding DAST for runtime security testing.',
                                    evidences: [],
                                    isAnswered: true,
                                },
                            },
                            {
                                id: 'q-4-1-2',
                                text: 'Is there a process for handling security vulnerabilities?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-4-1-3',
                                text: 'Are secrets properly managed (no hardcoded credentials)?',
                                order: 3,
                                isMandatory: true,
                                response: null,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'area-5',
                name: 'DevOps & Deployment',
                description: 'CI/CD practices, infrastructure, and operational readiness',
                order: 5,
                scopes: [
                    {
                        id: 'scope-5-1',
                        name: 'CI/CD Pipeline',
                        order: 1,
                        questions: [
                            {
                                id: 'q-5-1-1',
                                text: 'Is there a fully automated CI/CD pipeline?',
                                order: 1,
                                isMandatory: true,
                                response: {
                                    score: 5,
                                    comment: 'Fully automated pipeline with GitHub Actions, including staging and production deployments.',
                                    recommendation: null,
                                    evidences: [
                                        { id: 'ev-4', fileName: 'pipeline-overview.png', fileUrl: '/files/pipeline-overview.png' }
                                    ],
                                    isAnswered: true,
                                },
                            },
                            {
                                id: 'q-5-1-2',
                                text: 'Is infrastructure defined as code?',
                                order: 2,
                                isMandatory: false,
                                response: {
                                    score: 4,
                                    comment: 'Terraform is used for most infrastructure, some legacy resources still manual.',
                                    recommendation: 'Complete migration of remaining manual resources to Terraform.',
                                    evidences: [],
                                    isAnswered: true,
                                },
                            },
                        ],
                    },
                    {
                        id: 'scope-5-2',
                        name: 'Monitoring & Observability',
                        order: 2,
                        questions: [
                            {
                                id: 'q-5-2-1',
                                text: 'Is comprehensive monitoring in place for all services?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-5-2-2',
                                text: 'Are alerts configured for critical failures?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    'audit-2': {
        id: 'audit-2',
        projectId: 'proj-2',
        projectName: 'Atlas Healthcare System',
        templateId: 'tmpl-1',
        templateName: 'Enterprise Software Audit',
        auditDate: '2026-02-10',
        status: 'Completed',
        participants: [mockUsers[2], mockUsers[7]],
        createdBy: mockUsers[0],
        areas: [
            {
                id: 'area-1',
                name: 'Architecture & Design',
                description: 'Assessment of system architecture and design decisions',
                order: 1,
                scopes: [
                    {
                        id: 'scope-1-1',
                        name: 'System Architecture',
                        order: 1,
                        questions: [
                            {
                                id: 'q-1-1-1',
                                text: 'Is the system architecture well-documented?',
                                order: 1,
                                isMandatory: true,
                                response: {
                                    score: 5,
                                    comment: 'Excellent documentation with C4 diagrams maintained in version control.',
                                    recommendation: null,
                                    evidences: [],
                                    isAnswered: true,
                                },
                            },
                            {
                                id: 'q-1-1-2',
                                text: 'Is the architecture scalable?',
                                order: 2,
                                isMandatory: true,
                                response: {
                                    score: 4,
                                    comment: 'Microservices architecture with Kubernetes allows horizontal scaling.',
                                    recommendation: null,
                                    evidences: [],
                                    isAnswered: true,
                                },
                            },
                        ],
                    },
                ],
            },
            {
                id: 'area-2',
                name: 'Code Quality',
                description: 'Code quality and maintainability assessment',
                order: 2,
                scopes: [
                    {
                        id: 'scope-2-1',
                        name: 'Standards',
                        order: 1,
                        questions: [
                            {
                                id: 'q-2-1-1',
                                text: 'Are coding standards enforced?',
                                order: 1,
                                isMandatory: true,
                                response: {
                                    score: 5,
                                    comment: 'Comprehensive automation with pre-commit hooks and CI checks.',
                                    recommendation: null,
                                    evidences: [],
                                    isAnswered: true,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    // Scheduled audit - for Preparation view
    'audit-3': {
        id: 'audit-3',
        projectId: 'proj-3',
        projectName: 'Velocity E-Commerce',
        templateId: 'tmpl-2',
        templateName: 'Agile Delivery Assessment',
        auditDate: '2026-02-20',
        status: 'Scheduled',
        participants: [mockUsers[1]],
        createdBy: mockUsers[6],
        areas: [
            {
                id: 'area-agile-1',
                name: 'Sprint Planning & Execution',
                description: 'Assessment of sprint planning processes, backlog grooming, and sprint execution',
                order: 1,
                weightage: 30,
                scopes: [
                    {
                        id: 'scope-agile-1-1',
                        name: 'Backlog Management',
                        order: 1,
                        questions: [
                            {
                                id: 'q-a-1-1-1',
                                text: 'Is the product backlog well-maintained and prioritized?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-a-1-1-2',
                                text: 'Are user stories written with clear acceptance criteria?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-a-1-1-3',
                                text: 'Is story point estimation consistent across the team?',
                                order: 3,
                                isMandatory: false,
                                response: null,
                            },
                        ],
                    },
                    {
                        id: 'scope-agile-1-2',
                        name: 'Sprint Ceremonies',
                        order: 2,
                        questions: [
                            {
                                id: 'q-a-1-2-1',
                                text: 'Are sprint planning sessions conducted effectively?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-a-1-2-2',
                                text: 'Are daily standups happening consistently and timeboxed?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-a-1-2-3',
                                text: 'Are sprint reviews conducted with stakeholder participation?',
                                order: 3,
                                isMandatory: true,
                                response: null,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'area-agile-2',
                name: 'Team Collaboration',
                description: 'Assessment of team communication, collaboration tools, and cross-functional teamwork',
                order: 2,
                weightage: 25,
                scopes: [
                    {
                        id: 'scope-agile-2-1',
                        name: 'Communication',
                        order: 1,
                        questions: [
                            {
                                id: 'q-a-2-1-1',
                                text: 'Is there effective communication between team members?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-a-2-1-2',
                                text: 'Are collaboration tools used effectively (Slack, Teams, etc.)?',
                                order: 2,
                                isMandatory: false,
                                response: null,
                            },
                        ],
                    },
                    {
                        id: 'scope-agile-2-2',
                        name: 'Knowledge Sharing',
                        order: 2,
                        questions: [
                            {
                                id: 'q-a-2-2-1',
                                text: 'Is there a culture of knowledge sharing within the team?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-a-2-2-2',
                                text: 'Are pair programming or code reviews practiced regularly?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'area-agile-3',
                name: 'Continuous Improvement',
                description: 'Assessment of retrospectives, metrics tracking, and improvement initiatives',
                order: 3,
                weightage: 25,
                scopes: [
                    {
                        id: 'scope-agile-3-1',
                        name: 'Retrospectives',
                        order: 1,
                        questions: [
                            {
                                id: 'q-a-3-1-1',
                                text: 'Are retrospectives conducted at the end of each sprint?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-a-3-1-2',
                                text: 'Are action items from retrospectives tracked and followed up?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                        ],
                    },
                    {
                        id: 'scope-agile-3-2',
                        name: 'Metrics & Tracking',
                        order: 2,
                        questions: [
                            {
                                id: 'q-a-3-2-1',
                                text: 'Is team velocity tracked and used for planning?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-a-3-2-2',
                                text: 'Are burndown/burnup charts used to track sprint progress?',
                                order: 2,
                                isMandatory: false,
                                response: null,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'area-agile-4',
                name: 'Delivery & Release',
                description: 'Assessment of release management, deployment practices, and delivery predictability',
                order: 4,
                weightage: 20,
                scopes: [
                    {
                        id: 'scope-agile-4-1',
                        name: 'Release Management',
                        order: 1,
                        questions: [
                            {
                                id: 'q-a-4-1-1',
                                text: 'Is there a clear release cadence or strategy?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-a-4-1-2',
                                text: 'Are releases automated with minimal manual intervention?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-a-4-1-3',
                                text: 'Is there a rollback strategy in place?',
                                order: 3,
                                isMandatory: true,
                                response: null,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    // Draft audit - for Preparation view
    'audit-5': {
        id: 'audit-5',
        projectId: 'proj-5',
        projectName: 'Nexus IoT Platform',
        templateId: 'tmpl-1',
        templateName: 'Enterprise Software Audit',
        auditDate: '2026-02-25',
        status: 'Draft',
        participants: [mockUsers[1], mockUsers[2], mockUsers[7]],
        createdBy: mockUsers[6],
        areas: [
            {
                id: 'area-iot-1',
                name: 'Architecture & Design',
                description: 'Assessment of IoT system architecture, design patterns, and technical decisions',
                order: 1,
                weightage: 25,
                scopes: [
                    {
                        id: 'scope-iot-1-1',
                        name: 'System Architecture',
                        order: 1,
                        questions: [
                            {
                                id: 'q-iot-1-1-1',
                                text: 'Is the IoT architecture well-documented and scalable?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-iot-1-1-2',
                                text: 'Is there a clear separation between edge and cloud components?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-iot-1-1-3',
                                text: 'Are message queues/brokers used for reliable communication?',
                                order: 3,
                                isMandatory: false,
                                response: null,
                            },
                        ],
                    },
                    {
                        id: 'scope-iot-1-2',
                        name: 'Device Management',
                        order: 2,
                        questions: [
                            {
                                id: 'q-iot-1-2-1',
                                text: 'Is there a device provisioning and onboarding process?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-iot-1-2-2',
                                text: 'Can devices be remotely updated and configured?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'area-iot-2',
                name: 'Security',
                description: 'Assessment of IoT security practices including device security, data protection, and access control',
                order: 2,
                weightage: 30,
                scopes: [
                    {
                        id: 'scope-iot-2-1',
                        name: 'Device Security',
                        order: 1,
                        questions: [
                            {
                                id: 'q-iot-2-1-1',
                                text: 'Are devices authenticated before connecting to the platform?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-iot-2-1-2',
                                text: 'Is firmware signed and verified before installation?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-iot-2-1-3',
                                text: 'Are secure boot mechanisms implemented on devices?',
                                order: 3,
                                isMandatory: false,
                                response: null,
                            },
                        ],
                    },
                    {
                        id: 'scope-iot-2-2',
                        name: 'Data Protection',
                        order: 2,
                        questions: [
                            {
                                id: 'q-iot-2-2-1',
                                text: 'Is data encrypted in transit (TLS/DTLS)?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-iot-2-2-2',
                                text: 'Is sensitive data encrypted at rest?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'area-iot-3',
                name: 'Data Processing & Analytics',
                description: 'Assessment of data ingestion, processing pipelines, and analytics capabilities',
                order: 3,
                weightage: 25,
                scopes: [
                    {
                        id: 'scope-iot-3-1',
                        name: 'Data Ingestion',
                        order: 1,
                        questions: [
                            {
                                id: 'q-iot-3-1-1',
                                text: 'Is the data ingestion pipeline scalable for high-volume data?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-iot-3-1-2',
                                text: 'Is there data validation and sanitization at ingestion?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                        ],
                    },
                    {
                        id: 'scope-iot-3-2',
                        name: 'Analytics & Monitoring',
                        order: 2,
                        questions: [
                            {
                                id: 'q-iot-3-2-1',
                                text: 'Are real-time dashboards available for device monitoring?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-iot-3-2-2',
                                text: 'Is there anomaly detection for device behavior?',
                                order: 2,
                                isMandatory: false,
                                response: null,
                            },
                        ],
                    },
                ],
            },
            {
                id: 'area-iot-4',
                name: 'DevOps & Operations',
                description: 'Assessment of CI/CD, monitoring, alerting, and operational practices',
                order: 4,
                weightage: 20,
                scopes: [
                    {
                        id: 'scope-iot-4-1',
                        name: 'CI/CD Pipeline',
                        order: 1,
                        questions: [
                            {
                                id: 'q-iot-4-1-1',
                                text: 'Is there automated CI/CD for platform components?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-iot-4-1-2',
                                text: 'Is firmware deployment automated and staged?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                        ],
                    },
                    {
                        id: 'scope-iot-4-2',
                        name: 'Monitoring & Alerting',
                        order: 2,
                        questions: [
                            {
                                id: 'q-iot-4-2-1',
                                text: 'Is there comprehensive platform monitoring in place?',
                                order: 1,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-iot-4-2-2',
                                text: 'Are alerts configured for critical failures and thresholds?',
                                order: 2,
                                isMandatory: true,
                                response: null,
                            },
                            {
                                id: 'q-iot-4-2-3',
                                text: 'Is there an on-call rotation for incident response?',
                                order: 3,
                                isMandatory: false,
                                response: null,
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

// =====================
// Audit Reports
// =====================
export const mockAuditReports: Record<string, AuditReport> = {
    'audit-1': {
        id: 'audit-1',
        projectName: 'Phoenix Banking Platform',
        auditDate: '2026-02-15',
        overallScore: 72,
        isFinalized: false,
        areaScores: [
            { areaId: 'area-1', areaName: 'Architecture & Design', score: 11, maxScore: 15, percentage: 73 },
            { areaId: 'area-2', areaName: 'Code Quality', score: 13, maxScore: 15, percentage: 87 },
            { areaId: 'area-3', areaName: 'Testing & Quality Assurance', score: 12, maxScore: 15, percentage: 80 },
            { areaId: 'area-4', areaName: 'Security', score: 4, maxScore: 15, percentage: 27 },
            { areaId: 'area-5', areaName: 'DevOps & Deployment', score: 9, maxScore: 10, percentage: 90 },
        ],
        findings: [
            {
                areaId: 'area-1',
                areaName: 'Architecture & Design',
                items: [
                    {
                        question: 'Are architectural decisions properly documented with ADRs?',
                        score: 3,
                        comment: 'Some ADRs exist but coverage is inconsistent.',
                        recommendation: 'Implement a mandatory ADR process for all significant decisions.',
                    },
                ],
            },
            {
                areaId: 'area-3',
                areaName: 'Testing & Quality Assurance',
                items: [
                    {
                        question: 'Are integration tests in place for critical workflows?',
                        score: 3,
                        comment: 'Integration tests exist but are flaky in CI environment.',
                        recommendation: 'Implement test containers for stable integration testing.',
                    },
                ],
            },
            {
                areaId: 'area-4',
                areaName: 'Security',
                items: [
                    {
                        question: 'Is there a process for handling security vulnerabilities?',
                        score: 0,
                        comment: 'Not answered',
                        recommendation: 'Establish a vulnerability management process.',
                    },
                    {
                        question: 'Are secrets properly managed?',
                        score: 0,
                        comment: 'Not answered',
                        recommendation: 'Implement secrets management solution.',
                    },
                ],
            },
        ],
        evidences: [
            { id: 'ev-1', fileName: 'architecture-diagram.pdf', fileUrl: '/files/architecture-diagram.pdf' },
            { id: 'ev-2', fileName: 'sonar-report.pdf', fileUrl: '/files/sonar-report.pdf' },
            { id: 'ev-3', fileName: 'coverage-report.html', fileUrl: '/files/coverage-report.html' },
            { id: 'ev-4', fileName: 'pipeline-overview.png', fileUrl: '/files/pipeline-overview.png' },
        ],
    },
    'audit-2': {
        id: 'audit-2',
        projectName: 'Atlas Healthcare System',
        auditDate: '2026-02-10',
        overallScore: 85,
        isFinalized: true,
        areaScores: [
            { areaId: 'area-1', areaName: 'Architecture & Design', score: 9, maxScore: 10, percentage: 90 },
            { areaId: 'area-2', areaName: 'Code Quality', score: 5, maxScore: 5, percentage: 100 },
        ],
        findings: [],
        evidences: [],
    },
    'audit-4': {
        id: 'audit-4',
        projectName: 'Horizon Analytics',
        auditDate: '2026-01-28',
        overallScore: 91,
        isFinalized: true,
        areaScores: [
            { areaId: 'area-1', areaName: 'Agile Practices', score: 28, maxScore: 30, percentage: 93 },
            { areaId: 'area-2', areaName: 'Team Dynamics', score: 25, maxScore: 30, percentage: 83 },
            { areaId: 'area-3', areaName: 'Continuous Improvement', score: 27, maxScore: 30, percentage: 90 },
        ],
        findings: [
            {
                areaId: 'area-2',
                areaName: 'Team Dynamics',
                items: [
                    {
                        question: 'Is there regular retrospective feedback implementation?',
                        score: 3,
                        comment: 'Retrospectives happen but action items are not always followed up.',
                        recommendation: 'Track retrospective action items in sprint backlog.',
                    },
                ],
            },
        ],
        evidences: [
            { id: 'ev-5', fileName: 'team-velocity-chart.png', fileUrl: '/files/team-velocity-chart.png' },
        ],
    },
    'audit-6': {
        id: 'audit-6',
        projectName: 'Phoenix Banking Platform',
        auditDate: '2026-01-15',
        overallScore: 45,
        isFinalized: true,
        areaScores: [
            { areaId: 'area-1', areaName: 'Authentication & Authorization', score: 12, maxScore: 20, percentage: 60 },
            { areaId: 'area-2', areaName: 'Data Protection', score: 8, maxScore: 20, percentage: 40 },
            { areaId: 'area-3', areaName: 'Network Security', score: 10, maxScore: 20, percentage: 50 },
            { areaId: 'area-4', areaName: 'Compliance', score: 6, maxScore: 20, percentage: 30 },
            { areaId: 'area-5', areaName: 'Incident Response', score: 9, maxScore: 20, percentage: 45 },
        ],
        findings: [
            {
                areaId: 'area-2',
                areaName: 'Data Protection',
                items: [
                    {
                        question: 'Is data encrypted at rest?',
                        score: 2,
                        comment: 'Only sensitive fields are encrypted, not full database encryption.',
                        recommendation: 'Implement full database encryption with proper key management.',
                    },
                    {
                        question: 'Are backup procedures documented and tested?',
                        score: 1,
                        comment: 'Backups exist but recovery has never been tested.',
                        recommendation: 'Schedule quarterly disaster recovery drills.',
                    },
                ],
            },
            {
                areaId: 'area-4',
                areaName: 'Compliance',
                items: [
                    {
                        question: 'Is there a data retention policy?',
                        score: 1,
                        comment: 'No formal data retention policy exists.',
                        recommendation: 'Establish data retention policy aligned with regulatory requirements.',
                    },
                    {
                        question: 'Are audit logs maintained for compliance?',
                        score: 2,
                        comment: 'Basic logging exists but lacks required detail for compliance.',
                        recommendation: 'Implement comprehensive audit logging with tamper protection.',
                    },
                ],
            },
        ],
        evidences: [
            { id: 'ev-6', fileName: 'security-scan-results.pdf', fileUrl: '/files/security-scan-results.pdf' },
            { id: 'ev-7', fileName: 'penetration-test-report.pdf', fileUrl: '/files/penetration-test-report.pdf' },
        ],
    },
};

// =====================
// Action Items
// =====================
export const mockActionItems: ActionItem[] = [
    // Actions for audit-1 (Phoenix Banking - In Progress)
    {
        id: 'action-1',
        auditId: 'audit-1',
        title: 'Implement ADR Process',
        description: 'Establish a mandatory Architecture Decision Record process for all significant technical decisions. Create templates and integrate into PR workflow.',
        owner: mockUsers[3],
        priority: 'High',
        status: 'In Progress',
        dueDate: '2026-02-28',
        createdAt: '2026-02-15',
        createdBy: mockUsers[0],
    },
    {
        id: 'action-2',
        auditId: 'audit-1',
        title: 'Fix Integration Test Flakiness',
        description: 'Investigate and resolve flaky integration tests in CI environment. Implement test containers for database dependencies.',
        owner: mockUsers[4],
        priority: 'Critical',
        status: 'Open',
        dueDate: '2026-02-20',
        createdAt: '2026-02-15',
        createdBy: mockUsers[0],
    },
    {
        id: 'action-3',
        auditId: 'audit-1',
        title: 'Add DAST to Pipeline',
        description: 'Integrate Dynamic Application Security Testing into the CI/CD pipeline for runtime security vulnerability detection.',
        owner: mockUsers[4],
        priority: 'Medium',
        status: 'Open',
        dueDate: '2026-03-15',
        createdAt: '2026-02-15',
        createdBy: mockUsers[0],
    },
    {
        id: 'action-4',
        auditId: 'audit-1',
        title: 'Complete Security Assessment',
        description: 'Answer remaining security questions in the audit and implement vulnerability management process.',
        owner: mockUsers[1],
        priority: 'High',
        status: 'Open',
        dueDate: '2026-02-18',
        createdAt: '2026-02-15',
        createdBy: mockUsers[0],
    },

    // Actions for audit-2 (Atlas Healthcare - Completed)
    {
        id: 'action-5',
        auditId: 'audit-2',
        title: 'Document API Contracts',
        description: 'Create OpenAPI specifications for all internal and external APIs.',
        owner: mockUsers[4],
        priority: 'Low',
        status: 'Resolved',
        dueDate: '2026-02-08',
        createdAt: '2026-02-01',
        createdBy: mockUsers[0],
    },
    {
        id: 'action-6',
        auditId: 'audit-2',
        title: 'Set Up Monitoring Dashboard',
        description: 'Create Grafana dashboards for key service metrics and SLOs.',
        owner: mockUsers[3],
        priority: 'Medium',
        status: 'Closed',
        dueDate: '2026-02-05',
        createdAt: '2026-02-01',
        createdBy: mockUsers[0],
    },

    // Actions for audit-4 (Horizon Analytics - Closed)
    {
        id: 'action-7',
        auditId: 'audit-4',
        title: 'Track Retrospective Actions',
        description: 'Implement a system to track retrospective action items in the sprint backlog with follow-up assignments.',
        owner: mockUsers[3],
        priority: 'Medium',
        status: 'Closed',
        dueDate: '2026-02-10',
        createdAt: '2026-01-28',
        createdBy: mockUsers[6],
    },

    // Actions for audit-6 (Phoenix Security Review - Completed with issues)
    {
        id: 'action-8',
        auditId: 'audit-6',
        title: 'Implement Full Database Encryption',
        description: 'Enable full database encryption with proper key management using AWS KMS.',
        owner: mockUsers[4],
        priority: 'Critical',
        status: 'In Progress',
        dueDate: '2026-01-30',
        createdAt: '2026-01-15',
        createdBy: mockUsers[0],
    },
    {
        id: 'action-9',
        auditId: 'audit-6',
        title: 'Schedule DR Drills',
        description: 'Plan and execute quarterly disaster recovery drills. Document procedures and train team.',
        owner: mockUsers[3],
        priority: 'High',
        status: 'Open',
        dueDate: '2026-02-01',
        createdAt: '2026-01-15',
        createdBy: mockUsers[0],
    },
    {
        id: 'action-10',
        auditId: 'audit-6',
        title: 'Create Data Retention Policy',
        description: 'Work with legal and compliance to establish formal data retention policy aligned with banking regulations.',
        owner: mockUsers[5],
        priority: 'High',
        status: 'In Progress',
        dueDate: '2026-02-15',
        createdAt: '2026-01-15',
        createdBy: mockUsers[6],
    },
    {
        id: 'action-11',
        auditId: 'audit-6',
        title: 'Enhance Audit Logging',
        description: 'Implement comprehensive audit logging with tamper protection. Include all required fields for regulatory compliance.',
        owner: mockUsers[4],
        priority: 'Critical',
        status: 'Open',
        dueDate: '2026-02-10',
        createdAt: '2026-01-15',
        createdBy: mockUsers[0],
    },

    // Actions for audit-7 (Atlas Security - In Progress)
    {
        id: 'action-12',
        auditId: 'audit-7',
        title: 'HIPAA Compliance Review',
        description: 'Complete HIPAA compliance checklist and address any gaps identified.',
        owner: mockUsers[4],
        priority: 'Critical',
        status: 'In Progress',
        dueDate: '2026-02-25',
        createdAt: '2026-02-08',
        createdBy: mockUsers[6],
    },
];

// Helper to get actions for current user (simulating user-4 being logged in)
export const getCurrentUserActions = (): ActionItem[] => {
    const currentUserId = 'user-4'; // Simulating David Kim is logged in
    return mockActionItems.filter(action => action.owner.id === currentUserId);
};

// Helper to get actions by audit ID
export const getActionsByAuditId = (auditId: string): ActionItem[] => {
    return mockActionItems.filter(action => action.auditId === auditId);
};
