import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Gauge, History } from "lucide-react-native";
import { Theme } from "../constants/theme";

export function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          
          if (route.name === "history-details" || options.href === null) return null;

          const isFocused = state.index === index;
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true });
            }
          };

          const color = isFocused ? Theme.colors.primary : Theme.colors.textMuted;
          const Icon = route.name === "index" ? Gauge : History;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Icon color={color} size={20} />
              <Text style={[styles.tabLabel, { color }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: Theme.colors.card,
    width: 220,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    width: 80,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
});
