import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { WifiIcon } from 'lucide-react-native';
import { StatusIndicator, Card, colors } from './UIComponents';

interface ConnectionCardProps {
  connection: {
    connection_id: string;
    connection_name: string;
    connection_discription?: string;
    connection_url?: string;
    typeof_connection?: string;
    ping_status?: boolean;
    protocol?: string;
  };
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({ connection }) => {
  const handlePress = () => {
    router.push(`/(tabs)/connection/${connection.connection_id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardWrapper} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <WifiIcon size={24} color={colors.primary} />
          </View>
          <View style={styles.statusContainer}>
            <StatusIndicator 
              isActive={connection.ping_status === true} 
              label={connection.ping_status ? 'Online' : 'Offline'} 
            />
          </View>
        </View>
        
        <Text style={styles.title}>{connection.connection_name}</Text>
        
        {connection.connection_discription && (
          <Text style={styles.description} numberOfLines={2}>
            {connection.connection_discription}
          </Text>
        )}
        
        <View style={styles.footer}>
          {connection.protocol && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{connection.protocol.toUpperCase()}</Text>
            </View>
          )}
          
          {connection.typeof_connection && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{connection.typeof_connection}</Text>
            </View>
          )}
          
          {connection.connection_url && (
            <Text style={styles.url} numberOfLines={1}>
              {connection.connection_url}
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 8,
  },
  tag: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  url: {
    color: colors.textSecondary,
    fontSize: 12,
    flex: 1,
  },
});

export default ConnectionCard;