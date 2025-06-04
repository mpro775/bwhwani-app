// authService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_KEY = "AIzaSyCFdBl4qtA6OwpdNsDX24V_9phbjAiMQWU";

const BASE_URL = "https://identitytoolkit.googleapis.com/v1";
const SECURE_TOKEN_URL = "https://securetoken.googleapis.com/v1/token";

export const registerWithEmail = async (email: string, password: string) => {
  const endpoint = `${BASE_URL}/accounts:signUp?key=${API_KEY}`;
  const payload = { email, password, returnSecureToken: true };

  const response = await axios.post(endpoint, payload);
  return response.data;
};

export const loginWithEmail = async (email: string, password: string) => {
  const { data } = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    { email, password, returnSecureToken: true }
  );
  // يردّ لك data: { idToken, refreshToken, expiresIn, ... }
  const expiresInMs = parseInt(data.expiresIn, 10) * 1000;
  const expiryTime = Date.now() + expiresInMs; // timestamp بالـ ms

  await AsyncStorage.multiSet([
    ["firebase-idToken", data.idToken],
    ["firebase-refreshToken", data.refreshToken],
    ["firebase-expiryTime", expiryTime.toString()],
  ]);

  return data;
};

export const sendPasswordReset = async (email: string) => {
  const endpoint = `${BASE_URL}/accounts:sendOobCode?key=${API_KEY}`;
  const payload = { requestType: "PASSWORD_RESET", email };

  const response = await axios.post(endpoint, payload);
  return response.data;
};

export async function refreshIdToken(): Promise<string> {
  const [[, refreshToken], [, expiryTimeStr]] = await AsyncStorage.multiGet([
    "firebase-refreshToken",
    "firebase-expiryTime",
  ]);

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const now = Date.now();
  if (expiryTimeStr && now < parseInt(expiryTimeStr, 10) - 5000) {
    const idToken = await AsyncStorage.getItem("firebase-idToken"); // ✅
    if (idToken) return idToken;
  }

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const { data } = await axios.post(
    `${SECURE_TOKEN_URL}?key=${API_KEY}`,
    params.toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const newExpiry = Date.now() + parseInt(data.expires_in, 10) * 1000;
  await AsyncStorage.multiSet([
    ["firebase-idToken", data.id_token], // ✅ اسم موحّد
    ["firebase-refreshToken", data.refresh_token],
    ["firebase-expiryTime", newExpiry.toString()],
  ]);

  return data.id_token;
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await refreshIdToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}
export const storeFirebaseTokens = async (idToken: string, refreshToken: string, expiresIn: number) => {
  const expiryTime = Date.now() + expiresIn * 1000;
  await AsyncStorage.multiSet([
    ["firebase-idToken", idToken],
    ["firebase-refreshToken", refreshToken],
    ["firebase-expiryTime", expiryTime.toString()],
  ]);
};
