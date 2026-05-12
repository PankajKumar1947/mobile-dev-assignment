import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Pressable,
  FlatList,
  Switch,
  useWindowDimensions,
  TextStyle
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../context/note-context';
import { useTheme } from '../context/theme-context';
import { NoteCard } from '../components/note-card';
import { NoteEditor } from '../components/note-editor';
import { Note } from '../types/notes';

export default function Index() {
  const { notes } = useNotes();
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const { width } = useWindowDimensions();
  const [search, onSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const isTablet = width > 600;
  const numColumns = isTablet ? 2 : 1;

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditing(true);
  };

  const handleAddNote = () => {
    setEditingNote(undefined);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <NoteEditor
        initialNote={editingNote}
        onCancel={() => {
          setIsEditing(false);
          setEditingNote(undefined);
        }}
      />
    );
  }

  const searchInputStyle = StyleSheet.flatten([
    styles.searchInput,
    {
      backgroundColor: theme.card,
      color: theme.text,
      maxWidth: isTablet ? 400 : '100%',
      alignSelf: isTablet ? 'center' : 'stretch',
    }
  ]) as TextStyle;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.primary }]}>My Notes</Text>
        </View>
        <Switch
          trackColor={{ false: '#3E3E3E', true: theme.primary }}
          thumbColor={isDarkMode ? '#FFF' : '#F4F3F4'}
          onValueChange={toggleTheme}
          value={isDarkMode}
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={searchInputStyle}
          value={search}
          onChangeText={onSearch}
          placeholder="Search..."
          placeholderTextColor={theme.placeholder}
          selectionColor={theme.primary}
        />
      </View>

      <FlatList
        key={numColumns}
        data={filteredNotes}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={{ flex: 1 / numColumns }}>
            <NoteCard note={item} onEdit={handleEditNote} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.placeholder }]}>
              {search ? 'Empty.' : 'No notes.'}
            </Text>
          </View>
        }
      />

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: theme.primary,
            transform: [{ scale: pressed ? 0.9 : 1 }]
          }
        ]}
        onPress={handleAddNote}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  greeting: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    fontWeight: '500',
    width: '100%',
  },
  listContent: {
    paddingBottom: 80,
    paddingTop: 4,
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '300',
  },
});
