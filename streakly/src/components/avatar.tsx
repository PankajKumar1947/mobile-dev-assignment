import React from "react";
import { StyleSheet, View, Image, ViewStyle, ImageSourcePropType } from "react-native";
import { Theme } from "../theme/theme";
import { Typography } from "./typography";

export interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 40,
  style,
}) => {
  const getInitials = (fullName?: string) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
    },
    style,
  ];

  if (source) {
    return (
      <View style={containerStyle}>
        <Image
          source={source}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View style={[containerStyle, styles.placeholder]}>
      <Typography
        variant="captionBold"
        color={Theme.colors.primary}
        style={{ fontSize: size * 0.4 }}
      >
        {getInitials(name) || "?"}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    backgroundColor: Theme.colors.primaryLight,
  },
});
