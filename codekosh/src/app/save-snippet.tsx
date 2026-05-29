import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
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
  const {
    isEditing,
    title, setTitle,
    description, setDescription,
    language, setLanguage,
    code, setCode,
    tags, setTags,
    screenshotUri,
    tempScreenshotUri,
    loading,
    pickScreenshot,
    removeScreenshot,
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

          <View style={styles.screenshotSection}>
            <Text style={[styles.label, { color: colors.text, fontSize: typography.fontSizes.sm }]}>
              Screenshot Attachment
            </Text>
            {screenshotUri || tempScreenshotUri ? (
              <View style={[styles.imageContainer, { borderColor: colors.border, borderRadius: borderRadius.md }]}>
                <Image source={{ uri: tempScreenshotUri || screenshotUri }} style={styles.screenshotPreview} />
                <TouchableOpacity
                  style={[styles.removeButton, { backgroundColor: colors.error }]}
                  onPress={removeScreenshot}
                >
                  <Ionicons name="trash-outline" size={16} color="white" />
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.uploadButton, { borderColor: colors.border, borderRadius: borderRadius.md }]}
                onPress={pickScreenshot}
                activeOpacity={0.7}
              >
                <Ionicons name="camera-outline" size={24} color={colors.primary} />
                <Text style={[styles.uploadButtonText, { color: colors.text }]}>Attach Screenshot</Text>
              </TouchableOpacity>
            )}
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
  screenshotSection: {
    marginBottom: 20,
    width: '100%',
  },
  imageContainer: {
    borderWidth: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenshotPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
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
});
