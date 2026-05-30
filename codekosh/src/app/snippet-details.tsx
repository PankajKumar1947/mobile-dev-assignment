import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, TouchableWithoutFeedback } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { useAlert } from '../context/use-alert-context';
import { Badge } from '../components/badge';
import { CodeEditor } from '../components/code-editor';
import { IconButton } from '../components/icon-button';
import { useSnippetContext } from '../context/use-snippet-context';
import { useSnippetOperations } from '../hooks/use-snippet-operations';
import { useAppTheme } from '../theme';
import { Snippet } from '../types/snippet';
import { AiAssistant } from '../components/ai-assistant';
import { FilePreviewModal } from '../components/file-preview-modal';
import { FileItemCard } from '../components/file-item-card';
import { useFilePreview } from '../hooks/use-file-preview';

export default function SnippetDetailsScreen() {
  const { colors, spacing, typography, borderRadius } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSnippetById, deleteSnippet, toggleFavorite } = useSnippetContext();
  const { showAlert } = useAlert();
  const { saveCodeFile, shareCodeFile } = useSnippetOperations();
  const router = useRouter();

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [botVisible, setBotVisible] = useState(false);

  // Hook for file previews
  const {
    selectedItem,
    previewVisible,
    previewContent,
    previewLoading,
    handlePreviewFile,
    closePreview,
  } = useFilePreview();

  useEffect(() => {
    const fetchSnippet = async () => {
      if (id) {
        const data = await getSnippetById(id as string);
        setSnippet(data || null);
      }
      setLoading(false);
    };

    fetchSnippet();
  }, [id, getSnippetById]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!snippet) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Snippet not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    showAlert(
      'Delete Snippet',
      'Are you sure you want to delete this snippet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSnippet(snippet.id);
            router.back();
          }
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Details',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
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
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={[
                styles.menuButton,
                {
                  backgroundColor: colors.surface || 'rgba(128, 128, 128, 0.1)',
                  borderColor: colors.border,
                }
              ]}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={22} color={colors.text} />
            </TouchableOpacity>
          )
        }}
      />

      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text, fontSize: typography.fontSizes['2xl'] }]}>
            {snippet.title}
          </Text>
        </View>

        {snippet.description && (
          <Text style={[styles.description, { color: colors.text, fontSize: typography.fontSizes.md }]}>
            {snippet.description}
          </Text>
        )}

        <View style={styles.tagList}>
          {snippet.tags.map(tag => (
            <Badge key={tag} label={tag} />
          ))}
        </View>

        <View style={styles.languageContainer}>
          <Text style={[styles.languageText, { color: colors.textMuted || '#888', fontSize: typography.fontSizes.xs, fontWeight: 'bold', textTransform: 'capitalize' }]}>
            {snippet.language}
          </Text>
        </View>

        <CodeEditor
          language={snippet.language}
          initialValue={snippet.code}
          readOnly
          style={styles.codeContainer}
        />

        {snippet.attachedFiles && snippet.attachedFiles.length > 0 && (
          <View style={styles.filesContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.fontSizes.sm }]}>
              Attached Files (.ts, .tsx, .pdf, etc.)
            </Text>
            {snippet.attachedFiles.map((file, index) => (
              <FileItemCard
                key={file.uri + index}
                item={{
                  name: file.name,
                  uri: file.uri,
                  isDirectory: false,
                  size: file.size,
                }}
                onPress={handlePreviewFile}
              />
            ))}
          </View>
        )}



        <View style={styles.footer}>
          <Text style={[styles.date, { color: colors.textMuted, fontSize: typography.fontSizes.xs }]}>
            Created: {new Date(snippet.createdAt).toLocaleString()}
          </Text>
          <Text style={[styles.date, { color: colors.textMuted, fontSize: typography.fontSizes.xs }]}>
            Updated: {new Date(snippet.updatedAt).toLocaleString()}
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.menuContainer,
                {
                  backgroundColor: colors.surface || '#fff',
                  borderColor: colors.border,
                  shadowColor: '#000',
                },
              ]}
            >
              {/* Option: Favorite */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  toggleFavorite(snippet.id);
                }}
              >
                <Ionicons
                  name={snippet.isFavorite ? "star" : "star-outline"}
                  size={20}
                  color={snippet.isFavorite ? colors.favorite : colors.text}
                />
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {snippet.isFavorite ? 'Remove from Favorites' : 'Mark as Favorite'}
                </Text>
              </TouchableOpacity>

              {/* Option: Edit */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  router.push({
                    pathname: '/save-snippet',
                    params: { id: snippet.id }
                  });
                }}
              >
                <Ionicons name="pencil-outline" size={20} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>Edit Snippet</Text>
              </TouchableOpacity>

              {/* Option: Save Code File */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  saveCodeFile(snippet);
                }}
              >
                <Ionicons name="save-outline" size={20} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>Save Code File</Text>
              </TouchableOpacity>

              {/* Option: Share Code */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  shareCodeFile(snippet);
                }}
              >
                <Ionicons name="share-social-outline" size={20} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>Share Code</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

              {/* Option: Delete */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  handleDelete();
                }}
              >
                <Ionicons name="trash-outline" size={20} color={colors.error} />
                <Text style={[styles.menuItemText, { color: colors.error }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <IconButton
        icon="chatbubble-ellipses"
        size={24}
        style={styles.fab}
        onPress={() => setBotVisible(true)}
      />

      <AiAssistant
        visible={botVisible}
        onClose={() => setBotVisible(false)}
        snippet={snippet}
      />

      <FilePreviewModal
        visible={previewVisible}
        item={selectedItem}
        content={previewContent}
        loading={previewLoading}
        onClose={closePreview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
    lineHeight: 24,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  codeContainer: {
    marginBottom: 24,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 40,
  },
  date: {
    fontStyle: 'italic',
    marginBottom: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  filesContainer: {
    marginBottom: 24,
    width: '100%',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  fileNameContainer: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    marginTop: 2,
  },
  languageContainer: {
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  languageText: {
    fontSize: 12,
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
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    minWidth: 180,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    marginVertical: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
});
