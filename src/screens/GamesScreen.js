import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { Card, Chip, Button } from '../components/UI';
import { colors } from '../theme';

export default function GamesScreen() {
  const nav = useNavigation();
  const { resources } = useApp();
  const [source, setSource] = useState('all');

  const selected = source === 'all' ? null : resources.find((r) => r.id === source);
  const quizCount = (selected ? [selected] : resources).reduce((n, r) => n + (r.quiz?.length || 0), 0);
  const termCount = (selected ? [selected] : resources).reduce((n, r) => n + (r.terms?.length || 0), 0);
  const params = { resourceId: selected?.id };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8, color: colors.text }}>Play with</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 40, marginBottom: 14 }}>
        <Chip label="All content" active={source === 'all'} onPress={() => setSource('all')} />
        {resources.map((r) => (
          <Chip key={r.id} label={r.title} active={source === r.id} onPress={() => setSource(r.id)} />
        ))}
      </ScrollView>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Ionicons name="flash" size={26} color={colors.warn} />
          <Text style={{ fontSize: 18, fontWeight: '800', marginLeft: 8, color: colors.text }}>Quick Quiz</Text>
        </View>
        <Text style={{ color: colors.muted, marginBottom: 10 }}>Answer against the clock. Faster answers earn bonus points. ({quizCount} questions available)</Text>
        <Button title="Start quiz" disabled={quizCount === 0} onPress={() => nav.navigate('QuizGame', params)} />
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Ionicons name="albums" size={26} color={colors.accent} />
          <Text style={{ fontSize: 18, fontWeight: '800', marginLeft: 8, color: colors.text }}>Memory Match</Text>
        </View>
        <Text style={{ color: colors.muted, marginBottom: 10 }}>Match each term with its definition in as few moves as possible. ({termCount} terms available)</Text>
        <Button title="Start matching" variant="accent" disabled={termCount < 3} onPress={() => nav.navigate('MemoryGame', params)} />
      </Card>
    </ScrollView>
  );
}
