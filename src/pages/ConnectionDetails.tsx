import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConnectionById } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import MQTTViewer from '../components/MQTTViewer';

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

function ConnectionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConnection = async () => {
      if (!id) return;
      
      try {
        setError('');
        const data = await getConnectionById(id);
        setConnection(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load connection details');
      } finally {
        setLoading(false);
      }
    };

    fetchConnection();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">Error: {error}</div>
            <button
              onClick={() => navigate('/connections')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Back to Connections
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">Connection not found</div>
            <button
              onClick={() => navigate('/connections')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Back to Connections
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center">
            <button
              onClick={() => navigate('/connections')}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{connection.connection_name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MQTTViewer connection={connection} />
      </div>
    </div>
  );
}

export default ConnectionDetails;