import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllConnections } from '../services/api';
import { Wifi, LogOut } from 'lucide-react';
function Connections() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchConnections();
    }, []);
    const fetchConnections = async () => {
        try {
            const data = await getAllConnections();
            setConnections(Array.isArray(data) ? data : []);
            setError('');
        }
        catch (err) {
            setError(err.message || 'Failed to load connections');
        }
        finally {
            setLoading(false);
        }
    };
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("div", { className: "bg-white shadow", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between items-center py-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "IoT Connections" }), _jsxs("button", { onClick: handleLogout, className: "flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50", children: [_jsx(LogOut, { size: 18, className: "mr-2" }), "Logout"] })] }) }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [error && (_jsxs("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4", children: [error, _jsx("button", { onClick: fetchConnections, className: "ml-4 underline", children: "Try Again" })] })), _jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3", children: connections.map((connection) => (_jsx("div", { onClick: () => navigate(`/connection/${connection.connection_id}`), className: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "bg-blue-100 p-2 rounded-full", children: _jsx(Wifi, { size: 24, className: "text-blue-600" }) }), _jsx("div", { className: `px-3 py-1 rounded-full text-sm ${connection.ping_status
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'}`, children: connection.ping_status ? 'Online' : 'Offline' })] }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: connection.connection_name }), connection.connection_discription && (_jsx("p", { className: "text-gray-600 mb-4 line-clamp-2", children: connection.connection_discription })), _jsxs("div", { className: "flex flex-wrap gap-2 mt-4", children: [connection.protocol && (_jsx("span", { className: "px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm", children: connection.protocol.toUpperCase() })), connection.typeof_connection && (_jsx("span", { className: "px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm", children: connection.typeof_connection }))] }), connection.connection_url && (_jsx("p", { className: "text-gray-500 text-sm mt-4 truncate", children: connection.connection_url }))] }) }, connection.connection_id))) }), connections.length === 0 && !error && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Wifi, { size: 48, className: "mx-auto text-gray-400 mb-4" }), _jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "No Connections Found" }), _jsx("p", { className: "text-gray-500", children: "You don't have any IoT connections set up yet." })] }))] })] }));
}
export default Connections;
