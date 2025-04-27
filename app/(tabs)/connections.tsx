import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { iotService } from '@/services/api';
import ConnectionCard from '@/components/ConnectionCard';
import { colors, Button } from '@/components/UIComponents';
import { LogOut, RefreshCw } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface Connection {
  connection_id: string;
  connection_name: string;
  connection_discription?: string;
  connection_url?: string;
  typeof_connection?: string;
  ping_status?: boolean;
  protocol?: string;
}

export default function ConnectionsScreen() {
  const { logout } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      setError(null);
      const data = await iotService.getAllConnections();
      setConnections(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching connections:', err);
      setError(err.message || 'Failed to load connections');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConnections();
  };

  const renderEmptyState = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Animated.View entering={FadeIn.duration(600)}>
          <View style={styles.emptyIconContainer}>
            <WifiIcon size={64} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No Connections Found</Text>
          <Text style={styles.emptyText}>
            You don't have any IoT connections set up yet.
          </Text>
          <Button 
            title="Refresh" 
            onPress={onRefresh} 
            style={styles.refreshButton}
            leftIcon={<RefreshCw size={18} color="#FFFFFF" />}
          />
        </Animated.View>
      </View>
    );
  };

  const renderItem = ({ item, index }: { item: Connection; index: number }) => {
    return (
      <Animated.View entering={FadeInDown.duration(400).delay(index * 100)}>
        <ConnectionCard connection={item} />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>IoT Connections</Text>
        <Button
          title="Logout"
          variant="outline"
          size="small"
          onPress={logout}
          leftIcon={<LogOut size={18} color={colors.primary} />}
          style={styles.logoutButton}
        />
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Try Again" 
            onPress={fetchConnections} 
            size="small" 
            style={{ marginTop: 8 }}
          />
        </View>
      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading connections...</Text>
        </View>
      ) : (
        <FlatList
          data={connections}
          renderItem={renderItem}
          keyExtractor={(item) => item.connection_id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

// Custom WifiIcon component
const WifiIcon = ({ size, color }: { size: number; color: string }) => {
  return (
    <View style={[styles.iconCircle, { width: size, height: size, borderRadius: size / 2 }]}>
      <WifiIcon size={size * 0.6} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
  },
  logoutButton: {
    paddingHorizontal: 12,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding at the bottom
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  emptyIconContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    marginTop: 8,
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
    margin: 16,
    padding: 16,
    backgroundColor: `${colors.error}10`,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});