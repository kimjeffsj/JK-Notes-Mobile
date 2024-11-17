import { ThemeType } from "@/shared/types/settings/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageKeys = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  SETTINGS: "settings",
} as const;

export const storage = {
  setToken: async (token: string) => {
    try {
      await AsyncStorage.setItem(StorageKeys.AUTH_TOKEN, token);
    } catch (error) {
      console.error("Error saving token: ", error);
    }
  },

  getToken: async () => {
    try {
      return await AsyncStorage.getItem(StorageKeys.AUTH_TOKEN);
    } catch (error) {
      console.error("Error getting token: ", error);
      return null;
    }
  },

  removeToken: async () => {
    try {
      await AsyncStorage.removeItem(StorageKeys.AUTH_TOKEN);
    } catch (error) {
      console.error("Error removing token: ", error);
    }
  },

  setUser: async (user: any) => {
    try {
      await AsyncStorage.setItem(StorageKeys.USER_DATA, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user date: ", error);
    }
  },

  getUser: async () => {
    try {
      const user = await AsyncStorage.getItem(StorageKeys.USER_DATA);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting user Data: ", error);
      return null;
    }
  },

  setRefreshToken: async (token: string) => {
    try {
      await AsyncStorage.setItem(StorageKeys.REFRESH_TOKEN, token);
    } catch (error) {
      console.error("Error saving refresh token: ", error);
    }
  },

  getRefreshToken: async () => {
    try {
      return await AsyncStorage.getItem(StorageKeys.REFRESH_TOKEN);
    } catch (error) {
      console.error("Error getting refresh token: ", error);
      return null;
    }
  },

  clearTokens: async () => {
    try {
      await AsyncStorage.multiRemove([
        StorageKeys.AUTH_TOKEN,
        StorageKeys.REFRESH_TOKEN,
      ]);
    } catch (error) {
      console.error("Error clearing tokens: ", error);
    }
  },

  removeUser: async () => {
    try {
      await AsyncStorage.removeItem(StorageKeys.USER_DATA);
    } catch (error) {
      console.error("Error removing user data: ", error);
    }
  },

  getSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem(StorageKeys.SETTINGS);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error("Error getting settings:", error);
      return null;
    }
  },

  setSettings: async (settings: { theme: ThemeType }) => {
    try {
      await AsyncStorage.setItem(
        StorageKeys.SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  },

  clearAll: async () => {
    try {
      await AsyncStorage.multiRemove([
        StorageKeys.AUTH_TOKEN,
        StorageKeys.REFRESH_TOKEN,
        StorageKeys.USER_DATA,
        StorageKeys.SETTINGS,
      ]);
    } catch (error) {
      console.error("Error clearing storage: ", error);
    }
  },
};
