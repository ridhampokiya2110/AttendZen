
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Subject } from '@/types';
import { AddSubjectDialog } from './add-subject-dialog';
import { Target, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  addSubject?: (subject: Omit<Subject, 'id' | 'attended' | 'total'>) => void;
  loading?: boolean;
}

export default function Header({ addSubject, loading: propLoading }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const loading = propLoading || authLoading;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

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
            Calculator
          </Link>
          <Link href="/dashboard" className={cn("transition-colors hover:text-foreground/80 font-medium", pathname === "/dashboard" ? "text-foreground" : "text-foreground/60")}>
            Dashboard
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {pathname === '/dashboard' && addSubject && <AddSubjectDialog addSubject={addSubject} />}
           {user && (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
