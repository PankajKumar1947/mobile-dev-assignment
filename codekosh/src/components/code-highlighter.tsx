import React from 'react';
import { View, ScrollView, Text, Platform, ColorValue, TextStyle } from 'react-native';
// @ts-ignore
import Highlighter from 'react-syntax-highlighter';
// @ts-ignore
import * as HLJSSyntaxStyles from 'react-syntax-highlighter/dist/esm/styles/hljs';

type Node = {
  children?: Node[];
  properties?: {
    className: string[];
  };
  tagName?: string;
  type: string;
  value?: string;
};

type StyleSheet = {
  [key: string]: TextStyle & {
    background?: string;
  };
};

type RendererParams = {
  rows: Node[];
  stylesheet: StyleSheet;
};

export type SyntaxHighlighterStyleType = {
  fontFamily?: string;
  fontSize?: number;
  backgroundColor?: ColorValue;
  padding?: number;
  lineNumbersColor?: ColorValue;
  lineNumbersBackgroundColor?: ColorValue;
  highlighterLineHeight?: number;
  highlighterColor?: ColorValue;
};

export const SyntaxHighlighterSyntaxStyles = HLJSSyntaxStyles;

export interface CodeHighlighterProps {
  children: string;
  language: string;
  syntaxStyle?: any;
  addedStyle?: SyntaxHighlighterStyleType;
  scrollEnabled?: boolean;
  showLineNumbers?: boolean;
}

export const CodeHighlighter = React.forwardRef<ScrollView, CodeHighlighterProps>((props, ref) => {
  const {
    children,
    language,
    syntaxStyle = SyntaxHighlighterSyntaxStyles.atomOneDark,
    addedStyle,
    scrollEnabled = true,
    showLineNumbers = false,
    ...highlighterProps
  } = props;

  const {
    fontFamily = Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
    fontSize = 16,
    backgroundColor = undefined,
    padding = 16,
    lineNumbersColor = 'rgba(127, 127, 127, 0.9)',
    lineNumbersBackgroundColor = undefined,
    highlighterLineHeight = undefined,
    highlighterColor = undefined,
  } = addedStyle || {};

  const lineNumbersPadding = showLineNumbers ? 1.75 * fontSize : undefined;
  const lineNumbersFontSize = 0.7 * fontSize;

  let codeText = children;
  if (!codeText.endsWith('\n\n')) {
    codeText += '\n\n';
  }

  const cleanStyle = (style: TextStyle) => {
    const clean: TextStyle = {
      ...style,
      display: undefined,
    };
    return clean;
  };

  const stylesheet: StyleSheet = Object.fromEntries(
    Object.entries(syntaxStyle as StyleSheet).map(([className, style]) => [
      className,
      cleanStyle(style),
    ])
  );

  const renderLineNumbersBackground = () => (
    <View
      style={{
        position: 'absolute',
        top: -padding,
        left: 0,
        bottom: 0,
        width: lineNumbersPadding ? lineNumbersPadding - 5 : 0,
        backgroundColor: lineNumbersBackgroundColor,
      }}
    />
  );

  const renderNode = (nodes: Node[], key = '0') =>
    nodes.reduce<React.ReactNode[]>((acc, node, index) => {
      if (node.children) {
        const textElement = (
          <Text
            key={`${key}.${index}`}
            style={[
              {
                color: highlighterColor || stylesheet.hljs.color,
              },
              ...(node.properties?.className || []).map((c) => stylesheet[c]),
              {
                lineHeight: highlighterLineHeight,
                fontFamily,
                fontSize,
                paddingLeft: lineNumbersPadding ?? padding,
              },
            ]}
          >
            {renderNode(node.children, `${key}.${index}`)}
          </Text>
        );

        const lineNumberElement =
          key !== '0' || index >= nodes.length - 2 ? undefined : (
            <Text
              key={`$line.${index}`}
              style={{
                position: 'absolute',
                top: 5,
                bottom: 0,
                paddingHorizontal: nodes.length - 2 < 100 ? 5 : 0,
                textAlign: 'center',
                color: lineNumbersColor,
                fontFamily,
                fontSize: lineNumbersFontSize,
                width: lineNumbersPadding ? lineNumbersPadding - 5 : 0,
              }}
            >
              {index + 1}
            </Text>
          );

        acc.push(
          showLineNumbers && lineNumberElement ? (
            <View key={`view.line.${index}`}>
              {lineNumberElement}
              {textElement}
            </View>
          ) : (
            textElement
          )
        );
      }

      if (node.value) {
        node.value = node.value.replace('\n', '');
        node.value = node.value.length ? node.value : ' ';
        acc.push(node.value);
      }

      return acc;
    }, []);

  const nativeRenderer = ({ rows }: RendererParams) => {
    return (
      <ScrollView
        style={[
          stylesheet.hljs as any,
          {
            width: '100%',
            height: '100%',
            backgroundColor: backgroundColor || stylesheet.hljs.background,
            padding: 0,
            paddingTop: padding,
            paddingRight: padding,
            paddingBottom: padding,
          },
        ]}
        ref={ref}
        scrollEnabled={scrollEnabled}
      >
        {showLineNumbers && renderLineNumbersBackground()}
        <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ minWidth: '100%' }}>
          <View style={{ flexDirection: 'column' }}>
            {renderNode(rows)}
          </View>
        </ScrollView>
      </ScrollView>
    );
  };

  return (
    <Highlighter
      {...highlighterProps}
      children={codeText}
      language={language}
      customStyle={{
        padding: 0,
      }}
      CodeTag={View}
      PreTag={View}
      renderer={nativeRenderer}
      style={stylesheet}
    />
  );
});

export default CodeHighlighter;
