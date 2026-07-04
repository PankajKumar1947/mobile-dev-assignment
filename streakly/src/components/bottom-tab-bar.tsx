import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "../components/typography";
import { Theme } from "../theme/theme";

const TABS = [
  { name: "index", label: "Today", icon: "home" as const, iconO: "home-outline" as const },
  { name: "habits", label: "Habits", icon: "list" as const, iconO: "list-outline" as const },
  { name: "__fab__", label: "", icon: "add" as const, iconO: "add" as const },
  { name: "insights", label: "Insights", icon: "bar-chart" as const, iconO: "bar-chart-outline" as const },
  { name: "profile", label: "Profile", icon: "person" as const, iconO: "person-outline" as const },
] as const;

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Map route names to our TABS config (excluding the FAB slot which isn't a real route)
  const realRoutes = state.routes.filter(Boolean);

  // We inject the FAB in between habits and insights
  const tabItems = TABS.map((tab) => {
    if (tab.name === "__fab__") {
      return { ...tab, routeKey: null, isFocused: false };
    }
    const routeIdx = realRoutes.findIndex((r) => r.name === tab.name);
    return {
      ...tab,
      routeKey: routeIdx !== -1 ? realRoutes[routeIdx].key : null,
      isFocused: state.index === routeIdx,
    };
  });

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {tabItems.map((tab, i) => {
        if (tab.name === "__fab__") {
          return (
            <View key="__fab__" style={styles.fabWrap}>
              <Pressable
                style={({ pressed }) => [
                  styles.fab,
                  pressed && { transform: [{ scale: 0.94 }], opacity: 0.9 },
                ]}
                onPress={() => {
                  router.push("/habit/create" as any);
                }}
              >
                <Ionicons name="add" size={28} color={Theme.colors.card} />
              </Pressable>
            </View>
          );
        }

        return (
          <Pressable
            key={tab.name}
            style={styles.tabItem}
            onPress={() => {
              if (!tab.routeKey) return;
              const event = navigation.emit({
                type: "tabPress",
                target: tab.routeKey,
                canPreventDefault: true,
              });
              if (!tab.isFocused && !event.defaultPrevented) {
                navigation.navigate(tab.name as string);
              }
            }}
          >
            <Ionicons
              name={tab.isFocused ? tab.icon : tab.iconO}
              size={22}
              color={tab.isFocused ? Theme.colors.primary : Theme.colors.textSecondary}
            />
            <Typography
              variant="captionBold"
              style={[styles.tabLabel, tab.isFocused && { color: Theme.colors.primary }]}
            >
              {tab.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: Theme.colors.card,
    borderTopLeftRadius: Theme.radius.xl,
    borderTopRightRadius: Theme.radius.xl,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.sm,
    height: Platform.OS === "ios" ? 78 : 64,
    alignItems: "center",
    ...Theme.shadows.medium,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.xs,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    color: Theme.colors.textSecondary,
  },
  fabWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: -20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.medium,
  },
});
