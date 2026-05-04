import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from "react-native";

export default function LoginPage() {
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
                    Don't have an account? <Text style={styles.link}>Sign up</Text>
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

const GREEN = "#3ECFAA";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        backgroundColor: GREEN,
        height: 200,
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    brand: { fontSize: 28, fontWeight: "700", color: "#fff" },
    form: { paddingHorizontal: 24, paddingTop: 32 },
    label: { fontSize: 13, color: "#666", marginBottom: 6 },
    input: {
        borderWidth: 0.5, borderColor: "#ccc", borderRadius: 10,
        padding: 12, fontSize: 14, marginBottom: 16,
    },
    loginBtn: {
        backgroundColor: GREEN, borderRadius: 10,
        padding: 14, alignItems: "center", marginBottom: 14,
    },
    loginBtnText: { color: "#fff", fontWeight: "600", fontSize: 15 },
    signupText: { textAlign: "center", fontSize: 13, color: "#666", marginBottom: 16 },
    link: { color: GREEN, fontWeight: "600" },
    divider: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    line: { flex: 1, height: 0.5, backgroundColor: "#ddd" },
    dividerText: { fontSize: 12, color: "#aaa", marginHorizontal: 8 },
    browseBtn: {
        borderWidth: 0.5, borderColor: "#ccc", borderRadius: 10,
        padding: 14, alignItems: "center",
    },
    browseBtnText: { fontSize: 14, color: "#333" },
});