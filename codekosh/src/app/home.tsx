import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from '../components/icon-button';
import { Input } from '../components/input';
import { SnippetCard } from '../components/snippet-card';
import { useSnippetContext } from '../context/use-snippet-context';
import { useAppTheme } from '../theme';

export default function HomeScreen() {
  const { colors, spacing, typography } = useAppTheme();
  const { summaries, loading } = useSnippetContext();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const filteredSummaries = useMemo(() => {
    return summaries.filter(summary =>
      summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [summaries, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'CodeKosh',
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/file-manager')}
              style={{ marginRight: 16 }}
              activeOpacity={0.7}
            >
              <Ionicons name="folder-open-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          )
        }}
      />

      <View style={[styles.searchContainer, { paddingHorizontal: spacing.md, paddingTop: spacing.md }]}>
        <Input
          placeholder="Search snippets, languages, or tags..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredSummaries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SnippetCard
              snippet={item}
              onPress={() => router.push({
                pathname: '/snippet-details',
                params: { id: item.id }
              })}
            />
          )}
          contentContainerStyle={[styles.listContent, { padding: spacing.md }]}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: colors.textMuted }}>
                {searchQuery ? 'No snippets match your search.' : 'No snippets found.'}
              </Text>
            </View>
          }
        />
      )}

      <IconButton
        icon="add"
        size={28}
        style={styles.fab}
        onPress={() => router.push('/save-snippet')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    zIndex: 1,
  },
  searchInput: {
    marginBottom: 0,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  listContent: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
});
