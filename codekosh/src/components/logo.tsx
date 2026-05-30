import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';
import { useAppTheme } from '../theme';

interface LogoProps {
  size?: 'small' | 'large';
  style?: ViewStyle;
}

export const Logo = ({ size = 'small', style }: LogoProps) => {
  const { colors } = useAppTheme();
  const isLarge = size === 'large';

  return (
    <View style={[styles.container, isLarge ? styles.column : styles.row, style]}>
      <Image
        source={require('../../assets/images/icon.png')}
        style={[
          styles.logoImage,
          {
            width: isLarge ? 100 : 32,
            height: isLarge ? 100 : 32,
            borderRadius: isLarge ? 20 : 8,
            marginBottom: isLarge ? 16 : 0,
            marginRight: isLarge ? 0 : 10,
          },
        ]}
        resizeMode="cover"
      />
      <Text
        style={[
          isLarge ? styles.titleLarge : styles.titleSmall,
          { color: colors.text },
        ]}
      >
        CodeKosh
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  logoImage: {
    overflow: 'hidden',
  },
  titleLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  titleSmall: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default Logo;
