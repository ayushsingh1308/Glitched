import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Button, Empty, ProgressBar } from '../components/UI';
import { shuffle } from '../utils/helpers';
import { colors, radius } from '../theme';

const TIME_PER_QUESTION = 15;
const MAX_QUESTIONS = 8;

function buildQuestions(resources, resourceId) {
  const pool = (resourceId ? resources.filter((r) => r.id === resourceId) : resources).flatMap((r) =>
    (r.quiz || []).map((q) => ({ ...q, from: r.title }))
  );
  return shuffle(pool)
    .slice(0, MAX_QUESTIONS)
    .map((q) => {
      const options = shuffle(q.options.map((text, i) => ({ text, correct: i === q.answer })));
      return { q: q.q, from: q.from, options: options.map((o) => o.text), answer: options.findIndex((o) => o.correct) };
    });
}

export default function QuizGameScreen() {
  const nav = useNavigation();
  const { params } = useRoute();
  const { resources, recordGame } = useApp();
  const [questions] = useState(() => buildQuestions(resources, params?.resourceId));

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const nextTimer = useRef(null);

  useEffect(() => () => clearTimeout(nextTimer.current), []);

  const choose = (i) => {
    if (selected !== null || done) return;
    const q = questions[idx];
    const isRight = i === q.answer;
    const newScore = score + (isRight ? 10 + timeLeft : 0);
    const newCorrect = correct + (isRight ? 1 : 0);
    setSelected(i);
    setScore(newScore);
    setCorrect(newCorrect);

    nextTimer.current = setTimeout(() => {
      if (idx + 1 >= questions.length) {
        setDone(true);
        recordGame({ game: 'quiz', points: newScore, detail: { correct: newCorrect, total: questions.length } });
      } else {
        setIdx(idx + 1);
        setSelected(null);
        setTimeLeft(TIME_PER_QUESTION);
      }
    }, 1000);
  };

  // Countdown
  useEffect(() => {
    if (done || selected !== null || !questions.length) return;
    if (timeLeft <= 0) {
      choose(-1); // timed out
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, selected, done]);

  if (!questions.length) return <Empty text="No quiz questions available yet. Ask your educator to add some!" />;

  if (done) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 48 }}>{correct === questions.length ? '🏆' : '🎉'}</Text>
        <Text style={styles.big}>{score} points</Text>
        <Text style={{ color: colors.muted, marginBottom: 20 }}>{correct} / {questions.length} correct</Text>
        <Button title="Play again" onPress={() => nav.replace('QuizGame', params)} style={{ alignSelf: 'stretch', marginBottom: 10 }} />
        <Button title="Back to games" variant="outline" onPress={() => nav.goBack()} style={{ alignSelf: 'stretch' }} />
      </View>
    );
  }

  const q = questions[idx];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ color: colors.muted }}>Question {idx + 1}/{questions.length}</Text>
        <Text style={{ color: timeLeft <= 5 ? colors.danger : colors.primary, fontWeight: '800' }}>⏱ {timeLeft}s</Text>
      </View>
      <ProgressBar value={timeLeft / TIME_PER_QUESTION} />
      <Text style={styles.question}>{q.q}</Text>
      <Text style={{ color: colors.muted, marginBottom: 12, fontSize: 12 }}>From: {q.from}</Text>

      {q.options.map((opt, i) => {
        const isAnswer = i === q.answer;
        const bg = selected === null ? '#fff' : isAnswer ? '#dcfce7' : selected === i ? '#fee2e2' : '#fff';
        const border = selected === null ? colors.border : isAnswer ? colors.success : selected === i ? colors.danger : colors.border;
        return (
          <Pressable key={i} onPress={() => choose(i)} style={[styles.option, { backgroundColor: bg, borderColor: border }]}>
            <Text style={{ fontSize: 16, color: colors.text }}>{opt}</Text>
          </Pressable>
        );
      })}
      <Text style={{ textAlign: 'right', color: colors.primary, fontWeight: '700', marginTop: 8 }}>Score: {score}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.bg },
  big: { fontSize: 34, fontWeight: '800', color: colors.primary },
  question: { fontSize: 20, fontWeight: '700', marginTop: 18, marginBottom: 4, color: colors.text },
  option: { padding: 16, borderRadius: radius, borderWidth: 2, marginBottom: 10 },
});
