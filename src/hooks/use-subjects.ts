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

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isBrowser) {
      try {
        const storedSubjects = localStorage.getItem('subjects');
        if (storedSubjects) {
          setSubjects(JSON.parse(storedSubjects));
        } else {
            setSubjects(initialSubjects);
        }
      } catch (error) {
        console.error("Failed to parse subjects from localStorage", error);
        setSubjects(initialSubjects);
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isBrowser && !loading) {
      localStorage.setItem('subjects', JSON.stringify(subjects));
    }
  }, [subjects, loading]);

  const addSubject = useCallback((subject: Omit<Subject, 'id' | 'attended' | 'total'>) => {
    setSubjects(prev => [
      ...prev,
      {
        ...subject,
        id: new Date().toISOString(),
        attended: 0,
        total: 0,
      }
    ]);
  }, []);

  const updateSubject = useCallback((id: string, newValues: Partial<Omit<Subject, 'id'>>) => {
    setSubjects(prev =>
      prev.map(s => (s.id === id ? { ...s, ...newValues } : s))
    );
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  return { subjects, loading, addSubject, updateSubject, deleteSubject };
}
