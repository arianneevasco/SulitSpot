import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, FontSizes, Spacing } from '@/constants/theme';

const categories = ['Food', 'Items', 'Tips'];

export default function EditPostScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('Siomai rice for 50 pesos with 10 pcs');
  const [selectedCategory, setSelectedCategory] = useState('Food');
  const [price, setPrice] = useState('50');
  const [location, setLocation] = useState('Near Gate 2');
  const [description, setDescription] = useState('Busog na busog ang portion — sulit talaga para sa mga budget students.');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    setSubmitting(true);
    try {
      Alert.alert('Success', 'Post updated successfully.');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to update post.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmAccuracy = async () => {
    setSubmitting(true);
    try {
      Alert.alert('Success', 'Post marked as accurate.');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to confirm accuracy.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.topLabel}>edit post</Text>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={Colors.textPrimary} />
          <Text style={styles.backText}>Edit Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>

        {/* Title */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={Colors.placeholder}
        />

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
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholderTextColor={Colors.placeholder}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholderTextColor={Colors.placeholder}
            />
          </View>
        </View>

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={Colors.placeholder}
          multiline
          numberOfLines={3}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, submitting && styles.btnDisabled]}
          onPress={handleSave}
          disabled={submitting}
        >
          <Text style={styles.saveBtnText}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        {/* Still Accurate Button */}
        <TouchableOpacity
          style={[styles.accurateBtn, submitting && styles.btnDisabled]}
          onPress={handleConfirmAccuracy}
          disabled={submitting}
        >
          <Ionicons name="checkmark-circle-outline" size={16} color={Colors.primary} />
          <Text style={styles.accurateBtnText}>Still accurate</Text>
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
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: Spacing.buttonRadius,
    paddingVertical: 14, alignItems: 'center', marginTop: 20,
  },
  saveBtnText: { color: Colors.white, fontWeight: '600', fontSize: FontSizes.label },
  accurateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.primary, borderRadius: Spacing.buttonRadius,
    paddingVertical: 12, marginTop: 12, gap: 6,
  },
  accurateBtnText: { color: Colors.primary, fontWeight: '600', fontSize: FontSizes.label },
  btnDisabled: { opacity: 0.5 },
});