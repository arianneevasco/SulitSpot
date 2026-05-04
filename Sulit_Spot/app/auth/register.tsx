import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, Spacing } from '@/constants/theme';

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
    container: { flex: 1, backgroundColor: Colors.white },
    topLabel: { paddingTop: 52, paddingLeft: 24, fontSize: FontSizes.small, color: '#aaa' },
    header: {
        backgroundColor: Colors.primary,
        height: Spacing.headerHeight,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 24,
    },
    title: { fontSize: FontSizes.brand, fontWeight: '600', color: Colors.white },
    form: { padding: 24 },
    label: { fontSize: FontSizes.small, color: '#555', marginBottom: 4 },
    input: {
        borderWidth: 1, borderColor: Colors.inputBorder, borderRadius: Spacing.inputRadius,
        padding: Spacing.inputPadding, marginBottom: 16, fontSize: FontSizes.label,
    },
    loginBtn: {
        backgroundColor: Colors.primary, borderRadius: Spacing.buttonRadius,
        padding: 14, alignItems: 'center', marginBottom: 12,
    },
    loginText: { color: Colors.white, fontWeight: '600' },
    signupText: { textAlign: 'center', fontSize: FontSizes.small, color: '#777' },
    link: { color: Colors.primary, fontWeight: '600' },
});