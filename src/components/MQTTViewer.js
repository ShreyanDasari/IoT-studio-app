import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Client } from 'paho-mqtt';
import { format } from 'date-fns';
import { Wifi, Grid, CurlyBraces as BracesCurly, Clock, LineChart, Download, Upload, Play, Square } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
const MQTTViewer = ({ connection }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [viewMode, setViewMode] = useState('table');
    const [client, setClient] = useState(null);
    const handleConnect = () => {
        const brokerUrl = `ws://${connection.connection_url}:${connection.port}/mqtt`;
        const clientId = `mqttjs_${Math.random().toString(16).slice(2, 10)}`;
        const mqttClient = new Client(brokerUrl, clientId);
        mqttClient.onConnectionLost = (responseObject) => {
            if (responseObject.errorCode !== 0) {
                console.log("Connection lost:", responseObject.errorMessage);
            }
            setIsConnected(false);
        };
        mqttClient.onMessageArrived = (message) => {
            try {
                const jsonMessage = JSON.parse(message.payloadString);
                const newMessage = {
                    ...jsonMessage,
                    arrivalTime: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                };
                setMessages(prev => [newMessage, ...prev.slice(0, 10)]);
                console.log("📡 Received MQTT message:", jsonMessage);
            }
            catch (error) {
                console.error("Error processing message:", error);
            }
        };
        mqttClient.connect({
            onSuccess: () => {
                console.log("Connected to MQTT broker");
                setIsConnected(true);
                mqttClient.subscribe(connection.subscribe_topic, { qos: connection.qos });
            },
            onFailure: (err) => {
                console.error("Failed to connect:", err);
                setIsConnected(false);
            },
            userName: connection.username,
            password: connection.password,
            keepAliveInterval: connection.keep_alive,
            useSSL: false,
        });
        setClient(mqttClient);
    };
    const handleDisconnect = () => {
        if (client && client.isConnected()) {
            client.disconnect();
            setIsConnected(false);
        }
    };
    const downloadJSON = () => {
        const dataStr = JSON.stringify(messages, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mqtt-messages.json';
        a.click();
    };
    const downloadExcel = () => {
        const ws = XLSX.utils.json_to_sheet(messages);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Messages');
        XLSX.writeFile(wb, 'mqtt-messages.xlsx');
    };
    const downloadText = () => {
        const text = messages.map(msg => Object.values(msg).join('\t')).join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mqtt-messages.txt';
        a.click();
    };
    useEffect(() => {
        return () => {
            if (client && client.isConnected()) {
                client.disconnect();
            }
        };
    }, [client]);
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Wifi, { className: isConnected ? "text-green-500" : "text-gray-400" }), _jsx("span", { className: "ml-2", children: isConnected ? 'Connected' : 'Disconnected' })] }), _jsxs("div", { children: ["Messages: ", messages.length] })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs("button", { onClick: handleConnect, disabled: isConnected, className: "px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 flex items-center", children: [_jsx(Play, { size: 16 }), _jsx("span", { className: "ml-2", children: "Start" })] }), _jsxs("button", { onClick: handleDisconnect, disabled: !isConnected, className: "px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 flex items-center", children: [_jsx(Square, { size: 16 }), _jsx("span", { className: "ml-2", children: "Stop" })] }), _jsxs("button", { onClick: downloadJSON, className: "px-4 py-2 bg-black text-white rounded flex items-center", children: [_jsx(Download, { size: 16 }), _jsx("span", { className: "ml-2", children: "JSON" })] }), _jsxs("button", { onClick: downloadExcel, className: "px-4 py-2 bg-green-500 text-white rounded flex items-center", children: [_jsx(Download, { size: 16 }), _jsx("span", { className: "ml-2", children: "Excel" })] }), _jsxs("button", { onClick: downloadText, className: "px-4 py-2 bg-blue-500 text-white rounded flex items-center", children: [_jsx(Download, { size: 16 }), _jsx("span", { className: "ml-2", children: "Text" })] }), _jsxs("label", { className: "px-4 py-2 bg-purple-500 text-white rounded flex items-center cursor-pointer", children: [_jsx(Upload, { size: 16 }), _jsx("span", { className: "ml-2", children: "Upload" }), _jsx("input", { type: "file", className: "hidden" })] })] })] }), _jsxs("div", { className: "bg-white rounded-lg shadow", children: [_jsxs("div", { className: "flex justify-between items-center p-4 border-b", children: [_jsxs("h2", { className: "text-lg font-semibold", children: ["Received Data (", messages.length, " messages)"] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setViewMode('table'), className: `p-2 rounded ${viewMode === 'table' ? 'bg-blue-100' : ''}`, children: _jsx(Grid, { size: 20 }) }), _jsx("button", { onClick: () => setViewMode('json'), className: `p-2 rounded ${viewMode === 'json' ? 'bg-blue-100' : ''}`, children: _jsx(BracesCurly, { size: 20 }) }), _jsx("button", { onClick: () => setViewMode('timeline'), className: `p-2 rounded ${viewMode === 'timeline' ? 'bg-blue-100' : ''}`, children: _jsx(Clock, { size: 20 }) }), _jsx("button", { onClick: () => setViewMode('graph'), className: `p-2 rounded ${viewMode === 'graph' ? 'bg-blue-100' : ''}`, children: _jsx(LineChart, { size: 20 }) })] })] }), _jsxs("div", { className: "overflow-x-auto p-4", children: [viewMode === 'table' && (_jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50", children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Arrival Time" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Temperature" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Humidity" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Light" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Timestamp" })] }) }), _jsx("tbody", { children: messages.map((msg, index) => (_jsxs("tr", { className: index % 2 === 0 ? 'bg-white' : 'bg-gray-50', children: [_jsx("td", { className: "px-6 py-4 text-sm", children: msg.arrivalTime }), _jsx("td", { className: "px-6 py-4 text-sm", children: msg.temperature }), _jsx("td", { className: "px-6 py-4 text-sm", children: msg.humidity }), _jsx("td", { className: "px-6 py-4 text-sm", children: msg.light }), _jsx("td", { className: "px-6 py-4 text-sm", children: _jsx("span", { className: `px-2 py-1 rounded-full text-xs ${msg.status === 'normal' ? 'bg-green-100 text-green-800' :
                                                            msg.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'}`, children: msg.status }) }), _jsx("td", { className: "px-6 py-4 text-sm", children: msg.timestamp })] }, index))) })] })), viewMode === 'json' && (_jsx("pre", { className: "text-sm bg-gray-100 p-4 rounded overflow-x-auto", children: JSON.stringify(messages, null, 2) })), viewMode === 'timeline' && (_jsx("ul", { className: "space-y-2", children: messages.map((msg, index) => (_jsxs("li", { className: "flex items-center space-x-2", children: [_jsx(Clock, { size: 16, className: "text-blue-500" }), _jsxs("span", { children: [msg.arrivalTime, " \u2014 ", msg.status] })] }, index))) })), viewMode === 'graph' && (_jsx("div", { style: { width: '100%', height: 400 }, children: messages.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(RechartsLineChart, { data: [...messages].reverse(), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "arrivalTime", tick: { fontSize: 10 } }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "temperature", stroke: "#8884d8", activeDot: { r: 8 } }), _jsx(Line, { type: "monotone", dataKey: "humidity", stroke: "#82ca9d" })] }) })) : (_jsx("div", { className: "text-center text-gray-500", children: "No data to display" })) }))] })] })] }));
};
export default MQTTViewer;
