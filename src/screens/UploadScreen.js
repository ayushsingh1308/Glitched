import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Button, Card, Chip } from '../components/UI';
import { formatSize, parseTerms } from '../utils/helpers';
import { colors } from '../theme';

const EMPTY_Q = { q: '', options: ['', '', '', ''], answer: 0 };

export default function UploadScreen() {
  const nav = useNavigation();
  const { addResource } = useApp();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [termsText, setTermsText] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [draft, setDraft] = useState(EMPTY_Q);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
      if (!res.canceled && res.assets?.length) {
        const a = res.assets[0];
        setFile({ name: a.name, uri: a.uri, size: a.size, mimeType: a.mimeType });
      }
    } catch (e) {
      Alert.alert('Could not pick file', String(e.message || e));
    }
  };

  const setOption = (i, v) => setDraft((d) => ({ ...d, options: d.options.map((o, idx) => (idx === i ? v : o)) }));

  const addQuestion = () => {
    if (!draft.q.trim() || draft.options.some((o) => !o.trim())) {
      Alert.alert('Incomplete question', 'Enter the question and all four options.');
      return;
    }
    setQuiz((q) => [...q, { q: draft.q.trim(), options: draft.options.map((o) => o.trim()), answer: draft.answer }]);
    setDraft(EMPTY_Q);
  };

  const publish = () => {
    if (!title.trim() || !subject.trim()) {
      Alert.alert('Missing details', 'Title and subject are required.');
      return;
    }
    const terms = parseTerms(termsText);
    if (!file && !description.trim() && !quiz.length && !terms.length) {
      Alert.alert('Nothing to publish', 'Add a description, a file, key terms or quiz questions.');
      return;
    }
    const res = addResource({ title: title.trim(), subject: subject.trim(), description: description.trim(), file, quiz, terms });
    setTitle(''); setSubject(''); setDescription(''); setFile(null); setTermsText(''); setQuiz([]); setDraft(EMPTY_Q);
    nav.navigate('ResourceDetail', { id: res.id });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.h}>Content</Text>
        <TextInput style={styles.input} placeholder="Title *" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Subject * (e.g. Science)" value={subject} onChangeText={setSubject} />
        <TextInput style={[styles.input, { height: 90 }]} placeholder="Description / notes" value={description} onChangeText={setDescription} multiline textAlignVertical="top" />

        <Button title={file ? 'Change file' : 'Attach file (PDF, image, doc...)'} variant="outline" onPress={pickFile} />
        {file && <Text style={{ marginTop: 6, color: colors.muted }}>📎 {file.name} {formatSize(file.size)}</Text>}

        <Text style={styles.h}>Key terms (for Memory Match)</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder={'One per line:\nterm = short definition'}
          value={termsText}
          onChangeText={setTermsText}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.h}>Quiz questions ({quiz.length})</Text>
        {quiz.map((q, i) => (
          <Card key={i} style={{ padding: 12 }}>
            <Text style={{ fontWeight: '600', color: colors.text }}>{i + 1}. {q.q}</Text>
            <Text style={{ color: colors.success }}>✔ {q.options[q.answer]}</Text>
            <Text style={{ color: colors.danger, marginTop: 4 }} onPress={() => setQuiz((l) => l.filter((_, idx) => idx !== i))}>Remove</Text>
          </Card>
        ))}

        <Card>
          <TextInput style={styles.input} placeholder="Question" value={draft.q} onChangeText={(v) => setDraft((d) => ({ ...d, q: v }))} />
          {draft.options.map((o, i) => (
            <TextInput key={i} style={styles.input} placeholder={`Option ${i + 1}`} value={o} onChangeText={(v) => setOption(i, v)} />
          ))}
          <Text style={{ color: colors.muted, marginBottom: 6 }}>Correct option:</Text>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            {[0, 1, 2, 3].map((i) => (
              <Chip key={i} label={`${i + 1}`} active={draft.answer === i} onPress={() => setDraft((d) => ({ ...d, answer: i }))} />
            ))}
          </View>
          <Button title="Add question" variant="accent" onPress={addQuestion} />
        </Card>

        <Button title="Publish" onPress={publish} style={{ marginTop: 6, marginBottom: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  h: { fontSize: 17, fontWeight: '700', marginTop: 16, marginBottom: 8, color: colors.text },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
});
