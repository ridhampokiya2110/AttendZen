
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Subject } from '@/types';
import { AddSubjectDialog } from './add-subject-dialog';
import { Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface HeaderProps {
  addSubject?: (subject: Omit<Subject, 'id' | 'attended' | 'total'>) => void;
  loading?: boolean;
}

export default function Header({ addSubject, loading }: HeaderProps) {
  const pathname = usePathname();

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-6 flex items-center">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-5 w-24 ml-2" />
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-20" />
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-4">
            {addSubject && <Skeleton className="h-9 w-32" />}
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-6 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg hidden sm:inline-block">AttendZen</span>
          </Link>
        </div>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link href="/" className={cn("transition-colors hover:text-foreground/80 font-medium", pathname === "/" ? "text-foreground" : "text-foreground/60")}>
            Dashboard
          </Link>
          <Link href="/calculator" className={cn("transition-colors hover:text-foreground/80 font-medium", pathname === "/calculator" ? "text-foreground" : "text-foreground/60")}>
            Calculator
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {addSubject && <AddSubjectDialog addSubject={addSubject} />}
        </div>
      </div>
    </header>
  );
}
