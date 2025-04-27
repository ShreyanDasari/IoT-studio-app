import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Clock } from 'lucide-react';
function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [sessionTime, setSessionTime] = useState('170');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/connections');
        }
    }, [isAuthenticated, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(emailOrUsername, password, parseInt(sessionTime));
            navigate('/connections');
        }
        catch (err) {
            setError(err.message || 'Failed to login');
            console.error('Login error:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSessionTimeChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
        setSessionTime(value);
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-md w-96", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-center", children: "IoT Connect" }), error && (_jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4", children: error })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 text-sm font-bold mb-2", children: "Email or Username" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", size: 20 }), _jsx("input", { type: "text", value: emailOrUsername, onChange: (e) => setEmailOrUsername(e.target.value), className: "w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500", placeholder: "Enter your email or username", required: true })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 text-sm font-bold mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", size: 20 }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500", placeholder: "Enter your password", required: true })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-gray-700 text-sm font-bold mb-2", children: "Session Time (minutes)" }), _jsxs("div", { className: "relative", children: [_jsx(Clock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", size: 20 }), _jsx("input", { type: "text", value: sessionTime, onChange: handleSessionTimeChange, className: "w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500", placeholder: "Enter session time in minutes", required: true })] })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50", children: isLoading ? 'Signing in...' : 'Sign In' })] })] }) }));
}
export default Login;
