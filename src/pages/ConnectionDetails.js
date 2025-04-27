import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConnectionById } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import MQTTViewer from '../components/MQTTViewer';
function ConnectionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [connection, setConnection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchConnection = async () => {
            if (!id)
                return;
            try {
                setError('');
                const data = await getConnectionById(id);
                setConnection(data);
            }
            catch (err) {
                setError(err.message || 'Failed to load connection details');
            }
            finally {
                setLoading(false);
            }
        };
        fetchConnection();
    }, [id]);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "min-h-screen bg-gray-100 p-8", children: _jsx("div", { className: "max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6", children: _jsxs("div", { className: "text-center py-8", children: [_jsxs("div", { className: "text-red-500 mb-4", children: ["Error: ", error] }), _jsx("button", { onClick: () => navigate('/connections'), className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600", children: "Back to Connections" })] }) }) }));
    }
    if (!connection) {
        return (_jsx("div", { className: "min-h-screen bg-gray-100 p-8", children: _jsx("div", { className: "max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6", children: _jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "text-gray-500 mb-4", children: "Connection not found" }), _jsx("button", { onClick: () => navigate('/connections'), className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600", children: "Back to Connections" })] }) }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("div", { className: "bg-white shadow", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "py-6 flex items-center", children: [_jsx("button", { onClick: () => navigate('/connections'), className: "mr-4 text-gray-600 hover:text-gray-900", children: _jsx(ArrowLeft, { size: 24 }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: connection.connection_name })] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsx(MQTTViewer, { connection: connection }) })] }));
}
export default ConnectionDetails;
