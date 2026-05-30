import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import { useAlert } from '../context/use-alert-context';
import { Badge } from '../components/badge';
import { CodeEditor } from '../components/code-editor';
import { IconButton } from '../components/icon-button';
import { useSnippetContext } from '../context/use-snippet-context';
import { useSnippetOperations } from '../hooks/use-snippet-operations';
import { useAppTheme } from '../theme';
import { Snippet } from '../types/snippet';

export default function SnippetDetailsScreen() {
  const { colors, spacing, typography, borderRadius } = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSnippetById, deleteSnippet, toggleFavorite } = useSnippetContext();
  const { showAlert } = useAlert();
  const { saveCodeFile, shareCodeFile } = useSnippetOperations();
  const router = useRouter();

  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => toggleFavorite(snippet.id)} style={{ marginRight: 20 }}>
                <Ionicons
                  name={snippet.isFavorite ? "star" : "star-outline"}
                  size={24}
                  color={snippet.isFavorite ? colors.favorite : colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash-outline" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
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
              <TouchableOpacity
                key={file.uri + index}
                style={[
                  styles.fileRow,
                  {
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.surface || '#f9f9f9',
                  }
                ]}
                onPress={async () => {
                  try {
                    const isAvailable = await Sharing.isAvailableAsync();
                    if (!isAvailable) {
                      showAlert('Error', 'Sharing is not available on this device.');
                      return;
                    }
                    await Sharing.shareAsync(file.uri);
                  } catch (err) {
                    console.error('Error sharing file:', err);
                    showAlert('Error', 'Failed to share file.');
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.fileInfo}>
                  <Ionicons
                    name={
                      file.name.endsWith('.pdf') ? 'document-text-outline' :
                      (file.name.endsWith('.ts') || file.name.endsWith('.tsx') || file.name.endsWith('.js') || file.name.endsWith('.jsx')) ? 'code-working-outline' :
                      'document-outline'
                    }
                    size={20}
                    color={colors.primary}
                  />
                  <View style={styles.fileNameContainer}>
                    <Text numberOfLines={1} style={[styles.fileName, { color: colors.text }]}>
                      {file.name}
                    </Text>
                    {file.size && (
                      <Text style={[styles.fileSize, { color: colors.textMuted || '#888' }]}>
                        {file.size > 1024 * 1024
                          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                          : `${(file.size / 1024).toFixed(1)} KB`
                        }
                      </Text>
                    )}
                  </View>
                </View>
                <Ionicons name="share-outline" size={18} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary, borderRadius: borderRadius.md }]}
            onPress={() => saveCodeFile(snippet)}
            activeOpacity={0.8}
          >
            <Ionicons name="save-outline" size={18} color={colors.background} />
            <Text style={[styles.actionButtonText, { color: colors.background }]}>Save Code File</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary, borderRadius: borderRadius.md }]}
            onPress={() => shareCodeFile(snippet)}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social-outline" size={18} color={colors.background} />
            <Text style={[styles.actionButtonText, { color: colors.background }]}>Share Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.date, { color: colors.textMuted, fontSize: typography.fontSizes.xs }]}>
            Created: {new Date(snippet.createdAt).toLocaleString()}
          </Text>
          <Text style={[styles.date, { color: colors.textMuted, fontSize: typography.fontSizes.xs }]}>
            Updated: {new Date(snippet.updatedAt).toLocaleString()}
          </Text>
        </View>
      </ScrollView>

      <IconButton
        icon="pencil"
        size={24}
        style={styles.fab}
        onPress={() => router.push({
          pathname: '/save-snippet',
          params: { id: snippet.id }
        })}
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
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
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
});
