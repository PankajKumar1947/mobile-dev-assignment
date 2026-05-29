import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { FileItem } from '../types/file';

interface FilePreviewModalProps {
  visible: boolean;
  item: FileItem | null;
  content: string;
  loading: boolean;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  visible,
  item,
  content,
  loading,
  onClose,
}) => {
  const { colors, spacing, typography, borderRadius } = useAppTheme();

  if (!item) return null;

  const isImage = 
    item.name.toLowerCase().endsWith('.jpg') || 
    item.name.toLowerCase().endsWith('.png') || 
    item.name.toLowerCase().endsWith('.jpeg');

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.previewContainer, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.previewHeader,
            { borderBottomColor: colors.border, backgroundColor: colors.surface },
          ]}
        >
          <Text
            style={[
              styles.previewTitle,
              { color: colors.text, fontSize: typography.fontSizes.md },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={[styles.scrollContent, { padding: spacing.md }]}>
            {isImage ? (
              <Image
                source={{ uri: item.uri }}
                style={[
                  styles.previewImage,
                  { borderRadius: borderRadius.md, borderColor: colors.border },
                ]}
                resizeMode="contain"
              />
            ) : (
              <View
                style={[
                  styles.previewCodeBox,
                  {
                    backgroundColor: colors.codeBackground || colors.surface,
                    borderColor: colors.border,
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.previewCodeText,
                    {
                      color: colors.text,
                      fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
                      fontSize: 13,
                    },
                  ]}
                >
                  {content}
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  previewTitle: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  previewImage: {
    width: '100%',
    height: 450,
    borderWidth: 1,
    marginTop: 10,
  },
  previewCodeBox: {
    borderWidth: 1,
    padding: 16,
    marginTop: 10,
    minHeight: 300,
  },
  previewCodeText: {
    lineHeight: 20,
  },
});
