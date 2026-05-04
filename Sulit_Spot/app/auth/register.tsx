import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.topLabel}>sign up</Text>

            <View style={styles.header}>
                <Text style={styles.title}>Sulit Spot</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Full name</Text>
                <TextInput style={styles.input} placeholder="Your name" />

                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} placeholder="yourname@gmail.com" keyboardType="email-address" />

                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} placeholder="at least 8 character" secureTextEntry />

                <TouchableOpacity style={styles.loginBtn}>
                    <Text style={styles.loginText}>Sign Up</Text>
                </TouchableOpacity>

                <Text style={styles.signupText}>
                    Already have an account?{' '}
                    <Text style={styles.link} onPress={() => router.push('/auth/login')}>
                        Login
                    </Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    topLabel: { paddingTop: 52, paddingLeft: 24, fontSize: 13, color: '#aaa' },
    header: {
        backgroundColor: '#4ecba5',
        height: 180,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 24,
    },
    title: { fontSize: 28, fontWeight: '600', color: '#fff' },
    form: { padding: 24 },
    label: { fontSize: 13, color: '#555', marginBottom: 4 },
    input: {
        borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
        padding: 10, marginBottom: 16, fontSize: 14,
    },
    loginBtn: {
        backgroundColor: '#4ecba5', borderRadius: 8,
        padding: 14, alignItems: 'center', marginBottom: 12,
    },
    loginText: { color: '#fff', fontWeight: '600' },
    signupText: { textAlign: 'center', fontSize: 13, color: '#777' },
    link: { color: '#4ecba5', fontWeight: '600' },
});