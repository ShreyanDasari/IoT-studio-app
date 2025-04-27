import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, RefreshCw } from 'lucide-react-native';
import { iotService } from '@/services/api';
import ConnectionDetailCard from '@/components/ConnectionDetailCard';
import { colors, Button } from '@/components/UIComponents';
import Animated, { FadeIn } from 'react-native-reanimated';

interface Connection {
  authenticated_broker?: boolean;
  connection_discription?: string;
  connection_id: string;
  connection_name: string;
  connection_url?: string;
  created_at?: string;
  keep_alive?: number;
  password?: string;
  ping_status?: boolean;
  port?: number;
  protocol?: string;
  qos?: number;
  response_parameters?: string[];
  subscribe_topic?: string;
  typeof_connection?: string;
  username?: string;
}

export default function ConnectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnection = async () => {
    if (!id) {
      setError('Connection ID is missing');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await iotService.getConnectionById(id);
      setConnection(data);
    } catch (err: any) {
      console.error('Error fetching connection:', err);
      setError(err.message || 'Failed to load connection details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, [id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchConnection();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connection Details</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton} disabled={refreshing}>
          <RefreshCw 
            size={20} 
            color={refreshing ? colors.disabled : colors.primary} 
          />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Try Again" 
            onPress={fetchConnection} 
            style={styles.errorButton}
          />
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading connection details...</Text>
        </View>
      ) : connection ? (
        <Animated.View 
          style={styles.content} 
          entering={FadeIn.duration(400)}
        >
          <ConnectionDetailCard connection={connection} />
        </Animated.View>
      ) : (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Connection not found</Text>
          <Button 
            title="Go Back" 
            onPress={handleBack} 
            style={styles.notFoundButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.card,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  refreshButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorButton: {
    marginTop: 8,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  notFoundButton: {
    marginTop: 8,
  },
});