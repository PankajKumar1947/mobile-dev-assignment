import React, { createContext, useContext, useState, useCallback } from 'react';
import { CustomAlertModal, AlertButton } from '../components/custom-alert-modal';

interface AlertOptions {
  cancelable?: boolean;
}

interface AlertContextType {
  showAlert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions
  ) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttons, setButtons] = useState<AlertButton[]>([]);
  const [cancelable, setCancelable] = useState(true);

  const showAlert = useCallback(
    (
      alertTitle: string,
      alertMessage?: string,
      alertButtons?: AlertButton[],
      alertOptions?: AlertOptions
    ) => {
      setTitle(alertTitle);
      setMessage(alertMessage || '');
      setButtons(alertButtons || [{ text: 'OK' }]);
      setCancelable(alertOptions?.cancelable ?? true);
      setVisible(true);
    },
    []
  );

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handleButtonPress = useCallback((onPress?: () => void) => {
    setVisible(false);
    if (onPress) {
      onPress();
    }
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CustomAlertModal
        visible={visible}
        title={title}
        message={message}
        buttons={buttons}
        cancelable={cancelable}
        onClose={handleClose}
        onButtonPress={handleButtonPress}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
export type { AlertButton };
