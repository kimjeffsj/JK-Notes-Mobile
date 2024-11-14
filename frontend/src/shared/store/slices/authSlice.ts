import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/shared/types/auth/auth";
import api, { isTokenExpired } from "@/utils/api";
import { storage } from "@/utils/storage";

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", credentials);
      const { accessToken, refreshToken, user } = response.data;

      await storage.setToken(accessToken);
      await storage.setRefreshToken(refreshToken);
      await storage.setUser(user);

      return { accessToken, refreshToken, user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to login"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/register", credentials);

      return { user: response.data.user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to Register"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = await storage.getToken();

      if (token) {
        try {
          await api.post("/logout", { refreshToken: token });
        } catch (error: any) {
          console.warn("Backend logout failed, continuing with local logout");
        }
      }

      await storage.clearAll();

      api.defaults.headers.common["Authorization"] = null;

      return true;
    } catch (error: any) {
      console.error("Logout error:", error);

      await storage.clearAll();
      return rejectWithValue(
        error.response?.data?.message || "Failed to logout"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const [token, refreshToken, user] = await Promise.all([
        storage.getToken(),
        storage.getRefreshToken(),
        storage.getUser(),
      ]);

      if (!token || !refreshToken || !user) {
        throw new Error("No auth data");
      }

      if (isTokenExpired(token)) {
        try {
          const response = await api.post("/refresh", { refreshToken });
          const { accessToken: newToken } = response.data;
          await storage.setToken(newToken);
          return { token: newToken, refreshToken, user };
        } catch {
          throw new Error("Token refresh failed");
        }
      }

      return { token, refreshToken, user };
    } catch (error: any) {
      await storage.clearAll();
      return rejectWithValue(
        error.response?.data?.message || "Authentication check failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    data: {
      name?: string;
      email?: string;
      currentPassword: string;
      newPassword?: string;
      confirmNewPassword?: string;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.user) throw new Error("No user found");

      const updateData = {
        name: data.name || auth.user.name,
        email: data.email || auth.user.email,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      };

      const response = await api.post(`/profile/${auth.user.id}`, updateData);

      const updatedUser: User = {
        id: auth.user.id,
        name: data.name || auth.user.name,
        email: data.email || auth.user.email,
      };

      await storage.setUser(updatedUser);

      return { user: updatedUser };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Checking Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
      })

      // Updating User Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
