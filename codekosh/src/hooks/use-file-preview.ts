import { useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useAlert } from '../context/use-alert-context';
import { FileItem } from '../types/file';

export const useFilePreview = () => {
  const { showAlert } = useAlert();
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  const handlePreviewFile = async (item: FileItem) => {
    const isPdf = item.name.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      try {
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
          showAlert('Error', 'Previewing PDF is not available on this device.');
          return;
        }
        await Sharing.shareAsync(item.uri);
      } catch (error) {
        console.error('Error previewing PDF:', error);
        showAlert('Error', 'Failed to preview PDF.');
      }
      return;
    }

    setSelectedItem(item);
    setPreviewVisible(true);
    setPreviewLoading(true);

    const isImage = item.name.toLowerCase().endsWith('.jpg') || 
                    item.name.toLowerCase().endsWith('.png') || 
                    item.name.toLowerCase().endsWith('.jpeg');

    if (isImage) {
      setPreviewContent('');
      setPreviewLoading(false);
      return;
    }

    try {
      const content = await FileSystem.readAsStringAsync(item.uri);
      setPreviewContent(content);
    } catch (error) {
      console.error('Error reading file for preview:', error);
      setPreviewContent('Failed to load file contents.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewVisible(false);
    setSelectedItem(null);
  };

  return {
    selectedItem,
    setSelectedItem,
    previewVisible,
    setPreviewVisible,
    previewContent,
    setPreviewContent,
    previewLoading,
    setPreviewLoading,
    handlePreviewFile,
    closePreview,
  };
};
