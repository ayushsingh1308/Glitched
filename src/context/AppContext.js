import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEED_RESOURCES } from '../data/seed';
import { uid, levelFromPoints } from '../utils/helpers';

const STORAGE_KEY = 'glitched-link:v1';
const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null); // { name, role: 'student' | 'educator' }
  const [resources, setResources] = useState(SEED_RESOURCES);
  const [history, setHistory] = useState([]); // [{ id, game, points, detail, at }]

  // Load persisted state once.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const d = JSON.parse(raw);
          setUser(d.user ?? null);
          setResources(d.resources ?? SEED_RESOURCES);
          setHistory(d.history ?? []);
        }
      } catch (e) {
        console.warn('Failed to load saved data', e);
      }
      setReady(true);
    })();
  }, []);

  // Persist on change.
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, resources, history })).catch(() => {});
  }, [ready, user, resources, history]);

  const login = useCallback((name, role) => setUser({ name: name.trim(), role }), []);
  const logout = useCallback(() => setUser(null), []);

  const addResource = useCallback(
    (data) => {
      const res = { id: uid(), createdAt: new Date().toISOString(), author: user?.name ?? 'Educator', ...data };
      setResources((r) => [res, ...r]);
      return res;
    },
    [user]
  );

  const deleteResource = useCallback((id) => setResources((r) => r.filter((x) => x.id !== id)), []);

  const recordGame = useCallback((entry) => {
    setHistory((h) => [{ id: uid(), at: new Date().toISOString(), ...entry }, ...h]);
  }, []);

  const points = useMemo(() => history.reduce((s, h) => s + h.points, 0), [history]);
  const level = levelFromPoints(points);

  const badges = useMemo(() => {
    const list = [
      { id: 'first', icon: 'footsteps', label: 'First Steps', desc: 'Play your first game', earned: history.length >= 1 },
      { id: 'perfect', icon: 'ribbon', label: 'Perfect Score', desc: 'Answer every quiz question correctly', earned: history.some((h) => h.game === 'quiz' && h.detail?.correct === h.detail?.total && h.detail?.total > 0) },
      { id: 'memory', icon: 'albums', label: 'Memory Master', desc: 'Finish Memory Match in few moves', earned: history.some((h) => h.game === 'memory' && h.detail?.moves <= (h.detail?.pairs ?? 0) + 3) },
      { id: 'scholar', icon: 'school', label: 'Scholar', desc: 'Earn 100 points', earned: points >= 100 },
    ];
    if (user?.role === 'educator') {
      list.push({ id: 'contrib', icon: 'cloud-upload', label: 'Contributor', desc: 'Upload your own content', earned: resources.some((r) => r.author === user.name && !r.id.startsWith('seed-')) });
    }
    return list;
  }, [history, points, resources, user]);

  const value = { ready, user, login, logout, resources, addResource, deleteResource, history, recordGame, points, level, badges };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
