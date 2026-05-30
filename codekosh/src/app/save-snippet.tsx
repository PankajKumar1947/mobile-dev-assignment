import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { CodeEditor } from '../components/code-editor';
import { Input } from '../components/input';
import { Select } from '../components/select';
import { useSaveSnippet } from '../hooks/use-save-snippet';
import { useAppTheme } from '../theme';
import { LANGUAGES } from '../types/languages';

export default function SaveSnippetScreen() {
  const { colors, spacing, typography, borderRadius } = useAppTheme();
  const router = useRouter();
  const {
    isEditing,
    title, setTitle,
    description, setDescription,
    language, setLanguage,
    code, setCode,
    tags, setTags,
    attachedFiles,
    loading,
    pickFiles,
    removeFile,
    save,
  } = useSaveSnippet();

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ padding: spacing.md }}>
          <Stack.Screen
            options={{
              title: isEditing ? 'Edit Snippet' : 'Create Snippet',
              headerShown: true,
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
            }}
          />

          <Input
            label="Title"
            placeholder="e.g., UseAppTheme Hook"
            value={title}
            onChangeText={setTitle}
          />

          <Input
            label="Description"
            placeholder="What does this snippet do?"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={2}
          />

          <Select
            label="Language"
            value={language}
            options={LANGUAGES}
            onSelect={setLanguage}
            placeholder="Select a language"
          />

          <CodeEditor
            label="Code"
            language={language}
            initialValue={code}
            onChange={setCode}
            autoFocus={false}
            height={250}
          />

          <Input
            label="Tags"
            placeholder="e.g., react, algorithm (comma separated)"
            value={tags}
            onChangeText={setTags}
          />

          <View style={styles.filesSection}>
            <Text style={[styles.label, { color: colors.text, fontSize: typography.fontSizes.sm }]}>
              File Attachments (.ts, .tsx, .pdf, etc.)
            </Text>
            
            {attachedFiles.map((file, index) => (
              <View 
                key={file.uri + index} 
                style={[
                  styles.fileRow, 
                  { 
                    borderColor: colors.border, 
                    borderRadius: borderRadius.md,
                    backgroundColor: colors.surface || '#f9f9f9'
                  }
                ]}
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
                <TouchableOpacity
                  style={[styles.removeFileButton]}
                  onPress={() => removeFile(index)}
                >
                  <Ionicons name="close-circle" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.uploadButton, { borderColor: colors.border, borderRadius: borderRadius.md, marginTop: 8 }]}
              onPress={pickFiles}
              activeOpacity={0.7}
            >
              <Ionicons name="document-attach-outline" size={24} color={colors.primary} />
              <Text style={[styles.uploadButtonText, { color: colors.text }]}>Attach Files</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary, borderRadius: borderRadius.md }]}
            onPress={save}
            activeOpacity={0.8}
          >
            <Text style={[styles.saveButtonText, { color: colors.background, fontSize: typography.fontSizes.md }]}>
              {isEditing ? 'Update Snippet' : 'Save Snippet'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  saveButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  saveButtonText: {
    fontWeight: 'bold',
  },
  filesSection: {
    marginBottom: 20,
    width: '100%',
    marginTop: 20,
  },
  uploadButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  uploadButtonText: {
    marginLeft: 8,
    fontWeight: '500',
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
  removeFileButton: {
    padding: 4,
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
