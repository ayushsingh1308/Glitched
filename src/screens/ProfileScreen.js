import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Button, Card, ProgressBar } from '../components/UI';
import { DEMO_PLAYERS } from '../data/seed';
import { levelProgress } from '../utils/helpers';
import { colors } from '../theme';

export default function ProfileScreen() {
  const { user, logout, points, level, badges, history } = useApp();

  const board = [...DEMO_PLAYERS, { name: `${user.name} (you)`, points }].sort((a, b) => b.points - a.points);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Card>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>{user.name}</Text>
        <Text style={{ color: colors.muted, marginBottom: 10, textTransform: 'capitalize' }}>{user.role} · Level {level} · {points} pts</Text>
        <ProgressBar value={levelProgress(points)} />
      </Card>

      <Text style={{ fontSize: 17, fontWeight: '700', marginVertical: 8, color: colors.text }}>Badges</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {badges.map((b) => (
          <Card key={b.id} style={{ width: '48%', alignItems: 'center', opacity: b.earned ? 1 : 0.45 }}>
            <Ionicons name={b.icon} size={30} color={b.earned ? colors.warn : colors.muted} />
            <Text style={{ fontWeight: '700', marginTop: 4, color: colors.text }}>{b.label}</Text>
            <Text style={{ color: colors.muted, fontSize: 12, textAlign: 'center' }}>{b.desc}</Text>
          </Card>
        ))}
      </View>

      <Text style={{ fontSize: 17, fontWeight: '700', marginVertical: 8, color: colors.text }}>Leaderboard (demo)</Text>
      <Card>
        {board.map((p, i) => (
          <View key={p.name} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
            <Text style={{ color: colors.text, fontWeight: p.name.includes('(you)') ? '800' : '400' }}>{i + 1}. {p.name}</Text>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>{p.points}</Text>
          </View>
        ))}
      </Card>

      <Text style={{ fontSize: 17, fontWeight: '700', marginVertical: 8, color: colors.text }}>Recent activity</Text>
      <Card>
        {history.length === 0 && <Text style={{ color: colors.muted }}>No games played yet.</Text>}
        {history.slice(0, 5).map((h) => (
          <Text key={h.id} style={{ color: colors.text, paddingVertical: 3 }}>
            {h.game === 'quiz' ? '⚡ Quick Quiz' : '🧩 Memory Match'} · +{h.points} pts
          </Text>
        ))}
      </Card>

      <Button title="Switch user" variant="outline" onPress={logout} style={{ marginVertical: 16 }} />
    </ScrollView>
  );
}
