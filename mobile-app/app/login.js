/* Login screen */

import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { AppContext } from '../context/AppContext';
import { apiPost, apiGet } from '../services/api';
import { getColors } from '../styles/Theme';
import { makeStyles } from '../styles/login.styles';

export default function Login() {
    const context = useContext(AppContext);
    const colors = getColors(context.theme);
    const styles = makeStyles(colors);
    const [password, setPassword] = useState('');  
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter();

    async function handleLogin() {
        const res = await apiPost('/api/tokens', {username, password}); 

        if (res.ok)
        {
            const userData = await apiGet(`/api/users/${res.data.userId}`, res.data.token);
            context.login(res.data.token, userData.data);
            router.replace('/(tabs)')
        }
        else if (res.status === 404) { setError("User not found") }
        else if (res.status === 401) { setError("Incorrect password") }
    }


    return (
    <View style={styles.container}>
        <View style = {styles.card}>
            <Text style={styles.title}>Wolt</Text>
            
            <TextInput
              placeholder="Enter username"
              placeholderTextColor={colors.textSecondary}
              value={username}
              onChangeText={setUsername}
              style={styles.input}
          />
          <TextInput
              placeholder="Enter password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
          />
            
            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <TouchableOpacity style={styles.button} onPress={handleLogin}><Text style={styles.buttonText}>Log In</Text></TouchableOpacity>

            <Text style={styles.linkContainer}>
                Don't have an account?{' '}
                <Text onPress={() => router.push('/register')} style={styles.link}>
                    Sign up
                </Text>
            </Text>
        </View>
    </View>
)
}
