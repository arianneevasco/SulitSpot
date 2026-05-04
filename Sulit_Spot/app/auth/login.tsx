import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from 'expo-router';
import { Colors, FontSizes, Spacing } from '@/constants/theme';

export default function LoginPage() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.brand}>Sulit Spot</Text>
            </View>
            <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} placeholder="yourname@gmail.com" keyboardType="email-address" />

                <Text style={styles.label}>Password</Text>
                <TextInput style={styles.input} placeholder="at least 6 characters" secureTextEntry />

                <TouchableOpacity style={styles.loginBtn}>
                    <Text style={styles.loginBtnText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.signupText}>
                    Don't have an account?{' '}
                    <Text style={styles.link} onPress={() => router.push('/auth/register')}>
                        Sign up
                    </Text>
                </Text>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.dividerText}>or continue as</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.browseBtn}>
                    <Text style={styles.browseBtnText}>Browse without account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    header: {
        backgroundColor: Colors.primary,
        height: Spacing.headerHeight,
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    brand: { fontSize: FontSizes.brand, fontWeight: "700", color: Colors.white },
    form: { paddingHorizontal: 24, paddingTop: 32 },
    label: { fontSize: FontSizes.small, color: Colors.textSecondary, marginBottom: 6 },
    input: {
        borderWidth: 0.5, borderColor: Colors.inputBorder, borderRadius: Spacing.inputRadius,
        padding: Spacing.inputPadding, fontSize: FontSizes.label, marginBottom: 16,
    },
    loginBtn: {
        backgroundColor: Colors.primary, borderRadius: Spacing.buttonRadius,
        padding: 14, alignItems: "center", marginBottom: 14,
    },
    loginBtnText: { color: Colors.white, fontWeight: "600", fontSize: FontSizes.button },
    signupText: { textAlign: "center", fontSize: FontSizes.small, color: Colors.textSecondary, marginBottom: 16 },
    link: { color: Colors.primary, fontWeight: "600" },
    divider: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    line: { flex: 1, height: 0.5, backgroundColor: Colors.divider },
    dividerText: { fontSize: FontSizes.small, color: Colors.placeholder, marginHorizontal: 8 },
    browseBtn: {
        borderWidth: 0.5, borderColor: Colors.inputBorder, borderRadius: Spacing.buttonRadius,
        padding: 14, alignItems: "center",
    },
    browseBtnText: { fontSize: FontSizes.label, color: Colors.textPrimary },
});