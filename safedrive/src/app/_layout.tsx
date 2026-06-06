import { Tabs } from "expo-router";
import { Car, User, Sun, Moon } from "lucide-react-native";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLogo } from "../components/app-logo";
import { CustomTabBar } from "../components/custom-tab-bar";
import { ThemeType } from "../constants/theme";
import { ThemeProvider, useTheme } from "../context/theme-context";
import { UserContext } from "../context/user-context";
import { deleteUserProfile, getUserProfile, saveUserProfile, UserProfile } from "../services/storage";

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}

function RootLayoutContent() {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = getStyles(theme);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("Sedan");

  useEffect(() => {
    async function loadData() {
      const stored = await getUserProfile();
      setProfile(stored);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
    loadData();
  }, []);

  const login = async (userName: string, vehicleType: string) => {
    if (!userName.trim()) return;
    const newProfile = { name: userName.trim(), vehicleType };
    await saveUserProfile(newProfile);
    setProfile(newProfile);
  };

  const logout = async () => {
    await deleteUserProfile();
    setProfile(null);
    setName("");
    setVehicle("Sedan");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <View style={styles.splashContent}>
          <AppLogo size="lg" direction="column" />
          <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.safeOnboard}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <View style={styles.onboardWrapper}>
            <AppLogo size="lg" direction="column" />

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Driver's name</Text>
              <View style={styles.inputContainer}>
                <User color={theme.colors.textSecondary} size={18} style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Vehicle type</Text>
              <View style={styles.vehicleRow}>
                {[
                  { id: "Sedan", label: "Sedan" },
                  { id: "SUV", label: "SUV" },
                  { id: "Truck", label: "Truck" },
                  { id: "Motorcycle", label: "Moto" }
                ].map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.vehicleCard, vehicle === type.id && styles.vehicleCardActive]}
                    onPress={() => setVehicle(type.id)}
                  >
                    <Car color={vehicle === type.id ? theme.colors.primary : theme.colors.textSecondary} size={22} />
                    <Text style={[styles.vehicleCardText, vehicle === type.id && styles.vehicleCardTextActive]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, !name.trim() && styles.disabledBtn]}
              disabled={!name.trim()}
              onPress={() => login(name, vehicle)}
            >
              <Text style={styles.submitBtnText}>Start exploring</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <UserContext.Provider value={{ profile, login, logout }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.background,
            borderBottomWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 20,
            fontWeight: "700",
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ marginRight: 16, padding: 8 }}
              activeOpacity={0.7}
            >
              {isDark ? (
                <Sun color={theme.colors.warning} size={20} />
              ) : (
                <Moon color={theme.colors.primary} size={20} />
              )}
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Safe Drive",
            tabBarLabel: "Drive",
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "Drive History",
            tabBarLabel: "History",
          }}
        />
        <Tabs.Screen
          name="history-details"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </UserContext.Provider>
  )
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

const getStyles = (theme: ThemeType) => StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  splashContent: {
    alignItems: "center",
  },
  safeOnboard: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  onboardWrapper: {
    gap: 24,
  },
  inputWrapper: {
    gap: 8,
  },
  fieldLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: "800",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.roundness.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    height: 52,
    paddingHorizontal: 16,
  },
  fieldIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 15,
  },
  vehicleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  vehicleCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness.md,
    paddingVertical: 14,
    alignItems: "center",
    gap: 8,
  },
  vehicleCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: "rgba(56, 189, 248, 0.05)",
  },
  vehicleCardText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  vehicleCardTextActive: {
    color: theme.colors.text,
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    height: 52,
    borderRadius: theme.roundness.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledBtn: {
    opacity: 0.35,
  },
  submitBtnText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: "800",
  },
});
