import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, Chip, Empty } from '../components/UI';
import { colors } from '../theme';

export default function ResourcesScreen() {
  const nav = useNavigation();
  const { resources } = useApp();
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('All');

  const subjects = useMemo(() => ['All', ...new Set(resources.map((r) => r.subject))], [resources]);
  const filtered = resources.filter(
    (r) =>
      (subject === 'All' || r.subject === subject) &&
      (r.title + ' ' + r.description).toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: 16, paddingBottom: 4 }}>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search resources..." style={styles.search} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10, maxHeight: 40 }}>
          {subjects.map((s) => (
            <Chip key={s} label={s} active={s === subject} onPress={() => setSubject(s)} />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Empty text="No resources found." />}
        renderItem={({ item }) => (
          <Card onPress={() => nav.navigate('ResourceDetail', { id: item.id })}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={{ color: colors.muted, marginVertical: 4 }} numberOfLines={2}>{item.description}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={styles.meta}>{item.subject}</Text>
              {item.file && <Ionicons name="attach" size={16} color={colors.muted} />}
              {item.quiz?.length > 0 && <Text style={styles.meta}>🎯 {item.quiz.length} Qs</Text>}
              {item.terms?.length > 0 && <Text style={styles.meta}>🧩 {item.terms.length} terms</Text>}
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border },
  title: { fontWeight: '700', fontSize: 16, color: colors.text },
  meta: { color: colors.primary, fontWeight: '600', fontSize: 12 },
});
