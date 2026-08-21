/*
 * index.js — app entry route ("/"). Decides where the user lands on launch.
 */


import { Redirect } from 'expo-router';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

export default function Index() {
    const { token, loading } = useContext(AppContext);

    if (loading) 
      return null;
    // Everyone lands on the main screen first (like the web). Login/Register are
    // reachable from the Profile tab — no forced login.
    return <Redirect href="/(tabs)" />;
}
