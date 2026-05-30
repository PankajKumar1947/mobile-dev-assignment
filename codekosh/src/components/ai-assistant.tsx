import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { Snippet } from '../types/snippet';
import Markdown from 'react-native-markdown-display';
import { useAiAssistant } from '../hooks/use-ai-assistant';

interface AiAssistantProps {
  visible: boolean;
  onClose: () => void;
  snippet: Snippet | null;
}

export const AiAssistant = ({ visible, onClose, snippet }: AiAssistantProps) => {
  const { colors } = useAppTheme();
  const { chatMessages, isTyping, sendMessage } = useAiAssistant(snippet, visible);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.botOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.botBackdrop} />
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.botContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
        >
          {/* Header */}
          <View style={[styles.botHeader, { borderBottomColor: colors.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="chatbubble-ellipses" size={24} color={colors.primary} />
              <Text style={[styles.botTitle, { color: colors.text }]}>CodeKosh AI Assistant</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Chat Messages */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            {chatMessages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.msgBubble,
                  msg.sender === 'user' ? [styles.msgUser, { backgroundColor: colors.primary }] : [styles.msgBot, { backgroundColor: colors.border }],
                ]}
              >
                {msg.sender === 'user' ? (
                  <Text style={[styles.msgText, { color: colors.background }]}>
                    {msg.text}
                  </Text>
                ) : (
                  <Markdown
                    style={{
                      body: { color: colors.text, fontSize: 14, lineHeight: 20 },
                      code_inline: {
                        fontFamily: 'monospace',
                        backgroundColor: 'rgba(128, 128, 128, 0.15)',
                        paddingHorizontal: 4,
                        borderRadius: 4,
                        color: colors.text,
                      },
                      code_block: {
                        fontFamily: 'monospace',
                        backgroundColor: 'rgba(0, 0, 0, 0.15)',
                        padding: 8,
                        borderRadius: 8,
                        color: colors.text,
                        marginVertical: 4,
                      },
                      fence: {
                        fontFamily: 'monospace',
                        backgroundColor: 'rgba(0, 0, 0, 0.15)',
                        padding: 8,
                        borderRadius: 8,
                        color: colors.text,
                        marginVertical: 4,
                      },
                      heading1: { fontWeight: 'bold', color: colors.text, marginVertical: 4 },
                      heading2: { fontWeight: 'bold', color: colors.text, marginVertical: 4 },
                      heading3: { fontWeight: 'bold', color: colors.text, marginVertical: 4 },
                      heading4: { fontWeight: 'bold', color: colors.text, marginVertical: 4 },
                      bullet_list: { color: colors.text },
                      ordered_list: { color: colors.text },
                    }}
                  >
                    {msg.text}
                  </Markdown>
                )}
              </View>
            ))}
            {isTyping && (
              <View style={[styles.msgBubble, styles.msgBot, { backgroundColor: colors.border }]}>
                <Text style={[styles.msgText, { color: colors.text, fontStyle: 'italic' }]}>
                  AI is thinking...
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Options & Input Footer */}
          <View style={[styles.footerContainer, { borderTopColor: colors.border }]}>
            {/* Quick Options */}
            <View style={styles.botOptions}>
              <TouchableOpacity style={[styles.optionBtn, { borderColor: colors.primary }]} onPress={() => sendMessage('Explain Code')}>
                <Text style={[styles.optionBtnText, { color: colors.primary }]}>Explain</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.optionBtn, { borderColor: colors.primary }]} onPress={() => sendMessage('Optimize Code')}>
                <Text style={[styles.optionBtnText, { color: colors.primary }]}>Optimize</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.optionBtn, { borderColor: colors.primary }]} onPress={() => sendMessage('Check for Bugs')}>
                <Text style={[styles.optionBtnText, { color: colors.primary }]}>Check Bugs</Text>
              </TouchableOpacity>
            </View>

            {/* Message Input Box */}
            <View style={[styles.inputContainer, { backgroundColor: colors.border }]}>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                placeholder="Ask anything about this snippet..."
                placeholderTextColor={colors.text + '80'}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]} onPress={handleSend}>
                <Ionicons name="send" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  botOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  botBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  botContainer: {
    height: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  botTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  msgBubble: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    maxWidth: '85%',
  },
  msgUser: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  msgBot: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footerContainer: {
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
  },
  botOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionBtn: {
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  optionBtnText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 24,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    paddingRight: 8,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AiAssistant;
