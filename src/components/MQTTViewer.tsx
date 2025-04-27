import React, { useState, useEffect } from 'react';
import { Client } from 'paho-mqtt';
import { format } from 'date-fns';
import { Wifi, Grid, CurlyBraces as BracesCurly, Clock, LineChart, Download, Upload, Play, Square } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

import * as XLSX from 'xlsx';

interface Message {
  temperature: number;
  humidity: number;
  light: string;
  status: string;
  timestamp: string;
  arrivalTime: string;
}

interface Connection {
  authenticated_broker: boolean;
  connection_discription: string;
  connection_id: string;
  connection_name: string;
  connection_url: string;
  created_at: string;
  keep_alive: number;
  password: string;
  ping_status: boolean;
  port: number;
  protocol: string;
  qos: number;
  response_parameters: string[];
  subscribe_topic: string;
  typeof_connection: string;
  username: string;
}

interface MQTTViewerProps {
  connection: Connection;
}

interface MQTTConnectionError {
  errorMessage: string;
  errorCode: number;
}

const MQTTViewer: React.FC<MQTTViewerProps> = ({ connection }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'json' | 'timeline' | 'graph'>('table');
  const [client, setClient] = useState<Client | null>(null);

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
        const newMessage: Message = {
          ...jsonMessage,
          arrivalTime: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        };
        setMessages(prev => [newMessage, ...prev.slice(0, 10)]);
        console.log("📡 Received MQTT message:", jsonMessage);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    mqttClient.connect({
      onSuccess: () => {
        console.log("Connected to MQTT broker");
        setIsConnected(true);
        mqttClient.subscribe(connection.subscribe_topic, { qos: connection.qos as 0 | 1 | 2 });
      },
      onFailure: (err: MQTTConnectionError) => {
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

  return (
    <div className="p-6">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Wifi className={isConnected ? "text-green-500" : "text-gray-400"} />
            <span className="ml-2">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div>
            Messages: {messages.length}
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleConnect}
            disabled={isConnected}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 flex items-center"
          >
            <Play size={16} />
            <span className="ml-2">Start</span>
          </button>
          <button
            onClick={handleDisconnect}
            disabled={!isConnected}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50 flex items-center"
          >
            <Square size={16} />
            <span className="ml-2">Stop</span>
          </button>
          <button onClick={downloadJSON} className="px-4 py-2 bg-black text-white rounded flex items-center">
            <Download size={16} />
            <span className="ml-2">JSON</span>
          </button>
          <button onClick={downloadExcel} className="px-4 py-2 bg-green-500 text-white rounded flex items-center">
            <Download size={16} />
            <span className="ml-2">Excel</span>
          </button>
          <button onClick={downloadText} className="px-4 py-2 bg-blue-500 text-white rounded flex items-center">
            <Download size={16} />
            <span className="ml-2">Text</span>
          </button>
          <label className="px-4 py-2 bg-purple-500 text-white rounded flex items-center cursor-pointer">
            <Upload size={16} />
            <span className="ml-2">Upload</span>
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>

      {/* Data view */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Received Data ({messages.length} messages)</h2>
          <div className="flex space-x-2">
            <button onClick={() => setViewMode('table')} className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100' : ''}`}>
              <Grid size={20} />
            </button>
            <button onClick={() => setViewMode('json')} className={`p-2 rounded ${viewMode === 'json' ? 'bg-blue-100' : ''}`}>
              <BracesCurly size={20} />
            </button>
            <button onClick={() => setViewMode('timeline')} className={`p-2 rounded ${viewMode === 'timeline' ? 'bg-blue-100' : ''}`}>
              <Clock size={20} />
            </button>
            <button onClick={() => setViewMode('graph')} className={`p-2 rounded ${viewMode === 'graph' ? 'bg-blue-100' : ''}`}>
              <LineChart size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          {/* View Modes */}
          {viewMode === 'table' && (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arrival Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temperature</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Humidity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Light</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm">{msg.arrivalTime}</td>
                    <td className="px-6 py-4 text-sm">{msg.temperature}</td>
                    <td className="px-6 py-4 text-sm">{msg.humidity}</td>
                    <td className="px-6 py-4 text-sm">{msg.light}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        msg.status === 'normal' ? 'bg-green-100 text-green-800' :
                        msg.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{msg.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {viewMode === 'json' && (
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
              {JSON.stringify(messages, null, 2)}
            </pre>
          )}

          {viewMode === 'timeline' && (
            <ul className="space-y-2">
              {messages.map((msg, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Clock size={16} className="text-blue-500" />
                  <span>{msg.arrivalTime} — {msg.status}</span>
                </li>
              ))}
            </ul>
          )}
          {viewMode === 'graph' && (
            <div style={{ width: '100%', height: 400 }}>
              {messages.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={[...messages].reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="arrivalTime" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500">No data to display</div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MQTTViewer;
