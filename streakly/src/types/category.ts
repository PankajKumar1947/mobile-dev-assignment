import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../theme/theme";

export interface Category {
  id: string;
  key: keyof typeof Theme.colors.categories;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  color: string;
  bgColor: string;
}
