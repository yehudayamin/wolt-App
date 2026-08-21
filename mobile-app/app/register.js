/*
 * register.js — Registration screen
 */

import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { useState, useContext, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { AppContext } from '../context/AppContext';
import { apiPost, apiGet } from '../services/api';
import { getColors } from '../styles/Theme';
import { makeStyles } from '../styles/register.styles';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Register()
{
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState('')
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [role, setRole] = useState('user')
    const [lat, setLat] = useState(32.0853);
    const [lng, setLng] = useState(34.7818);
    const context = useContext(AppContext);
    const colors = getColors(context.theme);
    const styles = makeStyles(colors);
    const [isEnabled, setIsEnabled] = useState(false);
    const router = useRouter(); //for navigation between screens

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            base64: true,
            quality: 0.3
        });
        if (!result.canceled) {
            setImage('data:image/jpeg;base64,' + result.assets[0].base64);
        }
    }
    
    

    function handleRoleChange(newRole) {
        setRole(newRole);
        if (newRole !== 'user') {
            setImage('');
            setAddress('');
            setLat(32.0853);
            setLng(34.7818);
        }
    }

    function toggleSwitch(newValue) {
        setIsEnabled(newValue);
        handleRoleChange(newValue ? 'restaurant' : 'user');
    }

    function validate() {
        const newErrors = {}
        
        if (!username) newErrors.username = "Username is required"
        if (!password || password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password))
            newErrors.password = "Password must be at least 8 characters with letters and digits"
        if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match"
        if (!name) newErrors.name = "Name is required"
        if (!phone || !/^\d+$/.test(phone)) newErrors.phone = "Phone must contain digits only"
        if (role === 'user' && !address) newErrors.address = "Address is required"
        if (!email || !email.includes('@')) newErrors.email = "Invalid email format"
        if (role === 'user' && !image) newErrors.image = "Please select an image"
        if (role === 'user' && (lat < -90 || lat > 90))
            newErrors.lat = "Latitude must be between -90 and 90"
        if (role === 'user' && (lng < -180 || lng > 180)) 
            newErrors.lng = "Longitude must be between -180 and 180"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
        }

    async function handleSubmit() {
        //if invalid don't do nothing
        if (!validate()) return
        
        //post to server - new user.
        const res = await apiPost('/api/users', {username, password, name, phone, address, email, image, role,
              lat: parseFloat(lat),
              lng: parseFloat(lng)
          });
    
        if (res.ok) {
            setSuccessMessage("Registration successful! Redirecting to login...")
            setTimeout(() => router.push('/login'), 2000)
        }
        else if (res.status === 409) { setServerError("Username already exists") }
        else if (res.status === 400) { setServerError(res.data.error) }
        else { setServerError(res.data?.error || 'Something went wrong') }

    }

return (
  <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgSecondary }}>
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter username"
                placeholderTextColor={colors.textSecondary}
            />
              {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
                
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}


            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                placeholderTextColor={colors.textSecondary}
                
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textSecondary}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            {role === 'user' && (
                <>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter address"
                    placeholderTextColor={colors.textSecondary}
                    
                />
                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

                <TextInput
                    style={styles.input}
                    value={String(lat)}
                    onChangeText={setLat}
                    placeholder="Enter Latitude"
                    placeholderTextColor={colors.textSecondary}
                    
                />
                {errors.lat && <Text style={styles.errorText}>{errors.lat}</Text>}

                <TextInput
                    style={styles.input}
                    value={String(lng)}
                    onChangeText={setLng}
                    placeholder="Enter Longtitude"
                    placeholderTextColor={colors.textSecondary}
                
                />
                {errors.lng && <Text style={styles.errorText}>{errors.lng}</Text>}

                </>
            )}

            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                
            />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}


            {role === 'user' && (
                 <>
                    <TouchableOpacity onPress={pickImage} style={styles.button}>
                        <Text style={styles.buttonText}>
                            {image ? 'Change Photo' : 'Choose Photo'}
                        </Text>
                    </TouchableOpacity>
                    {image ? (
                        <Image source={{ uri: image }} style={{ width: 80, height: 80, borderRadius: 40, alignSelf: 'center', marginBottom: 12 }} />
                    ) : null}
                    {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
                </>
            )}
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                {isEnabled ? 'Restaurant Owner' : 'Regular User'}
              </Text>

              <Switch
                trackColor={{ false: '#767577', true: colors.primary || '#81b0ff' }}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />



          </View>
            {serverError && <Text style={styles.errorText}>{serverError}</Text>}
            {successMessage && <Text style={styles.successMessage}>{successMessage}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}><Text style={styles.buttonText}>Create Account</Text></TouchableOpacity>

            <Text style={styles.linkContainer}>
                Already have an account?{' '}
                <Text
                    onPress={() => router.push('/login')}
                    style={styles.link}
                >
                    Log in
                </Text>
            </Text>
        </View>
    </ScrollView>
    </SafeAreaView>
)

}