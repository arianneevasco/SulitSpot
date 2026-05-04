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
            {/* Header */}
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
                            {item.price && (
                                <>
                                    <Ionicons name="pricetag-outline" size={12} color={Colors.placeholder} style={{ marginLeft: 8 }} />
                                    <Text style={styles.metaText}>₱ {item.price}</Text>
                                </>
                            )}
                            {item.time && (
                                <>
                                    <Ionicons name=