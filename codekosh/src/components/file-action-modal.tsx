import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { FileItem } from '../types/file';

interface FileActionModalProps {
  visible: boolean;
  item: FileItem | null;
  onClose: () => void;
  onPreview: () => void;
  onMove: () => void;
  onCopy: () => void;
  onShare: () => void;
  onDelete: () => void;
}

export const FileActionModal: React.FC<FileActionModalProps> = ({
  visible,
  item,
  onClose,
  onPreview,
  onMove,
  onCopy,
  onShare,
  onDelete,
}) => {
  const { colors, typography, borderRadius } = useAppTheme();

  if (!item) return null;

  const isImage = 
    item.name.toLowerCase().endsWith('.jpg') || 
    item.name.toLowerCase().endsWith('.png') || 
    item.name.toLowerCase().endsWith('.jpeg');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.menuContent,
            { backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg },
          ]}
        >
          <View style={[styles.menuHeader, { borderBottomColor: colors.border }]}>
            <Ionicons
              name={item.isDirectory ? 'folder' : isImage ? 'image' : 'document-text'}
              size={24}
              color={item.isDirectory ? colors.primary : colors.secondary}
            />
            <Text
              style={[
                styles.menuTitle,
                { color: colors.text, fontSize: typography.fontSizes.md },
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>

          {!item.isDirectory && (
            <>
              <TouchableOpacity style={styles.menuItem} onPress={onPreview}>
                <Ionicons name="eye-outline" size={20} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  Preview File
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={onMove}>
                <Ionicons name="arrow-redo-outline" size={20} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  Move File
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={onCopy}>
                <Ionicons name="copy-outline" size={20} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  Copy File
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={onShare}>
                <Ionicons name="share-social-outline" size={20} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  Share File
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={[styles.menuItem, styles.deleteItem]}
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
            <Text
              style={[
                styles.menuItemText,
                { color: colors.error, fontWeight: 'bold' },
              ]}
            >
              {item.isDirectory ? 'Delete Folder' : 'Delete File'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
  },
  deleteItem: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});
