import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from './badge';
import { Card } from './card';
import { useAppTheme } from '../theme';
import { SnippetSummary } from '../types/snippet';

interface SnippetCardProps {
  snippet: SnippetSummary;
  onPress?: () => void;
}

export const SnippetCard = ({ snippet, onPress }: SnippetCardProps) => {
  const { colors, typography } = useAppTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text
            style={[styles.title, { color: colors.text, fontSize: typography.fontSizes.md }]}
            numberOfLines={1}
          >
            {snippet.title}
          </Text>
          <Badge label={snippet.language} variant="primary" />
        </View>

        {snippet.description && (
          <Text
            style={[styles.description, { color: colors.textMuted, fontSize: typography.fontSizes.sm }]}
            numberOfLines={2}
          >
            {snippet.description}
          </Text>
        )}

        <View style={styles.tagList}>
          {snippet.tags.map(tag => (
            <Badge key={tag} label={tag} />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.date, { color: colors.textMuted, fontSize: typography.fontSizes.xs }]}>
            {new Date(snippet.createdAt).toLocaleDateString()}
          </Text>
          {snippet.isFavorite && (
            <Ionicons name="star" size={16} color={colors.favorite} />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontStyle: 'italic',
  },
});
