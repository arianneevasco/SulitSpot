import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, Spacing } from '@/constants/theme';

const categories = ['Food', 'Items', 'Tips'];

export default function AddPostScreen() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('Food');

    return (
        <View style={styles.container}>
            <Text style={styles.topLabel}>posts</Text>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={20} color="#333" />
                    <Text style={styles.backText}>New Post</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

                {/* Title */}
                <Text style={styles.label}>Title</Text>
                <TextInput style={styles.input} placeholder="e.g Siomai rice" placeholderTextColor={Colors.placeholder} />

                {/* Category */}
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryRow}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.catBtn, selectedCategory === cat && styles.catBtnActive]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Price & Location */}
                <View style={styles.row}>
                    <View style={styles.halfField}>
                        <Text style={styles.label}>Price range</Text>
                        <TextInput style={styles.input} placeholder="e.g 40-50" placeholderTextColor={Colors.placeholder} keyboardType="numeric" />
                    </View>
                    <View style={styles.halfField}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput style={styles.input} placeholder="e.g Near Gate 2" placeholderTextColor={Colors.placeholder} />
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholderTextColor={Colors.placeholder}
                    multiline
                    numberOfLines={3}
                />

                {/* Photo */}
                <Text style={styles.label}>Photo(Optional)</Text>
                <TouchableOpacity style={styles.uploadBox}>
                    <Ionicons name="camera-outline" size={22} color={Colors.placeholder} />
                    <Text style={styles.uploadText}>Camera or Gallery</Text>
                </TouchableOpacity>

                {/* Map Pin */}
                <Text style={styles.label}>Map pin (Optional)</Text>
                <TouchableOpacity style={styles.mapBox}>
                    <Text style={styles.mapText}>Tap to drop a pin</Text>
                </TouchableOpacity>

                {/* Submit */}
                <TouchableOpacity style={styles.submitBtn}>
                    <Text style={styles.submitText}>Share this find</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.white },
    topLabel: { paddingTop: 52, paddingLeft: 20, fontSize: FontSizes.small, color: Colors.placeholder, marginBottom: 8 },
    header: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 20,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center' },
    backText: { fontSize: FontSizes.label, fontWeight: '600', color: Colors.textPrimary, marginLeft: 4 },
    body: { paddingHorizontal: 20 },
    label: { fontSize: FontSizes.small, color: Colors.textSecondary, marginBottom: 6, marginTop: 12 },
    input: {
        borderWidth: 1, borderColor: Colors.inputBorder, borderRadius: Spacing.inputRadius,
        padding: Spacing.inputPadding, fontSize: FontSizes.small, color: Colors.textPrimary, backgroundColor: Colors.white,
    },
    textArea: { height: 80, textAlignVertical: 'top' },
    categoryRow: { flexDirection: 'row', gap: 10 },
    catBtn: {
        flex: 1, paddingVertical: 8, borderRadius: Spacing.inputRadius,
        borderWidth: 1, borderColor: Colors.inputBorder, alignItems: 'center',
        backgroundColor: Colors.white,
    },
    catBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    catText: { fontSize: FontSizes.small, color: Colors.textSecondary },
    catTextActive: { color: Colors.white, fontWeight: '600' },
    row: { flexDirection: 'row', gap: 12 },
    halfField: { flex: 1 },
    uploadBox: {
        borderWidth: 1, borderColor: Colors.inputBorder, borderRadius: Spacing.inputRadius, borderStyle: 'dashed',
        paddingVertical: 20, alignItems: 'center', gap: 6,
    },
    uploadText: { fontSize: FontSizes.small, color: Colors.placeholder },
    mapBox: {
        borderWidth: 1, borderColor: Colors.inputBorder, borderRadius: Spacing.inputRadius,
        paddingVertical: 28, alignItems: 'center',
    },
    mapText: { fontSize: FontSizes.small, color: Colors.placeholder },
    submitBtn: {
        backgroundColor: Colors.primary, borderRadius: Spacing.buttonRadius,
        paddingVertical: 14, alignItems: 'center', marginTop: 20,
    },
    submitText: { color: Colors.white, fontWeight: '600', fontSize: FontSizes.label },
});