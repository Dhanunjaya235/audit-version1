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
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/templates" element={<TemplateStore />} />
            <Route path="/templates/:templateId" element={<TemplateDetail />} />
            <Route path="/audits" element={<AuditDashboard />} />
            <Route path="/audits/new" element={<CreateAudit />} />
            <Route path="/audits/:auditId/preparation" element={<AuditPreparation />} />
            <Route path="/audits/:auditId/execute" element={<ConductAudit />} />
            <Route path="/audits/:auditId/report" element={<AuditReportView />} />
            <Route path="/audits/:auditId/actions" element={<ActionItems />} />

            <Route path="/my-actions" element={<MyActions />} />
        </Routes>
    );
}

export default Routing;

