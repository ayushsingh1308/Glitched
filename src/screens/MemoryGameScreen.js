import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Button, Empty } from '../components/UI';
import { shuffle } from '../utils/helpers';
import { colors, radius } from '../theme';

const MAX_PAIRS = 5;

function buildCards(resources, resourceId) {
  const pool = (resourceId ? resources.filter((r) => r.id === resourceId) : resources).flatMap((r) => r.terms || []);
  const pairs = shuffle(pool).slice(0, MAX_PAIRS);
  const cards = pairs.flatMap((p, i) => [
    { id: `t${i}`, pair: i, text: p.term, kind: 'term' },
    { id: `d${i}`, pair: i, text: p.definition, kind: 'def' },
  ]);
  return { cards: shuffle(cards), pairs: pairs.length };
}

export default function MemoryGameScreen() {
  const nav = useNavigation();
  const { params } = useRoute();
  const { resources, recordGame } = useApp();
  const [{ cards, pairs }] = useState(() => buildCards(resources, params?.resourceId));

  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [points, setPoints] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const flip = (card) => {
    if (locked || flipped.includes(card.id) || matched.includes(card.id)) return;
    const next = [...flipped, card.id];
    setFlipped(next);
    if (next.length < 2) return;

    const newMoves = moves + 1;
    setMoves(newMoves);
    const [a, b] = next.map((id) => cards.find((c) => c.id === id));

    if (a.pair === b.pair) {
      const newMatched = [...matched, a.id, b.id];
      setMatched(newMatched);
      setFlipped([]);
      if (newMatched.length === cards.length) {
        const pts = Math.max(10, 60 - (newMoves - pairs) * 5);
        setPoints(pts);
        recordGame({ game: 'memory', points: pts, detail: { moves: newMoves, pairs } });
      }
    } else {
      setLocked(true);
      timer.current = setTimeout(() => {
        setFlipped([]);
        setLocked(false);
      }, 900);
    }
  };

  if (pairs < 3) return <Empty text="Not enough key terms yet. Ask your educator to add some!" />;

  if (points !== null) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 48 }}>🧠</Text>
        <Text style={styles.big}>{points} points</Text>
        <Text style={{ color: colors.muted, marginBottom: 20 }}>Finished in {moves} moves</Text>
        <Button title="Play again" onPress={() => nav.replace('MemoryGame', params)} style={{ alignSelf: 'stretch', marginBottom: 10 }} />
        <Button title="Back to games" variant="outline" onPress={() => nav.goBack()} style={{ alignSelf: 'stretch' }} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 12 }}>
      <Text style={{ textAlign: 'center', color: colors.muted, marginBottom: 10 }}>Moves: {moves} · Matched: {matched.length / 2}/{pairs}</Text>
      <View style={styles.grid}>
        {cards.map((c) => {
          const open = flipped.includes(c.id) || matched.includes(c.id);
          const done = matched.includes(c.id);
          return (
            <Pressable key={c.id} onPress={() => flip(c)} style={[styles.card, open ? (done ? styles.done : styles.open) : styles.closed]}>
              <Text style={[styles.text, c.kind === 'term' && open && { fontWeight: '800' }, !open && { fontSize: 24, color: '#fff' }]} numberOfLines={5}>
                {open ? c.text : '?'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.bg },
  big: { fontSize: 34, fontWeight: '800', color: colors.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', minHeight: 96, borderRadius: radius, padding: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  closed: { backgroundColor: colors.primary },
  open: { backgroundColor: '#fff', borderWidth: 2, borderColor: colors.accent },
  done: { backgroundColor: '#dcfce7', borderWidth: 2, borderColor: colors.success },
  text: { textAlign: 'center', color: colors.text, fontSize: 13 },
});
