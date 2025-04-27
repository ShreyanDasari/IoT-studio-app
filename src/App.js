import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Connections from './pages/Connections';
import ConnectionDetails from './pages/ConnectionDetails';
import { AuthProvider } from './context/AuthContext';
function App() {
    return (_jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/connections", element: _jsx(Connections, {}) }), _jsx(Route, { path: "/connection/:id", element: _jsx(ConnectionDetails, {}) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/login", replace: true }) })] }) }) }));
}
export default App;
