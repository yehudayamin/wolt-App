/*
 * AppContext.js — global app state (auth + theme), mirrors the web AppContext.jsx
*/

import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; //to make async await in the mobile
import { apiGet } from '../services/api';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);


async function logout(){
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('userId');
    setToken(null);
    setUser(null);
}

async function login(token, userData){
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userId', userData._id);
    setToken(token);
    setUser(userData);
}

async function toggleTheme(){
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await AsyncStorage.setItem('theme', newTheme);
    setTheme(newTheme);
}

function updateUser(userData){
    setUser(userData);
}


useEffect(() => {
  async function restoreSession(){
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const theme = await AsyncStorage.getItem('theme');

      if (theme) setTheme(theme);
      
      if (userId && token){
        try {
                const res = await apiGet(`/api/users/${userId}`, token); 
                if (res.ok) {
                    setToken(token);
                    setUser(res.data);
                } else {
                    await AsyncStorage.removeItem('token');
                    await AsyncStorage.removeItem('userId');
                }
            } catch (err) {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('userId');
            }
      }
    setLoading(false);
  }
  restoreSession();
}, [])
  const value={ user, token, theme, loading, login, logout, toggleTheme, updateUser };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
