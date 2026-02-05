import { Routes, Route, Navigate } from 'react-router-dom';
import { TemplateStore } from '../../pages/TemplateStore';
import { TemplateDetail } from '../../pages/TemplateDetail';

function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/templates" replace />} />
            <Route path="/templates" element={<TemplateStore />} />
            <Route path="/templates/:templateId" element={<TemplateDetail />} />
        </Routes>
    );
}

export default Routing;

