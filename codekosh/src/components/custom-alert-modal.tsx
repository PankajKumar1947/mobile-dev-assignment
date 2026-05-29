import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AlertButton[];
  cancelable?: boolean;
  onClose: () => void;
  onButtonPress: (onPress?: () => void) => void;
}

export const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  visible,
  title,
  message,
  buttons,
  cancelable = true,
  onClose,
  onButtonPress,
}) => {
  const { colors, typography, borderRadius } = useAppTheme();

  const getHeaderIcon = () => {
    const t = title.toLowerCase();
    if (t.includes('error') || t.includes('fail') || t.includes('invalid')) {
      return { name: 'alert-circle-outline' as const, color: colors.error };
    }
    if (t.includes('success') || t.includes('saved') || t.includes('copied') || t.includes('moved')) {
      return { name: 'checkmark-circle-outline' as const, color: colors.success };
    }
    if (t.includes('delete') || t.includes('remove') || t.includes('confirm') || t.includes('are you sure')) {
      return { name: 'warning-outline' as const, color: colors.error };
    }
    return { name: 'information-circle-outline' as const, color: colors.primary };
  };

  const iconInfo = getHeaderIcon();
  const isRowLayout = buttons.length <= 2;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        if (cancelable) onClose();
      }}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => {
          if (cancelable) onClose();
        }}
      >
        <TouchableOpacity
          style={[
            styles.alertContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.xl,
            },
          ]}
          activeOpacity={1}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={iconInfo.name} size={48} color={iconInfo.color} />
          </View>

          <Text style={[styles.title, { color: colors.text, fontSize: typography.fontSizes.lg }]}>
            {title}
          </Text>

          {!!message && (
            <Text style={[styles.message, { color: colors.textMuted, fontSize: typography.fontSizes.sm }]}>
              {message}
            </Text>
          )}

          <View style={[isRowLayout ? styles.buttonRow : styles.buttonCol]}>
            {buttons.map((btn, idx) => {
              const isDestructive = btn.style === 'destructive';
              const isCancel = btn.style === 'cancel';
              
              let btnBgColor = colors.primary;
              let btnTextColor = '#FFFFFF';
              let btnBorderWidth = 0;
              let btnBorderColor = 'transparent';

              if (isDestructive) {
                btnBgColor = colors.error;
                btnTextColor = '#FFFFFF';
              } else if (isCancel) {
                btnBgColor = 'transparent';
                btnTextColor = colors.textMuted;
                btnBorderWidth = 1;
                btnBorderColor = colors.border;
              }

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.button,
                    isRowLayout ? styles.flexButton : null,
                    {
                      backgroundColor: btnBgColor,
                      borderWidth: btnBorderWidth,
                      borderColor: btnBorderColor,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                  onPress={() => onButtonPress(btn.onPress)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color: btnTextColor,
                        fontWeight: isCancel ? 'normal' : 'bold',
                        fontSize: typography.fontSizes.sm,
                      },
                    ]}
                  >
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    width: '90%',
    maxWidth: 340,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  buttonCol: {
    flexDirection: 'column',
    width: '100%',
    gap: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  flexButton: {
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
  },
});
