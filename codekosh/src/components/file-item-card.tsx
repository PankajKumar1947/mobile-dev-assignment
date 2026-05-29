import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { FileItem } from '../types/file';

interface FileItemCardProps {
  item: FileItem;
  onPress: (item: FileItem) => void;
  onLongPress?: (item: FileItem) => void;
}

export const FileItemCard: React.FC<FileItemCardProps> = ({ item, onPress, onLongPress }) => {
  const { colors, spacing, typography, borderRadius } = useAppTheme();

  const isImage = 
    item.name.toLowerCase().endsWith('.jpg') || 
    item.name.toLowerCase().endsWith('.png') || 
    item.name.toLowerCase().endsWith('.jpeg');

  const getIconName = () => {
    if (item.isDirectory) return 'folder';
    if (isImage) return 'image';
    return 'document-text';
  };

  return (
    <TouchableOpacity
      style={[
        styles.itemCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
        },
      ]}
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress && onLongPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <Ionicons
          name={getIconName()}
          size={28}
          color={item.isDirectory ? colors.primary : colors.secondary}
        />
        <View style={styles.itemInfo}>
          <Text
            style={[
              styles.itemName,
              { color: colors.text, fontSize: typography.fontSizes.sm },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          {!item.isDirectory && item.size !== undefined ? (
            <Text
              style={{
                color: colors.textMuted,
                fontSize: typography.fontSizes.xs,
                marginTop: 2,
              }}
            >
              {(item.size / 1024).toFixed(1)} KB •{' '}
              {item.modificationTime
                ? new Date(item.modificationTime * 1000).toLocaleDateString()
                : ''}
            </Text>
          ) : item.isDirectory ? (
            <Text
              style={{
                color: colors.textMuted,
                fontSize: typography.fontSizes.xs,
                marginTop: 2,
              }}
            >
              Folder
            </Text>
          ) : null}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  itemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
  },
});
