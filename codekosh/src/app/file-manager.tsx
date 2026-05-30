import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FileActionModal } from '../components/file-action-modal';
import { FileItemCard } from '../components/file-item-card';
import { FilePreviewModal } from '../components/file-preview-modal';
import { FolderSelectModal } from '../components/folder-select-modal';
import { useFileManager } from '../hooks/use-file-manager';
import { useAppTheme } from '../theme';

export default function FileManagerScreen() {
  const { colors, spacing } = useAppTheme();

  const {
    items,
    loading,
    folders,
    selectedItem,
    setSelectedItem,
    itemMenuVisible,
    setItemMenuVisible,
    previewVisible,
    setPreviewVisible,
    previewContent,
    previewLoading,
    moveCopyVisible,
    setMoveCopyVisible,
    moveCopyAction,
    getHeaderTitle,
    handleHeaderBack,
    handleItemPress,
    handleItemLongPress,
    handleDeleteItem,
    handleShareFile,
    handlePreviewFile,
    handleMoveCopySelect,
    handleExecuteMoveCopy,
  } = useFileManager();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: getHeaderTitle(),
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={handleHeaderBack}
              style={[
                styles.backButton,
                {
                  backgroundColor: colors.surface || 'rgba(128, 128, 128, 0.1)',
                  borderColor: colors.border,
                }
              ]}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.uri}
          contentContainerStyle={[styles.listContent, { padding: spacing.md }]}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="folder-open-outline" size={48} color={colors.textMuted} style={{ marginBottom: 12 }} />
              <Text style={{ color: colors.textMuted }}>This directory is empty.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <FileItemCard
              item={item}
              onPress={handleItemPress}
              onLongPress={handleItemLongPress}
            />
          )}
        />
      )}

      <FileActionModal
        visible={itemMenuVisible}
        item={selectedItem}
        onClose={() => {
          setItemMenuVisible(false);
          setSelectedItem(null);
        }}
        onPreview={() => handlePreviewFile(selectedItem!)}
        onMove={() => handleMoveCopySelect('move')}
        onCopy={() => handleMoveCopySelect('copy')}
        onShare={() => handleShareFile(selectedItem!)}
        onDelete={() => handleDeleteItem(selectedItem!)}
      />

      <FilePreviewModal
        visible={previewVisible}
        item={selectedItem}
        content={previewContent}
        loading={previewLoading}
        onClose={() => {
          setPreviewVisible(false);
          setSelectedItem(null);
        }}
      />

      <FolderSelectModal
        visible={moveCopyVisible}
        item={selectedItem}
        action={moveCopyAction}
        folders={folders}
        onClose={() => {
          setMoveCopyVisible(false);
          setSelectedItem(null);
        }}
        onSelectFolder={handleExecuteMoveCopy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  listContent: {
    paddingBottom: 40,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});
