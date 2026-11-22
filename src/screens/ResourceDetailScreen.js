import React from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Button, Card, Empty } from '../components/UI';
import { formatSize } from '../utils/helpers';
import { colors } from '../theme';

export default function ResourceDetailScreen() {
  const nav = useNavigation();
  const { params } = useRoute();
  const { resources, user, deleteResource } = useApp();
  const res = resources.find((r) => r.id === params.id);

  if (!res) return <Empty text="This resource no longer exists." />;

  const openFile = async () => {
    try {
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(res.file.uri);
      else Alert.alert('Not supported', 'Opening files is not supported on this device.');
    } catch (e) {
      Alert.alert('Could not open file', String(e.message || e));
    }
  };

  const confirmDelete = () =>
    Alert.alert('Delete resource', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteResource(res.id); nav.goBack(); } },
    ]);

  const canDelete = user.role === 'educator' && res.author === user.name;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>{res.title}</Text>
      <Text style={{ color: colors.primary, fontWeight: '600', marginVertical: 4 }}>{res.subject} · by {res.author}</Text>
      <Card style={{ marginTop: 10 }}>
        <Text style={{ color: colors.text, lineHeight: 22 }}>{res.description || 'No description provided.'}</Text>
      </Card>

      {res.file && (
        <Card>
          <Text style={{ fontWeight: '700', color: colors.text }}>📎 {res.file.name}</Text>
          <Text style={{ color: colors.muted, marginBottom: 8 }}>{formatSize(res.file.size)}</Text>
          <Button title="Open attachment" variant="outline" onPress={openFile} />
        </Card>
      )}

      {res.terms?.length > 0 && (
        <Card>
          <Text style={{ fontWeight: '700', marginBottom: 6, color: colors.text }}>Key terms</Text>
          {res.terms.map((t, i) => (
            <Text key={i} style={{ marginBottom: 4, color: colors.text }}>
              <Text style={{ fontWeight: '700' }}>{t.term}</Text> – {t.definition}
            </Text>
          ))}
        </Card>
      )}

      <View style={{ gap: 10, marginTop: 4 }}>
        {res.quiz?.length > 0 && <Button title={`Play quiz (${res.quiz.length} questions)`} onPress={() => nav.navigate('QuizGame', { resourceId: res.id })} />}
        {res.terms?.length >= 3 && <Button title="Play Memory Match" variant="accent" onPress={() => nav.navigate('MemoryGame', { resourceId: res.id })} />}
        {canDelete && <Button title="Delete resource" variant="danger" onPress={confirmDelete} />}
      </View>
    </ScrollView>
  );
}
