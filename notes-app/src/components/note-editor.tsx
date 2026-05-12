import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform, 
  ImageBackground,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../context/note-context';
import { useTheme } from '../context/theme-context';
import { Note } from '../types/notes';

interface NoteEditorProps {
  onCancel: () => void;
  initialNote?: Note;
}

export function NoteEditor({ onCancel, initialNote }: NoteEditorProps) {
  const { addNote, updateNote } = useNotes();
  const { theme, isDarkMode } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
    }
  }, [initialNote]);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      if (initialNote) {
        updateNote(initialNote.id, { title, content });
      } else {
        addNote({ title, content });
      }
      onCancel();
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ImageBackground 
            source={require('../../assets/diary.avif')} 
            style={styles.headerImage}
          >
            <View style={styles.headerOverlay}>
            <Pressable onPress={onCancel} style={styles.backButton}>
              <Text style={styles.backButtonText}>✕</Text>
            </Pressable>
            <Text style={styles.headerTitle}>{initialNote ? 'Edit Note' : 'New Note'}</Text>
          </View>
        </ImageBackground>

        <View style={styles.form}>
          <TextInput
            style={[styles.titleInput, { color: theme.text }]}
            placeholder="Title"
            placeholderTextColor={theme.placeholder}
            value={title}
            onChangeText={setTitle}
            selectionColor={theme.primary}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <TextInput
            style={[styles.contentInput, { color: theme.text }]}
            placeholder="Start typing..."
            placeholderTextColor={theme.placeholder}
            multiline
            value={content}
            onChangeText={setContent}
            selectionColor={theme.primary}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Pressable 
          style={[styles.saveButton, { backgroundColor: theme.primary }]} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{initialNote ? 'Update' : 'Save'}</Text>
        </Pressable>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerImage: {
    minHeight: 140,
    width: '100%',
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
  },
  form: {
    padding: 16,
    flex: 1,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 12,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    textAlignVertical: 'top',
    minHeight: 200,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
  saveButton: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
