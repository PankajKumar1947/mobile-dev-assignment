import Constants from 'expo-constants';

export const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return 'http://localhost:8081';
  const ip = hostUri.split(':')[0];
  return `http://${ip}:8081`;
};
