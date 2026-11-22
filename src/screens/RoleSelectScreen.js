import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Button, Card } from '../components/UI';
import { colors } from '../theme';

const ROLES = [
  { id: 'student', icon: 'school', title: "I'm a Student", desc: 'Browse resources, play games, earn points' },
  { id: 'educator', icon: 'easel', title: "I'm an Educator", desc: 'Upload learning content and quizzes' },
];

export default function RoleSelectScreen() {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={styles.logo}>GlitchED | Link</Text>
        <Text style={styles.tag}>Learn it. Play it. Own it.</Text>

        <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor="#a78bfa" style={styles.input} />

        {ROLES.map((r) => (
          <Card key={r.id} onPress={() => setRole(r.id)} style={[styles.role, role === r.id && styles.roleActive]}>
            <Ionicons name={r.icon} size={28} color={colors.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.roleTitle}>{r.title}</Text>
              <Text style={{ color: colors.muted }}>{r.desc}</Text>
            </View>
            {role === r.id && <Ionicons name="checkmark-circle" size={24} color={colors.success} />}
          </Card>
        ))}

        <Button title="Continue" disabled={!name.trim()} onPress={() => login(name, role)} variant="accent" style={{ marginTop: 8 }} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  logo: { fontSize: 34, fontWeight: '800', color: '#fff', textAlign: 'center' },
  tag: { color: '#ddd6fe', textAlign: 'center', marginBottom: 24, marginTop: 4 },
  input: { backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 16, marginBottom: 16 },
  role: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  roleActive: { borderColor: colors.accent },
  roleTitle: { fontWeight: '700', fontSize: 16, color: colors.text },
});
