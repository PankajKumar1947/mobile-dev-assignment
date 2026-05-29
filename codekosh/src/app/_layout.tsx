import { ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { SnippetProvider } from "../context/use-snippet-context";
import { AlertProvider } from "../context/use-alert-context";
import { AppDarkTheme, AppLightTheme } from "../theme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SnippetProvider>
      <AlertProvider>
        <ThemeProvider value={colorScheme === 'dark' ? AppDarkTheme : AppLightTheme}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? AppDarkTheme.colors.card : AppLightTheme.colors.card,
              },
              headerTintColor: colorScheme === 'dark' ? AppDarkTheme.colors.text : AppLightTheme.colors.text,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </AlertProvider>
    </SnippetProvider>
  );
}
