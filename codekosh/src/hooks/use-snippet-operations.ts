import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useAlert } from '../context/use-alert-context';
import { Snippet } from '../types/snippet';

const getFileExtension = (language: string): string => {
  switch (language.toLowerCase()) {
    case 'typescript': return 'ts';
    case 'javascript': return 'js';
    case 'python': return 'py';
    case 'go': return 'go';
    case 'rust': return 'rs';
    case 'xml': return 'xml';
    case 'css': return 'css';
    case 'markdown': return 'md';
    default: return 'txt';
  }
};

export const useSnippetOperations = () => {
  const { showAlert } = useAlert();

  const saveCodeFile = async (snippet: Snippet | null) => {
    if (!snippet) return;
    try {
      const folderName = `${snippet.title.replace(/[^a-zA-Z0-9]/g, '_') || 'Unnamed'}_${snippet.id}`;
      const snippetFolder = FileSystem.documentDirectory + 'snippets/' + folderName + '/';

      const dirInfo = await FileSystem.getInfoAsync(snippetFolder);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(snippetFolder, { intermediates: true });
      }

      const fileName = `${snippet.title.replace(/[^a-zA-Z0-9]/g, '_')}.${getFileExtension(snippet.language)}`;
      const fileUri = snippetFolder + fileName;

      await FileSystem.writeAsStringAsync(fileUri, snippet.code);
      showAlert('Success', `Code file saved locally inside the snippet folder as:\n${fileName}\n\nYou can browse it in the File Manager.`);
    } catch (error) {
      console.error('Error saving code file:', error);
      showAlert('Error', 'Failed to save code file locally.');
    }
  };

  const shareCodeFile = async (snippet: Snippet | null) => {
    if (!snippet) return;
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showAlert('Error', 'Sharing is not available on this device.');
        return;
      }

      const tempUri = FileSystem.cacheDirectory + `${snippet.title.replace(/[^a-zA-Z0-9]/g, '_')}.${getFileExtension(snippet.language)}`;
      await FileSystem.writeAsStringAsync(tempUri, snippet.code);

      await Sharing.shareAsync(tempUri);
    } catch (error) {
      console.error('Error sharing code:', error);
      showAlert('Error', 'Failed to share code.');
    }
  };

  return {
    saveCodeFile,
    shareCodeFile,
  };
};
