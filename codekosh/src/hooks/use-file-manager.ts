import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAlert } from '../context/use-alert-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { FileItem } from '../types/file';
import { useFilePreview } from './use-file-preview';

export const useFileManager = () => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const rootDir = (FileSystem.documentDirectory || '') + 'snippets/';

  const [currentPath, setCurrentPath] = useState<string>(rootDir);
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState<string[]>([]);

  const {
    selectedItem,
    setSelectedItem,
    previewVisible,
    setPreviewVisible,
    previewContent,
    previewLoading,
    handlePreviewFile: hookHandlePreviewFile,
  } = useFilePreview();

  const [itemMenuVisible, setItemMenuVisible] = useState(false);
  const [moveCopyVisible, setMoveCopyVisible] = useState(false);
  const [moveCopyAction, setMoveCopyAction] = useState<'move' | 'copy'>('move');

  const loadTargetFolders = useCallback(async () => {
    try {
      const fileNames = await FileSystem.readDirectoryAsync(rootDir);
      const folderNames: string[] = [];
      for (const name of fileNames) {
        const uri = rootDir + name;
        const info = await FileSystem.getInfoAsync(uri);
        if (info.isDirectory) {
          folderNames.push(name);
        }
      }
      setFolders(folderNames);
    } catch (error) {
      console.error('Error loading folders for move/copy:', error);
    }
  }, [rootDir]);

  const loadDirectory = useCallback(async (path: string) => {
    setLoading(true);
    try {
      const rootInfo = await FileSystem.getInfoAsync(rootDir);
      if (!rootInfo.exists) {
        await FileSystem.makeDirectoryAsync(rootDir, { intermediates: true });
      }

      const fileNames = await FileSystem.readDirectoryAsync(path);
      const fileItems: FileItem[] = [];

      for (const name of fileNames) {
        const uri = path + (path.endsWith('/') ? '' : '/') + name;
        const info = await FileSystem.getInfoAsync(uri);

        fileItems.push({
          name,
          uri,
          isDirectory: info.isDirectory,
          size: info.exists && !info.isDirectory ? info.size : undefined,
          modificationTime: info.exists ? info.modificationTime : undefined,
        });
      }

      fileItems.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      setItems(fileItems);
    } catch (error) {
      console.error('Error loading directory:', error);
      showAlert('Error', 'Failed to load directory contents.');
    } finally {
      setLoading(false);
    }
  }, [rootDir]);

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath, loadDirectory]);

  const handleGoBack = () => {
    if (currentPath === rootDir) return;

    const pathWithoutTrailing = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
    const lastSlashIdx = pathWithoutTrailing.lastIndexOf('/');

    if (lastSlashIdx !== -1) {
      const parentPath = pathWithoutTrailing.substring(0, lastSlashIdx + 1);
      setCurrentPath(parentPath);
    } else {
      setCurrentPath(rootDir);
    }
  };

  const getHeaderTitle = () => {
    if (currentPath === rootDir) {
      return 'File Manager';
    }
    const pathWithoutTrailing = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;
    const lastSlashIdx = pathWithoutTrailing.lastIndexOf('/');
    if (lastSlashIdx !== -1) {
      const folderName = pathWithoutTrailing.substring(lastSlashIdx + 1);
      const lastUnderscoreIdx = folderName.lastIndexOf('_');
      const titlePart = lastUnderscoreIdx !== -1 ? folderName.substring(0, lastUnderscoreIdx) : folderName;
      return titlePart.replace(/_/g, ' ');
    }
    return 'File Manager';
  };

  const handleHeaderBack = () => {
    if (currentPath !== rootDir) {
      handleGoBack();
    } else {
      router.back();
    }
  };

  const handleItemPress = (fileItem: FileItem) => {
    if (fileItem.isDirectory) {
      setCurrentPath(fileItem.uri + '/');
    } else {
      setSelectedItem(fileItem);
      setItemMenuVisible(true);
    }
  };

  const handleItemLongPress = (fileItem: FileItem) => {
    setSelectedItem(fileItem);
    setItemMenuVisible(true);
  };

  const handleDeleteItem = (item: FileItem) => {
    const isDir = item.isDirectory;
    showAlert(
      isDir ? 'Delete Folder' : 'Delete Item',
      isDir
        ? `Are you sure you want to delete the folder "${item.name}" and all its contents? This action cannot be undone.`
        : `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(item.uri, { idempotent: true });
              setItemMenuVisible(false);
              setSelectedItem(null);
              loadDirectory(currentPath);
            } catch (error) {
              console.error(isDir ? 'Error deleting folder:' : 'Error deleting file:', error);
              showAlert('Error', isDir ? 'Failed to delete folder.' : 'Failed to delete file.');
            }
          }
        }
      ]
    );
  };

  const handleShareFile = async (item: FileItem) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showAlert('Error', 'Sharing is not available on this device.');
        return;
      }
      setItemMenuVisible(false);
      await Sharing.shareAsync(item.uri);
    } catch (error) {
      console.error('Error sharing file:', error);
      showAlert('Error', 'Failed to share file.');
    }
  };

  const handlePreviewFile = async (item: FileItem) => {
    setItemMenuVisible(false);
    await hookHandlePreviewFile(item);
  };

  const handleMoveCopySelect = async (action: 'move' | 'copy') => {
    setMoveCopyAction(action);
    setItemMenuVisible(false);
    await loadTargetFolders();
    setMoveCopyVisible(true);
  };

  const handleExecuteMoveCopy = async (targetFolder: string) => {
    if (!selectedItem) return;

    try {
      const destUri = rootDir + targetFolder + '/' + selectedItem.name;

      if (selectedItem.uri === destUri) {
        showAlert('Info', 'Source and target path are the same.');
        setMoveCopyVisible(false);
        setSelectedItem(null);
        return;
      }

      if (moveCopyAction === 'move') {
        await FileSystem.moveAsync({
          from: selectedItem.uri,
          to: destUri,
        });
        showAlert('Success', `Moved "${selectedItem.name}" to "${targetFolder}"`);
      } else {
        await FileSystem.copyAsync({
          from: selectedItem.uri,
          to: destUri,
        });
        showAlert('Success', `Copied "${selectedItem.name}" to "${targetFolder}"`);
      }

      setMoveCopyVisible(false);
      setSelectedItem(null);
      loadDirectory(currentPath);
    } catch (error) {
      console.error(`Error during file ${moveCopyAction}:`, error);
      showAlert('Error', `Failed to ${moveCopyAction} file.`);
    }
  };

  return {
    rootDir,
    currentPath,
    items,
    loading,
    folders,
    selectedItem,
    setSelectedItem,
    itemMenuVisible,
    setItemMenuVisible,
    previewVisible,
    setPreviewVisible,
    previewContent,
    previewLoading,
    moveCopyVisible,
    setMoveCopyVisible,
    moveCopyAction,
    loadDirectory,
    handleGoBack,
    getHeaderTitle,
    handleHeaderBack,
    handleItemPress,
    handleItemLongPress,
    handleDeleteItem,
    handleShareFile,
    handlePreviewFile,
    handleMoveCopySelect,
    handleExecuteMoveCopy,
  };
};
