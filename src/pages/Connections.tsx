import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllConnections } from '../services/api';
import { Wifi, LogOut } from 'lucide-react';

interface Connection {
  connection_id: string;
  connection_name: string;
  connection_discription?: string;
  connection_url?: string;
  typeof_connection?: string;
  ping_status?: boolean;
  protocol?: string;
}

function Connections() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
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
    } catch (err: any) {
      setError(err.message || 'Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">IoT Connections</h1>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={fetchConnections}
              className="ml-4 underline"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {connections.map((connection) => (
            <div
              key={connection.connection_id}
              onClick={() => navigate(`/connection/${connection.connection_id}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Wifi size={24} className="text-blue-600" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    connection.ping_status
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {connection.ping_status ? 'Online' : 'Offline'}
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-2">{connection.connection_name}</h2>
                {connection.connection_discription && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{connection.connection_discription}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {connection.protocol && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {connection.protocol.toUpperCase()}
                    </span>
                  )}
                  {connection.typeof_connection && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {connection.typeof_connection}
                    </span>
                  )}
                </div>

                {connection.connection_url && (
                  <p className="text-gray-500 text-sm mt-4 truncate">
                    {connection.connection_url}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {connections.length === 0 && !error && (
          <div className="text-center py-12">
            <Wifi size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Connections Found</h3>
            <p className="text-gray-500">You don't have any IoT connections set up yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Connections;