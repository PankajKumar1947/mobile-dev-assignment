import React, { useState } from 'react';
import { Text, StyleSheet, Pressable, Modal, View, Alert, useWindowDimensions } from 'react-native';
import { useNotes } from '../context/note-context';
import { useTheme } from '../context/theme-context';
import { Note } from '../types/notes';
import { formatDate, formatRelativeTime } from '../utils/date-formatter';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const { deleteNote } = useNotes();
  const { theme, isDarkMode } = useTheme();
  const { width } = useWindowDimensions();
  const [showContent, setShowContent] = useState<boolean>(false);

  const isTablet = width > 600;

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => {
            deleteNote(note.id);
            setShowContent(false);
          } 
        }
      ]
    );
  };

  // Using StyleSheet.flatten for dynamic card styling
  const cardStyle = StyleSheet.flatten([
    styles.card,
    { 
      backgroundColor: theme.card,
      marginHorizontal: isTablet ? 8 : 16, // Less side margin on tablet grid
    }
  ]);

  return (
    <>
      <Pressable 
        onPress={() => setShowContent(true)} 
        style={({ pressed }) => [
          cardStyle,
          { opacity: pressed ? 0.9 : 1 }
        ]}
      >
        <View style={styles.cardHeader}>
          <Text 
            style={[styles.title, { color: theme.text, fontSize: isTablet ? 18 : 16 }]} 
            numberOfLines={1}
          >
            {note.title}
          </Text>
          <View style={[styles.indicator, { backgroundColor: theme.primary }]} />
        </View>
        
        <Text 
          style={[styles.snippet, { color: theme.placeholder, fontSize: isTablet ? 14 : 13 }]} 
          numberOfLines={1}
        >
          {note.content}
        </Text>
        
        <Text style={[styles.date, { color: theme.placeholder }]}>
          {formatRelativeTime(note.date)}
        </Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showContent}
        onRequestClose={() => setShowContent(false)}
      >
        <View style={[
          styles.modalOverlay, 
          { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)' }
        ]}>
          <View style={[
            styles.modalContainer, 
            { 
              backgroundColor: isDarkMode ? theme.card : theme.background,
              borderColor: isDarkMode ? theme.border : 'transparent',
              borderWidth: isDarkMode ? 1 : 0,
              maxWidth: isTablet ? 500 : '100%',
              alignSelf: 'center',
              width: '100%',
            }
          ]}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setShowContent(false)} style={styles.backButton}>
                <Text style={{ color: theme.primary, fontSize: 14, fontWeight: '600' }}>← Close</Text>
              </Pressable>
              
              <View style={styles.headerActions}>
                <Pressable onPress={() => { setShowContent(false); onEdit(note); }} style={styles.actionButton}>
                  <Text style={{ color: theme.primary, fontSize: 14, fontWeight: '600' }}>Edit</Text>
                </Pressable>
                <Pressable onPress={handleDelete} style={styles.actionButton}>
                  <Text style={{ color: theme.error, fontSize: 14, fontWeight: '600' }}>Delete</Text>
                </Pressable>
              </View>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>{note.title}</Text>
              <Text style={[styles.modalDate, { color: theme.placeholder }]}>
                {formatDate(note.date)}
              </Text>
              <Text style={[styles.modalContent, { color: theme.text }]}>{note.content}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontWeight: '700',
    flex: 1,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8,
  },
  snippet: {
    lineHeight: 18,
    marginBottom: 6,
  },
  date: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    paddingVertical: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
    paddingVertical: 8,
  },
  modalBody: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalDate: {
    fontSize: 12,
    marginBottom: 16,
  },
  modalContent: {
    fontSize: 15,
    lineHeight: 22,
  },
});
