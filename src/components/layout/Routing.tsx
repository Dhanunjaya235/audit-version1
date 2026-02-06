import { Routes, Route, Navigate } from 'react-router-dom';
import { TemplateStore } from '../../pages/TemplateStore';
import { TemplateDetail } from '../../pages/TemplateDetail';
import { ProjectsPage } from '../../pages/ProjectsPage';

// Audit Management Pages
import {
    AuditDashboard,
    CreateAudit,
    AuditPreparation,
    ConductAudit,
    AuditReportView,
    ActionItems,
    MyActions,
} from '../../features/audits';

function Routing() {
    return (
        <Routes>
            {/* Default redirect to Projects */}
            <Route path="/" element={<Navigate to="/projects" replace />} />

            {/* Projects - Main entry for triggering audits */}
            <Route path="/projects" element={<ProjectsPage />} />

            {/* Template Management Routes */}
            <Route path="/templates" element={<TemplateStore />} />
            <Route path="/templates/:templateId" element={<TemplateDetail />} />

            {/* Audit Management Routes */}
            <Route path="/audits" element={<AuditDashboard />} />
            <Route path="/audits/new" element={<CreateAudit />} />
            <Route path="/audits/:auditId/preparation" element={<AuditPreparation />} />
            <Route path="/audits/:auditId/execute" element={<ConductAudit />} />
            <Route path="/audits/:auditId/report" element={<AuditReportView />} />
            <Route path="/audits/:auditId/actions" element={<ActionItems />} />

            {/* My Actions Route */}
            <Route path="/my-actions" element={<MyActions />} />
        </Routes>
    );
}

export default Routing;

