"use client";

import React from 'react';
import { useSubjects } from '@/hooks/use-subjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Target, Users } from 'lucide-react';
import Header from '@/components/header';
import SubjectCard from '@/components/subject-card';
import AttendanceCharts from '@/components/attendance-charts';
import AITipsCard from '@/components/ai-tips-card';

export default function Dashboard() {
  const { subjects, loading, addSubject, updateSubject, deleteSubject } = useSubjects();

  const overallAttendance = React.useMemo(() => {
    const totalAttended = subjects.reduce((acc, s) => acc + s.attended, 0);
    const totalClasses = subjects.reduce((acc, s) => acc + s.total, 0);
    return totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
  }, [subjects]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header addSubject={addSubject} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallAttendance}%</div>
            </CardContent>
          </Card>
          <AITipsCard subjects={subjects} />
        </div>
        
        <AttendanceCharts subjects={subjects} />

        <div>
          <h2 className="text-3xl font-headline font-semibold tracking-tight mb-6">My Subjects</h2>
          {subjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {subjects.map(subject => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  updateSubject={updateSubject}
                  deleteSubject={deleteSubject}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold font-headline">No Subjects Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    Click "Add Subject" to get started.
                </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
            <Skeleton className="h-8 w-24" />
            <div className="flex flex-1 items-center justify-end space-x-4">
                <Skeleton className="h-9 w-32" />
            </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-80" />
        <div>
          <Skeleton className="h-9 w-48 mb-6" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
          </div>
        </div>
      </main>
    </div>
  );
}
