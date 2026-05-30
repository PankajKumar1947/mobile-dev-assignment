import * as FileSystem from 'expo-file-system/legacy';
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAlert } from '../context/use-alert-context';
import { useSnippetContext } from '../context/use-snippet-context';
import { ProgrammingLanguage, AttachedFile } from '../types/snippet';

export const useSaveSnippet = () => {
  const { createSnippet, updateSnippet, getSnippetById } = useSnippetContext();
  const { showAlert } = useAlert();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const isEditing = !!id;

  const [snippetId] = useState(() => id || Math.random().toString(36).substr(2, 9));
  const [title, setTitle] = useState('');
  const [oldTitle, setOldTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<ProgrammingLanguage>('typescript');
  const [code, setCode] = useState('');
  const [tags, setTags] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      const fetchSnippet = async () => {
        const snippet = await getSnippetById(id as string);
        if (snippet) {
          setTitle(snippet.title);
          setOldTitle(snippet.title);
          setDescription(snippet.description || '');
          setLanguage(snippet.language);
          setCode(snippet.code);
          setTags(snippet.tags.join(', '));
          setAttachedFiles(snippet.attachedFiles || []);
        }
        setLoading(false);
      };
      fetchSnippet();
    }
  }, [id, isEditing, getSnippetById]);

  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newFiles: AttachedFile[] = result.assets.map(asset => ({
          name: asset.name,
          uri: asset.uri,
          type: asset.mimeType || undefined,
          size: asset.size || undefined,
        }));
        setAttachedFiles(prev => [...prev, ...newFiles]);
      }
    } catch (error) {
      console.error('Error picking files:', error);
      showAlert('Error', 'Failed to pick files.');
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    if (!title || !code) return;

    setLoading(true);
    try {
      const folderName = `${title.replace(/[^a-zA-Z0-9]/g, '_') || 'Unnamed'}_${snippetId}`;
      const folderPath = FileSystem.documentDirectory + 'snippets/' + folderName + '/';

      let currentAttachedFiles = [...attachedFiles];

      if (isEditing && oldTitle && title !== oldTitle) {
        const oldFolderName = `${oldTitle.replace(/[^a-zA-Z0-9]/g, '_') || 'Unnamed'}_${snippetId}`;
        const oldFolderPath = FileSystem.documentDirectory + 'snippets/' + oldFolderName + '/';
        const oldDirInfo = await FileSystem.getInfoAsync(oldFolderPath);
        if (oldDirInfo.exists) {
          try {
            await FileSystem.moveAsync({ from: oldFolderPath, to: folderPath });
            currentAttachedFiles = currentAttachedFiles.map(file => {
              if (file.uri.startsWith(oldFolderPath)) {
                const fileName = file.uri.substring(file.uri.lastIndexOf('/') + 1);
                return { ...file, uri: folderPath + fileName };
              }
              return file;
            });
          } catch (moveErr) {
            console.error('Error renaming folder:', moveErr);
          }
        }
      }

      const dirInfo = await FileSystem.getInfoAsync(folderPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
      }

      // Handle copy and cleanup of attachedFiles
      const finalAttachedFiles: AttachedFile[] = [];
      for (const file of currentAttachedFiles) {
        if (file.uri.startsWith(folderPath)) {
          // Already stored in snippet folder
          finalAttachedFiles.push(file);
        } else {
          // Temporary/cached file, copy to snippet folder
          const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const destUri = `${folderPath}${Date.now()}_${safeName}`;
          await FileSystem.copyAsync({ from: file.uri, to: destUri });
          finalAttachedFiles.push({
            name: file.name,
            uri: destUri,
            type: file.type,
            size: file.size,
          });
        }
      }

      // Cleanup files no longer attached
      try {
        const filesInDir = await FileSystem.readDirectoryAsync(folderPath);
        const activeUris = new Set([
          ...finalAttachedFiles.map(f => f.uri),
        ]);
        for (const filename of filesInDir) {
          const fullUri = folderPath + filename;
          if (!activeUris.has(fullUri)) {
            await FileSystem.deleteAsync(fullUri, { idempotent: true });
          }
        }
      } catch (cleanupErr) {
        console.error('Error cleaning up files in snippet directory:', cleanupErr);
      }

      const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t !== '');

      if (isEditing) {
        await updateSnippet(snippetId, {
          title,
          description,
          language,
          code,
          tags: tagsArray,
          attachedFiles: finalAttachedFiles,
        });
      } else {
        await createSnippet({
          id: snippetId,
          title,
          description,
          language,
          code,
          tags: tagsArray,
          isFavorite: false,
          attachedFiles: finalAttachedFiles,
        });
      }

      router.back();
    } catch (error) {
      console.error('Error saving snippet:', error);
      showAlert('Error', 'Failed to save snippet.');
    } finally {
      setLoading(false);
    }
  };

  return {
    isEditing,
    snippetId,
    title,
    setTitle,
    description,
    setDescription,
    language,
    setLanguage,
    code,
    setCode,
    tags,
    setTags,
    attachedFiles,
    loading,
    pickFiles,
    removeFile,
    save,
  };
};
