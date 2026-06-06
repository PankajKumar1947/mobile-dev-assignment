import React, { createContext, useContext } from "react";
import { UserProfile } from "../services/storage";

export interface UserContextType {
  profile: UserProfile | null;
  login: (name: string, vehicleType: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | null>(null);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
