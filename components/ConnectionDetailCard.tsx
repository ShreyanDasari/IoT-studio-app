import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Card, colors, StatusIndicator } from './UIComponents';
import { WifiIcon, ServerIcon, ClockIcon, KeyIcon, HashIcon } from 'lucide-react-native';

interface ConnectionDetailProps {
  connection: {
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
  };
}

const DetailItem = ({ label, value, icon }: { label: string; value: string | number | undefined; icon?: React.ReactNode }) => {
  if (value === undefined || value === null) return null;
  
  return (
    <View style={styles.detailItem}>
      {icon && <View style={styles.detailIcon}>{icon}</View>}
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
};

const ConnectionDetailCard: React.FC<ConnectionDetailProps> = ({ connection }) => {
  // Format created date if it exists
  const formattedDate = connection.created_at 
    ? new Date(connection.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{connection.connection_name}</Text>
            {connection.connection_discription && (
              <Text style={styles.description}>{connection.connection_discription}</Text>
            )}
          </View>
          
          <View style={styles.statusSection}>
            <StatusIndicator 
              isActive={connection.ping_status === true} 
              label={connection.ping_status ? 'Online' : 'Offline'} 
            />
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Connection Details</Text>
          
          <DetailItem
            label="Protocol"
            value={connection.protocol?.toUpperCase()}
            icon={<ServerIcon size={18} color={colors.primary} />}
          />
          
          <DetailItem
            label="Connection URL"
            value={connection.connection_url}
            icon={<WifiIcon size={18} color={colors.primary} />}
          />
          
          <DetailItem
            label="Port"
            value={connection.port}
            icon={<ServerIcon size={18} color={colors.primary} />}
          />
          
          <DetailItem
            label="Connection Type"
            value={connection.typeof_connection}
            icon={<ServerIcon size={18} color={colors.primary} />}
          />
          
          <DetailItem
            label="Keep Alive (seconds)"
            value={connection.keep_alive}
            icon={<ClockIcon size={18} color={colors.primary} />}
          />
          
          <DetailItem
            label="QoS Level"
            value={connection.qos}
            icon={<HashIcon size={18} color={colors.primary} />}
          />
          
          <DetailItem
            label="Created"
            value={formattedDate}
            icon={<ClockIcon size={18} color={colors.primary} />}
          />
        </View>
        
        {(connection.username || connection.password) && (
          <>
            <View style={styles.divider} />
            
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Authentication</Text>
              
              <DetailItem
                label="Username"
                value={connection.username}
                icon={<KeyIcon size={18} color={colors.primary} />}
              />
              
              <DetailItem
                label="Password"
                value="••••••••" // For security, we don't show the actual password
                icon={<KeyIcon size={18} color={colors.primary} />}
              />
              
              <DetailItem
                label="Authentication Required"
                value={connection.authenticated_broker ? "Yes" : "No"}
                icon={<KeyIcon size={18} color={colors.primary} />}
              />
            </View>
          </>
        )}
        
        {connection.subscribe_topic && (
          <>
            <View style={styles.divider} />
            
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Subscription</Text>
              
              <DetailItem
                label="Topic"
                value={connection.subscribe_topic}
                icon={<HashIcon size={18} color={colors.primary} />}
              />
            </View>
          </>
        )}
        
        {connection.response_parameters && connection.response_parameters.length > 0 && (
          <>
            <View style={styles.divider} />
            
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Response Parameters</Text>
              
              {connection.response_parameters.map((param, index) => (
                <View key={index} style={styles.parameterItem}>
                  <Text style={styles.parameterText}>{param}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
  },
  statusSection: {
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  detailsSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailIcon: {
    width: 24,
    marginRight: 8,
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
  },
  parameterItem: {
    backgroundColor: colors.background,
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  parameterText: {
    fontSize: 14,
    color: colors.text,
  },
});

export default ConnectionDetailCard;