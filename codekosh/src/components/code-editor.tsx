import BaseCodeEditor, {
  CodeEditorStyleType,
  CodeEditorSyntaxStyles,
} from '@rivascva/react-native-code-editor';
// @ts-ignore
import SyntaxHighlighter from '@rivascva/react-native-code-editor/lib/commonjs/SyntaxHighlighter';
import React from 'react';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../theme';
import { ProgrammingLanguage } from '../types/snippet';

export interface CodeEditorProps {
  initialValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  language: ProgrammingLanguage;
  readOnly?: boolean;
  autoFocus?: boolean;
  showLineNumbers?: boolean;
  style?: ViewStyle;
  editorStyle?: CodeEditorStyleType;
  label?: string;
  minHeight?: number;
  height?: number;
}

export const CodeEditor = ({
  initialValue = '',
  value,
  onChange,
  language,
  readOnly = false,
  autoFocus = false,
  showLineNumbers = true,
  style,
  editorStyle,
  label,
  minHeight = 250,
  height,
}: CodeEditorProps) => {
  const { colors, typography, borderRadius, spacing, isDark } = useAppTheme();

  const activeValue = value !== undefined ? value : initialValue;

  const resolvedSyntaxStyle = isDark ? CodeEditorSyntaxStyles.atomOneDark : CodeEditorSyntaxStyles.nord;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.text, fontSize: typography.fontSizes.sm, marginBottom: spacing.xs }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.editorWrapper,
          {
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            backgroundColor: colors.codeBackground,
            minHeight,
            height,
          },
        ]}
      >
        {readOnly ? (
          <SyntaxHighlighter
            language={language}
            syntaxStyle={resolvedSyntaxStyle}
            scrollEnabled={true}
            showLineNumbers={showLineNumbers}
            addedStyle={{
              backgroundColor: colors.codeBackground,
              fontSize: 15,
              fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
              highlighterLineHeight: 24,
              padding: 4,
              ...editorStyle,
            }}
          >
            {activeValue}
          </SyntaxHighlighter>
        ) : (
          <BaseCodeEditor
            initialValue={activeValue}
            onChange={onChange}
            language={language as any}
            readOnly={false}
            autoFocus={autoFocus}
            showLineNumbers={showLineNumbers}
            syntaxStyle={resolvedSyntaxStyle}
            style={{
              backgroundColor: colors.codeBackground,
              fontSize: 15,
              fontFamily: Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
              inputColor: '#FFFFFF00',
              inputLineHeight: 20,
              highlighterLineHeight: 20,
              padding: 4,
              ...editorStyle,
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
  },
  editorWrapper: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default CodeEditor;
