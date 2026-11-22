import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Button, Card, ProgressBar } from '../components/UI';
import { levelProgress } from '../utils/helpers';
import { colors } from '../theme';

export default function HomeScreen() {
  const nav = useNavigation();
  const { user, resources, points, level, history } = useApp();
  const isEducator = user.role === 'educator';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.hello}>Hi, {user.name} 👋</Text>
      <Text style={{ color: colors.muted, marginBottom: 14 }}>{isEducator ? 'Share knowledge and keep students engaged.' : 'Ready to learn something practical today?'}</Text>

      <Card>
        <View style={styles.row}>
          <Stat label="Level" value={level} />
          <Stat label="Points" value={points} />
          <Stat label="Games" value={history.length} />
        </View>
        <Text style={{ color: colors.muted, marginVertical: 6, fontSize: 12 }}>{100 - (points % 100)} points to level {level + 1}</Text>
        <ProgressBar value={levelProgress(points)} />
      </Card>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
        <Button title="Play a game" onPress={() => nav.navigate('Games')} style={{ flex: 1 }} />
        <Button title={isEducator ? 'Upload content' : 'Browse'} variant="outline" onPress={() => nav.navigate(isEducator ? 'Upload' : 'Resources')} style={{ flex: 1 }} />
      </View>

      <Text style={styles.section}>Latest resources</Text>
      {resources.slice(0, 3).map((r) => (
        <Card key={r.id} onPress={() => nav.navigate('ResourceDetail', { id: r.id })}>
          <Text style={styles.title}>{r.title}</Text>
          <Text style={{ color: colors.muted }}>{r.subject} · by {r.author}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const Stat = ({ label, value }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Text style={{ fontSize: 26, fontWeight: '800', color: colors.primary }}>{value}</Text>
    <Text style={{ color: colors.muted }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  hello: { fontSize: 24, fontWeight: '800', color: colors.text },
  row: { flexDirection: 'row' },
  section: { fontSize: 17, fontWeight: '700', marginBottom: 8, color: colors.text },
  title: { fontWeight: '700', fontSize: 16, color: colors.text },
});
