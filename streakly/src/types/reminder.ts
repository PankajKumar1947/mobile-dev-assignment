export interface Reminder {
  id: string;
  time: string; // "09:00 AM"
  repeatLabel: string; // "Every day" | "Mon, Wed, Fri"
  enabled: boolean;
}
