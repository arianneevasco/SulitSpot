import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '@/constants/theme';

const myPosts = [
    {
        id: '1',
        title: 'Siomai rice for 50 pesos with 10 pcs',
        category: 'Food',
        location: 'Near Gate 2',
        price: 50,
        rating: 4.5,
    },
    {
        id: '2',
        title: 'Buy after 6PM at Canteen B',
        category: 'Tips',
        location: 'Canteen B',
        time: '6PM',
        rating: 4.5,
    },
    {
        id: '3',
        title: 'Notebook bundle, 100 Pesos',
        category: 'Items',
        location: 'Daza',
        price: 100,
        rating: 4.5,
    },
];

export default function MyPostsScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.topLabel}>my posts</Text>
                <View style={styles.headerBottom}>
                    <Text style={styles.headerTitle}>My Posts</Text>
                    <Text style={styles.sharedCount}>3 Shared</Text>
                </View>
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                {myPosts.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardTop}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{item.category}</Text>
                            </View>
                        </View>

                        <View style={styles.cardMeta}>
                            <Ionicons name="location-outline" size={12} color={Colors.placeholder} />
                            <Text style={styles.metaText}>{item.location}</Text>
                            {item.price !== undefined && (
                                <>
                                    <Ionicons name="pricetag-outline" size={12} color={Colors.placeholder} style={{ marginLeft: 8 }} />
                                    <Text style={styles.metaText}>₱ {item.price}</Text>
                                </>
                            )}
                            {item.time !== undefined && (
                                <>
                                    <Ionicons name="time-outline" size={12} color={Colors.placeholder} style={{ marginLeft: 8 }} />
                                    <Text style={styles.metaText}>{item.time}</Text>
                                </>
                            )}
                        </View>

                        <View style={styles.cardActions}>
                            <TouchableOpacity style={styles.editBtn}>
                                <Text style={styles.editBtnText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.archiveBtn}>
                                <Text style={styles.archiveBtnText}>Archive</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        backgroundColor: Colors.primary,
        paddingTop: 52,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    topLabel: { fontSize: FontSizes.small, color: 'rgba(255,255,255,0.7)', marginBottom: 16 },
    headerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitle: { fontSize: 22, fontWeight: '700', color: Colors.white },
    sharedCount: { fontSize: FontSizes.small, color: 'rgba(255,255,255,0.85)' },
    body: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
    card: {
        backgroundColor: Colors.white, borderRadius: 12,
        padding: 14, marginBottom: 12,
        borderWidth: 1, borderColor: Colors.inputBorder,
    },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    cardTitle: { flex: 1, fontSize: FontSizes.small, fontWeight: '600', color: Colors.textPrimary, marginRight: 8 },
    badge: { backgroundColor: '#e8f8f3', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    badgeText: { fontSize: FontSizes.small, color: Colors.primary, fontWeight: '600' },
    cardMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    metaText: { fontSize: FontSizes.small, color: Colors.placeholder, marginLeft: 2 },
    cardActions: { flexDirection: 'row', gap: 10 },
    editBtn: {
        flex: 1, borderWidth: 1, borderColor: Colors.inputBorder,
        borderRadius: Spacing.inputRadius, paddingVertical: 8, alignItems: 'center',
    },
    editBtnText: { fontSize: FontSizes.small, color: Colors.textSecondary },
    archiveBtn: {
        flex: 1, borderWidth: 1, borderColor: Colors.inputBorder,
        borderRadius: Spacing.inputRadius, paddingVertical: 8, alignItems: 'center',
    },
    archiveBtnText: { fontSize: FontSizes.small, color: Colors.textSecondary },
});