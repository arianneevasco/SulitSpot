import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '@/constants/theme';

type PostCardProps = {
    id: string;
    title: string;
    category: string;
    location: string;
    price?: number;
    time?: string;
    rating?: number;
    onPress?: () => void;
};

export default function PostCard({
    title,
    category,
    location,
    price,
    time,
    rating,
    onPress,
}: PostCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
            <View style={styles.cardTop}>
                <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{category}</Text>
                </View>
            </View>

            <View style={styles.cardMeta}>
                <Ionicons name="location-outline" size={12} color={Colors.placeholder} />
                <Text style={styles.metaText}>{location}</Text>

                {price !== undefined && (
                    <>
                        <Ionicons name="pricetag-outline" size={12} color={Colors.placeholder} style={styles.metaIcon} />
                        <Text style={styles.metaText}>₱{price}</Text>
                    </>
                )}

                {time !== undefined && (
                    <>
                        <Ionicons name="time-outline" size={12} color={Colors.placeholder} style={styles.metaIcon} />
                        <Text style={styles.metaText}>{time}</Text>
                    </>
                )}
            </View>

            {rating !== undefined && (
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#f5a623" />
                    <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: Spacing.cardPadding,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.inputBorder,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    cardTitle: {
        flex: 1,
        fontSize: FontSizes.body,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginRight: 8,
    },
    badge: {
        backgroundColor: '#e8f8f3',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    badgeText: {
        fontSize: FontSizes.small,
        color: Colors.primary,
        fontWeight: '600',
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    metaText: {
        fontSize: FontSizes.small,
        color: Colors.placeholder,
        marginLeft: 2,
    },
    metaIcon: {
        marginLeft: 8,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: FontSizes.small,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
});