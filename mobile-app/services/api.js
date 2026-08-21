/*
 * api.js — central HTTP layer for talking to the Node server
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getDynamicBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Use the same host that serves the Expo bundle (works on a physical phone via Expo Go).
  const hostUri = Constants.expoGoConfig?.debuggerHost || Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3000`;
  }

  // Fallbacks for emulators when no host is available.
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
}

export const BASE_URL = getDynamicBaseUrl();


function authHeaders(token, isPostOrPatch = false) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (isPostOrPatch) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
}

export async function apiGet(path, token) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: authHeaders(token)
    });
    let data = {};
    if (res.status !== 204){
      data = await res.json();
    }
    return { ok: res.ok, status: res.status, data: data};
  }catch(err) {
    return {ok: false, status: 0, data: {error: 'Network error'}};
  }
    
}

export async function apiPost(path, body, token) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: authHeaders(token, true),
      body: JSON.stringify(body)
    });

    let data = {};
    if (res.status !== 204) {
      data = await res.json();
    }

    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: { error: 'Network error' } };
  }
}

export async function apiPatch(path, body, token) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: authHeaders(token, true),
      body: JSON.stringify(body)
    });

    let data = {};
    if (res.status !== 204) {
      data = await res.json();
    }

    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: { error: 'Network error' } };
  }
}

export async function apiDelete(path, token) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: authHeaders(token)
    });
    let data = {};
    if (res.status !== 204){
      data = await res.json();
    }
    return { ok: res.ok, status: res.status, data: data};
  }catch(err) {
    return {ok: false, status: 0, data: {error: 'Network error'}};
  }
}
