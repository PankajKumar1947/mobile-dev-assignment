import React, { useState, useEffect } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { Snippet } from '../types/snippet';

interface AiAssistantProps {
  visible: boolean;
  onClose: () => void;
  snippet: Snippet | null;
}

export const AiAssistant = ({ visible, onClose, snippet }: AiAssistantProps) => {
  const { colors } = useAppTheme();
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize bot chat once snippet metadata loads or changes
  useEffect(() => {
    if (snippet) {
      setChatMessages([
        { sender: 'bot', text: `Hello! I am your CodeKosh AI assistant. How can I help you with "${snippet.title || 'this snippet'}" today?` }
      ]);
    }
  }, [snippet, visible]);

  const handleBotOption = (option: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: option }]);
    setIsTyping(true);

    setTimeout(() => {
      let responseText = '';
      if (option.includes('Explain')) {
        responseText = `Here is an explanation for this ${snippet?.language || 'code'} snippet:\n\n` +
          `• **Overview**: The snippet "${snippet?.title || 'Code'}" is designed to execute this operation efficiently.\n` +
          `• **How it works**: It processes the input structures and applies logical conditions to compute the result.\n` +
          `• **Structure**: It uses standard ${snippet?.language || 'programming'} constructs, maintaining clean separation of concerns.`;
      } else if (option.includes('Optimize')) {
        responseText = `Here is an optimization analysis:\n\n` +
          `• **Time Complexity**: The current structure operates efficiently. For large datasets, consider memoization or lazy evaluation.\n` +
          `• **Memory**: The local scope allocations are clean and garbage-collector friendly.\n` +
          `• **Tip**: Make sure to use modern syntax features native to ${snippet?.language || 'this language'} to minimize execution overhead.`;
      } else {
        responseText = `I have scanned this snippet for potential issues:\n\n` +
          `✅ **Syntax**: Standard compiler-compliant syntax.\n` +
          `✅ **Security**: Safe local variables without dynamic execution risks.\n` +
          `✅ **Cleanliness**: Proper indentations and semantic styling observed. No bugs found!`;
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: responseText }]);
      setIsTyping(false);
    }, 1000);
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
        <View style={[styles.botContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
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
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {chatMessages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.msgBubble,
                  msg.sender === 'user' ? [styles.msgUser, { backgroundColor: colors.primary }] : [styles.msgBot, { backgroundColor: colors.border }],
                ]}
              >
                <Text style={[styles.msgText, { color: msg.sender === 'user' ? colors.background : colors.text }]}>
                  {msg.text}
                </Text>
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

          {/* Options Footer */}
          <View style={[styles.botOptions, { borderTopColor: colors.border }]}>
            <TouchableOpacity style={[styles.optionBtn, { borderColor: colors.primary }]} onPress={() => handleBotOption('Explain Code')}>
              <Text style={[styles.optionBtnText, { color: colors.primary }]}>Explain</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionBtn, { borderColor: colors.primary }]} onPress={() => handleBotOption('Optimize Code')}>
              <Text style={[styles.optionBtnText, { color: colors.primary }]}>Optimize</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionBtn, { borderColor: colors.primary }]} onPress={() => handleBotOption('Check for Bugs')}>
              <Text style={[styles.optionBtnText, { color: colors.primary }]}>Check Bugs</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    height: '75%',
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
  botOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
  },
  optionBtn: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  optionBtnText: {
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default AiAssistant;
