import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Linking, Pressable, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/typography";
import { Theme } from "../../theme/theme";

const FAQ = [
  {
    question: "How do I create a new habit?",
    answer: "Tap the + button in the bottom navigation bar on any screen. Fill in the habit name, frequency, and target, then tap Create Habit.",
  },
  {
    question: "How does the streak work?",
    answer: "Your streak increases by 1 each consecutive day you complete all your scheduled habits. Missing a day resets it to 0.",
  },
  {
    question: "Can I set reminders?",
    answer: "Yes! On each habit's detail screen, tap the + icon next to Reminders to add a timed notification.",
  },
  {
    question: "How is completion rate calculated?",
    answer: "Completion rate = habits completed ÷ habits scheduled for that period × 100%.",
  },
];

export default function HelpScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Theme.colors.textPrimary} />
        </Pressable>
        <Typography variant="h2">Help & Support</Typography>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contactCard}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color={Theme.colors.primary} />
          <Typography variant="bodyBold" style={styles.contactTitle}>Need help?</Typography>
          <Typography variant="caption" color={Theme.colors.textSecondary} style={styles.contactSub}>
            Our support team is available 24/7
          </Typography>
          <Pressable
            style={styles.contactBtn}
            onPress={() => Linking.openURL("mailto:support@streakly.app")}
          >
            <Typography variant="captionBold" color={Theme.colors.card}>Contact Support</Typography>
          </Pressable>
        </View>

        <Typography variant="bodyBold" style={styles.faqTitle}>Frequently Asked Questions</Typography>

        <View style={styles.faqCard}>
          {FAQ.map((item, idx) => (
            <View key={idx}>
              <View style={styles.faqItem}>
                <Typography variant="bodyBold" style={styles.faqQuestion}>{item.question}</Typography>
                <Typography variant="body" color={Theme.colors.textSecondary} style={styles.faqAnswer}>
                  {item.answer}
                </Typography>
              </View>
              {idx < FAQ.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Theme.colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.card,
    justifyContent: "center",
    alignItems: "center",
    ...Theme.shadows.soft,
  },
  scrollContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: Theme.spacing.xxxl,
  },
  contactCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.xl,
    alignItems: "center",
    marginBottom: Theme.spacing.xl,
    ...Theme.shadows.soft,
  },
  contactTitle: { marginTop: Theme.spacing.md, marginBottom: 4 },
  contactSub: { marginBottom: Theme.spacing.lg },
  contactBtn: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.sm + 2,
    borderRadius: Theme.radius.pill,
  },
  faqTitle: { marginBottom: Theme.spacing.md },
  faqCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    overflow: "hidden",
    ...Theme.shadows.soft,
  },
  faqItem: { padding: Theme.spacing.lg },
  faqQuestion: { marginBottom: Theme.spacing.sm },
  faqAnswer: { lineHeight: 20 },
  separator: { height: 1, backgroundColor: Theme.colors.border },
});
