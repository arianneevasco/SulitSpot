import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.topLabel}>profile</Text>
                <View style={styles.avatarBox}>
                    <View style={styles.avatar}>
                        <Ionicons name="person-outline" size={36} color="#4ecba5" />
                    </View>
                    <Text style={styles.name}>Arianne Evasco</Text>
                    <Text style={styles.email}>arianne@gmail.com</Text>
                </View>
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>3</Text>
                        <Text style={styles.statLabel}>Posts Shared</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>Helpful Votes</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>4.8</Text>
                        <Text style={styles.statLabel}>Avg Rating</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <Text style={styles.sectionTitle}>Account</Text>

                <View style={styles.menuCard}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="person-outline" size={18} color="#4ecba5" />
                        <Text style={styles.menuText}>Edit Profile</Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccc" style={styles.menuArrow} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="lock-closed-outline" size={18} color="#4ecba5" />
                        <Text style={styles.menuText}>Change Password</Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccc" style={styles.menuArrow} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="notifications-outline" size={18} color="#4ecba5" />
                        <Text style={styles.menuText}>Notifications</Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccc" style={styles.menuArrow} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Activity</Text>

                <View style={styles.menuCard}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/myposts')}>
                        <Ionicons name="document-text-outline" size={18} color="#4ecba5" />
                        <Text style={styles.menuText}>My Posts</Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccc" style={styles.menuArrow} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.menuItem}>
                        <Ionicons name="bookmark-outline" size={18} color="#4ecba5" />
                        <Text style={styles.menuText}>Saved Finds</Text>
                        <Ionicons name="chevron-forward" size={16} color="#ccc" style={styles.menuArrow} />
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/auth/login')}>
                    <Ionicons name="log-out-outline" size={18} color="#ff6b6b" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    header: {
        backgroundColor: '#4ecba5',
        paddingTop: 52,
        paddingBottom: 30,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        alignItems: 'center',
    },
    topLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, alignSelf: 'flex-start', paddingLeft: 20 },
    avatarBox: { alignItems: 'center' },
    avatar: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
        marginBottom: 10,
    },
    name: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
    email: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
    body: { flex: 1, paddingHorizontal: 16 },
    statsRow: {
        flexDirection: 'row', gap: 10,
        marginTop: 20, marginBottom: 8,
    },
    statCard: {
        flex: 1, backgroundColor: '#fff', borderRadius: 12,
        padding: 14, alignItems: 'center',
        borderWidth: 1, borderColor: '#eee',
    },
    statNumber: { fontSize: 20, fontWeight: '700', color: '#4ecba5', marginBottom: 4 },
    statLabel: { fontSize: 11, color: '#aaa', textAlign: 'center' },
    sectionTitle: { fontSize: 13, fontWeight: '600', color: '#aaa', marginTop: 20, marginBottom: 8 },
    menuCard: {
        backgroundColor: '#fff', borderRadius: 12,
        borderWidth: 1, borderColor: '#eee', overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 14,
    },
    menuText: { flex: 1, fontSize: 14, color: '#333', marginLeft: 12 },
    menuArrow: { marginLeft: 'auto' },
    divider: { height: 1, backgroundColor: '#f0f0f0', marginLeft: 46 },
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff', borderRadius: 12,
        borderWidth: 1, borderColor: '#eee',
        paddingVertical: 14, marginTop: 20, gap: 8,
    },
    logoutText: { fontSize: 14, color: '#ff6b6b', fontWeight: '600' },
});