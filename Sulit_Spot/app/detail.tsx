import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DetailScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Top Label */}
            <Text style={styles.topLabel}>detail</Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Card */}
                <View style={styles.headerCard}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={20} color="#333" />
                        <Text style={styles.backText}>Post detail</Text>
                    </TouchableOpacity>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Food</Text>
                    </View>

                    <Text style={styles.postTitle}>Siomai rice for 50 pesos with 10 pcs</Text>

                    <View style={styles.metaRow}>
                        <Ionicons name="location-outline" size={13} color="#aaa" />
                        <Text style={styles.metaText}>Near Gate 2</Text>
                        <Ionicons name="pricetag-outline" size={13} color="#aaa" style={{ marginLeft: 10 }} />
                        <Text style={styles.metaText}>₱ 50</Text>
                    </View>

                    {/* Avatar */}
                    <View style={styles.avatarRow}>
                        <View style={styles.avatar}>
                            <Ionicons name="person-outline" size={18} color="#4ecba5" />
                        </View>
                    </View>

                    {/* Map View Placeholder */}
                    <View style={styles.mapBox}>
                        <Text style={styles.mapText}>Map View</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    {/* Description */}
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>
                        Busog na busog ang portion — sulit talaga para sa mga budget students. Luto fresh every morning, available until 2PM lang!
                    </Text>

                    {/* Trust Signals */}
                    <View style={styles.trustBox}>
                        <View style={styles.trustHeader}>
                            <Text style={styles.trustTitle}>Trust signals</Text>
                            <Text style={styles.trustRating}>⭐ 4.8 ratings</Text>
                        </View>

                        <View style={styles.trustRow}>
                            <TouchableOpacity style={styles.trustBtn}>
                                <Ionicons name="checkmark" size={14} color="#4ecba5" />
                                <Text style={styles.trustBtnText}>Still accurate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.trustBtn, styles.trustBtnOutdated]}>
                                <Text style={styles.trustBtnTextOutdated}>✕  Outdated</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.reportBtn}>
                            <Text style={styles.reportText}>Report Post</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Comments */}
                    <Text style={styles.sectionTitle}>Comments(1)</Text>

                    {/* Comment Item */}
                    <View style={styles.commentCard}>
                        <View style={styles.commentAvatar}>
                            <Text style={styles.commentAvatarText}>M</Text>
                        </View>
                        <View style={styles.commentBody}>
                            <Text style={styles.commentName}>Maria S.</Text>
                            <Text style={styles.commentText}>Confirmed 50 pesos as of today. Very filling too.</Text>
                        </View>
                    </View>

                    {/* My Comment */}
                    <View style={styles.commentCard}>
                        <View style={[styles.commentAvatar, { backgroundColor: '#e8f8f3' }]}>
                            <Text style={[styles.commentAvatarText, { color: '#4ecba5' }]}>A</Text>
                        </View>
                        <View style={styles.commentBody}>
                            <Text style={styles.commentName}>Arianne Evasco</Text>
                            <Text style={styles.commentText}>Posted Phase</Text>
                            <View style={styles.commentActions}>
                                <TouchableOpacity style={styles.editBtn}>
                                    <Text style={styles.editBtnText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.archiveBtn}>
                                    <Text style={styles.archiveBtnText}>Archive</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Comment Input */}
                    <View style={styles.commentInput}>
                        <TextInput
                            placeholder="Add a comment..."
                            style={styles.inputField}
                            placeholderTextColor="#aaa"
                        />
                        <TouchableOpacity>
                            <Ionicons name="send" size={20} color="#4ecba5" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 80 }} />
                </View>
            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home" size={22} color="#4ecba5" />
                    <Text style={[styles.navLabel, { color: '#4ecba5' }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="document-text-outline" size={22} color="#aaa" />
                    <Text style={styles.navLabel}>My posts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="person-outline" size={22} color="#aaa" />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    topLabel: { paddingTop: 52, paddingLeft: 20, fontSize: 12, color: '#aaa', marginBottom: 8 },
    headerCard: {
        backgroundColor: '#4ecba5', borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24, padding: 20, paddingTop: 0,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    backText: { fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 4 },
    badge: {
        alignSelf: 'flex-start', backgroundColor: '#fff',
        borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 8,
    },
    badgeText: { fontSize: 11, color: '#4ecba5', fontWeight: '600' },
    postTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 8 },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    metaText: { fontSize: 12, color: '#fff', marginLeft: 4 },
    avatarRow: { alignItems: 'center', marginBottom: 12 },
    avatar: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    },
    mapBox: {
        backgroundColor: '#e8f8f3', borderRadius: 12,
        height: 80, justifyContent: 'center', alignItems: 'center',
    },
    mapText: { color: '#4ecba5', fontSize: 13 },
    body: { padding: 16 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 12 },
    description: { fontSize: 13, color: '#666', lineHeight: 20, marginBottom: 12 },
    trustBox: {
        borderWidth: 1, borderColor: '#eee', borderRadius: 12,
        padding: 14, backgroundColor: '#fff', marginBottom: 12,
    },
    trustHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    trustTitle: { fontSize: 13, fontWeight: '600', color: '#333' },
    trustRating: { fontSize: 12, color: '#aaa' },
    trustRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
    trustBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        borderWidth: 1, borderColor: '#4ecba5', borderRadius: 8,
        paddingHorizontal: 12, paddingVertical: 6,
    },
    trustBtnText: { fontSize: 12, color: '#4ecba5' },
    trustBtnOutdated: { borderColor: '#ddd' },
    trustBtnTextOutdated: { fontSize: 12, color: '#aaa' },
    reportBtn: {
        borderWidth: 1, borderColor: '#ddd', borderRadius: 8,
        paddingVertical: 8, alignItems: 'center',
    },
    reportText: { fontSize: 12, color: '#aaa' },
    commentCard: {
        flexDirection: 'row', gap: 10, marginBottom: 12,
        backgroundColor: '#fff', borderRadius: 12,
        padding: 12, borderWidth: 1, borderColor: '#eee',
    },
    commentAvatar: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center',
    },
    commentAvatarText: { fontWeight: '600', color: '#fff' },
    commentBody: { flex: 1 },
    commentName: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 2 },
    commentText: { fontSize: 12, color: '#666' },
    commentActions: { flexDirection: 'row', gap: 8, marginTop: 6 },
    editBtn: {
        borderWidth: 1, borderColor: '#ddd', borderRadius: 6,
        paddingHorizontal: 12, paddingVertical: 4,
    },
    editBtnText: { fontSize: 12, color: '#555' },
    archiveBtn: {
        borderWidth: 1, borderColor: '#ddd', borderRadius: 6,
        paddingHorizontal: 12, paddingVertical: 4,
    },
    archiveBtnText: { fontSize: 12, color: '#555' },
    commentInput: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: 10,
        borderWidth: 1, borderColor: '#eee', marginTop: 4,
    },
    inputField: { flex: 1, fontSize: 13, color: '#333', marginRight: 8 },
    bottomNav: {
        flexDirection: 'row', justifyContent: 'space-around',
        alignItems: 'center', paddingVertical: 10,
        backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee',
    },
    navItem: { alignItems: 'center' },
    navLabel: { fontSize: 11, color: '#aaa', marginTop: 2 },
});