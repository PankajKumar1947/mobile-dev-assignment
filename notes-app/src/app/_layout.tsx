import { Stack } from "expo-router";
import { NoteProvider } from "../context/note-context";
import { ThemeProvider } from "../context/theme-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NoteProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </NoteProvider>
    </ThemeProvider>
  );
}
