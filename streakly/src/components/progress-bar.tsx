import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Theme } from "../theme/theme";

export interface ProgressBarProps {
  progress: number; // Value between 0 and 1
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Theme.colors.primary,
  height = 8,
  style,
}) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    // Keep progression bounded between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progress));
    animatedProgress.value = withTiming(clampedProgress, { duration: 500 });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value * 100}%`,
    };
  });

  return (
    <View style={[styles.container, { height, borderRadius: height / 2 }, style]}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            height,
            borderRadius: height / 2,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Theme.colors.border,
    overflow: "hidden",
  },
  fill: {
    width: 0,
  },
});
