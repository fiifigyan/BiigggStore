import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications, useNotificationSettings } from '../../hooks/useNotifications';

export const NotificationsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const {
    notifications,
    isLoading,
    markAsRead,
    markAllRead,
    isMarkingRead,
    isMarkAllRead,
  } = useNotifications();
  const {
    settings,
    isLoading: settingsLoading,
    isError: settingsError,
    toggleSettings,
    isUpdating,
  } = useNotificationSettings();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  React.useEffect(() => {
    if (settings?.notificationsEnabled !== undefined) {
      setNotificationsEnabled(settings.notificationsEnabled);
    }
  }, [settings]);

  const handleToggleSettings = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      await toggleSettings(value);
    } catch (error) {
      setNotificationsEnabled(!value);
      Alert.alert('Error', 'Unable to update notification settings.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
    } catch (error) {
      Alert.alert('Error', 'Unable to mark all notifications as read.');
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={[styles.notificationItem, item.isRead && styles.notificationRead]}
        onPress={async () => {
          if (!item.isRead) {
            try {
              await markAsRead(item.id);
            } catch (error) {
              Alert.alert('Error', 'Unable to mark notification as read.');
            }
          }
        }}
      >
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationBody}>{item.body}</Text>
        <Text style={styles.notificationTimestamp}>{new Date(item.createdAt).toLocaleString()}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllRead} style={styles.actionButton} disabled={isMarkAllRead}>
          <Text style={[styles.actionText, isMarkAllRead && styles.disabledText]}>
            {isMarkAllRead ? 'Saving...' : 'Mark all read'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Enable notifications</Text>
          <Text style={styles.settingSubtitle}>
            {settingsError ? 'Unable to load settings' : 'Receive app notification updates'}
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleSettings}
          disabled={settingsLoading || isUpdating}
          trackColor={{ false: '#ddd', true: '#007AFF' }}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  actionButton: {
    padding: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#007AFF',
  },
  disabledText: {
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  notificationRead: {
    opacity: 0.7,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  notificationBody: {
    fontSize: 14,
    color: '#555',
  },
  notificationTimestamp: {
    marginTop: 10,
    fontSize: 12,
    color: '#999',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  settingContent: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});
