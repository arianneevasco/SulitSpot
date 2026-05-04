import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const deals = [
  {
    id: '1',
    title: 'Sioma rice for 50 pesos with 10 pcs',
    category: 'Food',
    location: 'Near Gate 2',
    price: 50,
    description: 'Busog na busog - sulit talaga for budget students',
  },
  {
    id: '2',
    title: 'Buy after 6PM at Canteen B',
    category: 'Tips',
    location: 'Canteen B',
    time: '6PM',
    description: 'Discounted leftover meals - up to 30pesos off',
  },
  {
    id: '3',
    title: 'Notebook bundle, 100 Pesos',
    category: 'Items',
    location: 'Data',
    price: 100,
    description: 'Notebook bundle',
  },
];

const categories = ['All', 'Food', 'Items', 'Tips'];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>home</Text>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Sulit Spot</Text>
            <Text style={styles.headerSub}>Budget finds near you</Text>
          </View>
          <TouchableOpacity style={styles.avatar}>
            <Ionicons name="person-outline" size={20} color="#4ecba5" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={16} color="#aaa" />
          <TextInput
            placeholder="Search cheap finds"
            style={styles.searchInput}
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.catBtn, cat === 'All' && styles.catBtnActive]}
            >
              <Text style={[styles.catText, cat === 'All' && styles.catTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Finds */}
        <Text style={styles.sectionTitle}>Recent finds</Text>

        {deals.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.category}</Text>
              </View>
            </View>
            <View style={styles.cardMeta}>
              <Ionicons name="location-outline" size={12} color="#aaa" />
              <Text style={styles.metaText}>{item.location}</Text>
              {item.price && (
                <>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>₱ {item.price}</Text>
                </>
              )}
              {item.time && (
                <>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaText}>{item.time}</Text>
                </>
              )}
            </View>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    backgroundColor: '#4ecba5',
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
  },
  body: { flex: 1, paddingHorizontal: 16 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
    marginTop: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#eee',
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 13, color: '#333' },
  categories: { flexDirection: 'row', marginBottom: 16 },
  catBtn: {
    paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: '#ddd',
    marginRight: 8, backgroundColor: '#fff',
  },
  catBtnActive: { backgroundColor: '#4ecba5', borderColor: '#4ecba5' },
  catText: { fontSize: 13, color: '#777' },
  catTextActive: { color: '#fff', fontWeight: '600' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
  card: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#eee',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle: { flex: 1, fontSize: 13, fontWeight: '600', color: '#333', marginRight: 8 },
  badge: { backgroundColor: '#e8f8f3', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 11, color: '#4ecba5', fontWeight: '600' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  metaText: { fontSize: 11, color: '#aaa', marginLeft: 2 },
  metaDot: { fontSize: 11, color: '#aaa', marginHorizontal: 4 },
  cardDesc: { fontSize: 12, color: '#aaa' },
  fab: {
    position: 'absolute', bottom: 80, alignSelf: 'center',
    backgroundColor: '#4ecba5', width: 52, height: 52,
    borderRadius: 26, justifyContent: 'center', alignItems: 'center',
    elevation: 4,
  },
});