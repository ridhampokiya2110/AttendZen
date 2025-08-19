
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Subject } from '@/types';

const isBrowser = typeof window !== 'undefined';

const initialSubjects: Subject[] = [
    { id: '1', name: 'Quantum Physics', attended: 18, total: 20, target: 90 },
    { id: '2', name: 'Organic Chemistry', attended: 22, total: 25, target: 85 },
    { id: '3', name: 'Advanced Calculus', attended: 12, total: 15, target: 80 },
    { id: '4', name: 'World History', attended: 30, total: 35, target: 90 },
];

export function useSubjects(userId?: string) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  
  const storageKey = userId ? `subjects_${userId}` : 'subjects_guest';

  useEffect(() => {
    if (isBrowser && userId) {
      try {
        const storedSubjects = localStorage.getItem(storageKey);
        if (storedSubjects) {
          setSubjects(JSON.parse(storedSubjects));
        } else {
          // For a new logged-in user, start with an empty list
          // or you could provide some default subjects.
          setSubjects([]);
        }
      } catch (error) {
        console.error("Failed to parse subjects from localStorage", error);
        setSubjects([]);
      }
      setLoading(false);
    } else if (isBrowser && !userId) {
       // Handle guest user - maybe show nothing or sample data
       setSubjects([]);
       setLoading(false);
    }
  }, [userId, storageKey]);

  useEffect(() => {
    if (isBrowser && !loading && userId) {
      localStorage.setItem(storageKey, JSON.stringify(subjects));
    }
  }, [subjects, loading, userId, storageKey]);

  const addSubject = useCallback((subject: Omit<Subject, 'id' | 'attended' | 'total'>) => {
    if (!userId) return; // Prevent adding subjects if not logged in
    setSubjects(prev => [
      ...prev,
      {
        ...subject,
        id: new Date().toISOString(),
        attended: 0,
        total: 0,
      }
    ]);
  }, [userId]);

  const updateSubject = useCallback((id: string, newValues: Partial<Omit<Subject, 'id'>>) => {
    if (!userId) return;
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, ...newValues } : s))
    );
  }, [userId]);

  const deleteSubject = useCallback((id: string) => {
    if (!userId) return;
    setSubjects(prev => prev.filter(s => s.id !== id));
  }, [userId]);

  return { subjects, loading, addSubject, updateSubject, deleteSubject };
}
