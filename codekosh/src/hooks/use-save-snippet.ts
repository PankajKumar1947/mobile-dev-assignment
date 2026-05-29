import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAlert } from '../context/use-alert-context';
import { useSnippetContext } from '../context/use-snippet-context';
import { ProgrammingLanguage } from '../types/snippet';

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
  const [screenshotUri, setScreenshotUri] = useState<string | undefined>(undefined);
  const [tempScreenshotUri, setTempScreenshotUri] = useState<string | undefined>(undefined);
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
          setScreenshotUri(snippet.screenshotUri);
        }
        setLoading(false);
      };
      fetchSnippet();
    }
  }, [id, isEditing, getSnippetById]);

  const pickScreenshot = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setTempScreenshotUri(result.assets[0].uri);
        setScreenshotUri(undefined);
      }
    } catch (error) {
      console.error('Error picking screenshot:', error);
      showAlert('Error', 'Failed to pick image.');
    }
  };

  const removeScreenshot = () => {
    setScreenshotUri(undefined);
    setTempScreenshotUri(undefined);
  };

  const save = async () => {
    if (!title || !code) return;

    setLoading(true);
    try {
      const folderName = `${title.replace(/[^a-zA-Z0-9]/g, '_') || 'Unnamed'}_${snippetId}`;
      const folderPath = FileSystem.documentDirectory + 'snippets/' + folderName + '/';

      if (isEditing && oldTitle && title !== oldTitle) {
        const oldFolderName = `${oldTitle.replace(/[^a-zA-Z0-9]/g, '_') || 'Unnamed'}_${snippetId}`;
        const oldFolderPath = FileSystem.documentDirectory + 'snippets/' + oldFolderName + '/';
        const oldDirInfo = await FileSystem.getInfoAsync(oldFolderPath);
        if (oldDirInfo.exists) {
          try {
            await FileSystem.moveAsync({ from: oldFolderPath, to: folderPath });
            if (screenshotUri && screenshotUri.startsWith(oldFolderPath)) {
              const fileName = screenshotUri.substring(screenshotUri.lastIndexOf('/') + 1);
              setScreenshotUri(folderPath + fileName);
            }
          } catch (moveErr) {
            console.error('Error renaming folder:', moveErr);
          }
        }
      }

      const dirInfo = await FileSystem.getInfoAsync(folderPath);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
      }

      let finalScreenshotUri = screenshotUri;

      if (tempScreenshotUri) {
        if (screenshotUri) {
          try {
            await FileSystem.deleteAsync(screenshotUri, { idempotent: true });
          } catch (e) { }
        }
        const fileName = `screenshot_${Date.now()}.jpg`;
        const destUri = folderPath + fileName;
        await FileSystem.copyAsync({ from: tempScreenshotUri, to: destUri });
        finalScreenshotUri = destUri;
      } else if (screenshotUri === undefined && !tempScreenshotUri) {
        try {
          const files = await FileSystem.readDirectoryAsync(folderPath);
          for (const file of files) {
            if (file.startsWith('screenshot_')) {
              await FileSystem.deleteAsync(folderPath + file, { idempotent: true });
            }
          }
        } catch (e) { }
        finalScreenshotUri = undefined;
      }

      const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t !== '');

      if (isEditing) {
        await updateSnippet(snippetId, {
          title,
          description,
          language,
          code,
          tags: tagsArray,
          screenshotUri: finalScreenshotUri,
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
          screenshotUri: finalScreenshotUri,
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
    screenshotUri,
    tempScreenshotUri,
    loading,
    pickScreenshot,
    removeScreenshot,
    save,
  };
};
