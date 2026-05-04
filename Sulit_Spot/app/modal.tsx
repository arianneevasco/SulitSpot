import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, FontSizes, Spacing } from '@/constants/theme';

const categories = ['All', 'Food', 'Items', 'Tips'];

export default function FilterModal() {
  const router = useRouter();
  const [selected, setSelected] = useState('All');

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>

        {/* Title */}
        <Text style={styles.title}>Filter Posts</Text>

        {/* Category Options */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, selected === cat && styles.catBtnActive]}
              onPress={() => setSelected(cat)}
            >
              <Text style={[styles.catText, selected === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Apply Button */}
        <TouchableOpacity style={styles.applyBtn} onPress={() => router.back()}>
          <Text style={styles.applyText}>Apply Filter</Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  title: { fontSize: FontSizes.heading, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  label: { fontSize: FontSizes.small, color: Colors.textSecondary, marginBottom: 8 },
  categoryRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  catBtn: {
    flex: 1, paddingVertical: 8, borderRadius: Spacing.inputRadius,
    borderWidth: 1, borderColor: Colors.inputBorder, alignItems: 'center',
  },
  catBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catText: { fontSize: FontSizes.small, color: Colors.textSecondary },
  catTextActive: { color: Colors.white, fontWeight: '600' },
  applyBtn: {
    backgroundColor: Colors.primary, borderRadius: Spacing.buttonRadius,
    paddingVertical: 14, alignItems: 'center', marginBottom: 12,
  },
  applyText: { color: Colors.white, fontWeight: '600', fontSize: FontSizes.label },
  cancelBtn: { alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: Colors.textSecondary, fontSize: FontSizes.label },
});