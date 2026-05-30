import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { Input } from '../components/input';
import { SnippetCard } from '../components/snippet-card';
import { useSnippetContext } from '../context/use-snippet-context';
import { useAppTheme } from '../theme';

export default function FavouritesScreen() {
  const { colors, spacing } = useAppTheme();
  const { summaries, loading } = useSnippetContext();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const favouriteSummaries = useMemo(() => {
    return summaries.filter(summary => summary.isFavorite);
  }, [summaries]);

  const filteredSummaries = useMemo(() => {
    return favouriteSummaries.filter(summary =>
      summary.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [favouriteSummaries, searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Favourite Snippets',
          headerShown: true,
        }}
      />

      <View style={[styles.searchContainer, { paddingHorizontal: spacing.md, paddingTop: spacing.md }]}>
        <Input
          placeholder="Search favorites..."
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
                {searchQuery 
                  ? 'No favorite snippets match your search.' 
                  : 'You haven\'t added any favorites yet.'}
              </Text>
            </View>
          }
        />
      )}
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
    paddingBottom: 20,
  },
});
