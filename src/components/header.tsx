"use client";

import React from 'react';
import type { Subject } from '@/types';
import { AddSubjectDialog } from './add-subject-dialog';
import { Target } from 'lucide-react';

interface HeaderProps {
  addSubject: (subject: Omit<Subject, 'id' | 'attended' | 'total'>) => void;
}

export default function Header({ addSubject }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Target className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold font-headline text-lg">AttendZen</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <AddSubjectDialog addSubject={addSubject} />
        </div>
      </div>
    </header>
  );
}
