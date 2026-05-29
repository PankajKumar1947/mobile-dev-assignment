import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { FileItem } from '../types/file';

interface FolderSelectModalProps {
  visible: boolean;
  item: FileItem | null;
  action: 'move' | 'copy';
  folders: string[];
  onClose: () => void;
  onSelectFolder: (folder: string) => void;
}

export const FolderSelectModal: React.FC<FolderSelectModalProps> = ({
  visible,
  item,
  action,
  folders,
  onClose,
  onSelectFolder,
}) => {
  const { colors, typography, borderRadius } = useAppTheme();

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.menuContent,
            { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg },
          ]}
        >
          <View style={[styles.menuHeader, { borderBottomColor: colors.border }]}>
            <Text
              style={[
                styles.menuTitle,
                { color: colors.text, fontSize: typography.fontSizes.md },
              ]}
            >
              {action === 'move' ? 'Move File' : 'Copy File'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: colors.textMuted,
              fontSize: typography.fontSizes.sm,
              paddingHorizontal: 16,
              paddingTop: 12,
            }}
          >
            Select target folder for "{item.name}":
          </Text>

          <View style={{ padding: 16, gap: 12 }}>
            {folders.map((folder) => (
              <TouchableOpacity
                key={folder}
                style={[
                  styles.folderSelectCard,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                  },
                ]}
                onPress={() => onSelectFolder(folder)}
              >
                <Ionicons name="folder" size={24} color={colors.primary} />
                <Text
                  style={[
                    styles.folderSelectText,
                    { color: colors.text, fontSize: typography.fontSizes.sm },
                  ]}
                >
                  {folder}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContent: {
    paddingBottom: 40,
    width: '100%',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 8,
  },
  menuTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  folderSelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  folderSelectText: {
    fontWeight: 'bold',
  },
});
