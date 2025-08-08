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
  const { 
    subjects,
    loading,
    addSubject: handleAddNewSubject,
    updateSubject: handleSubjectUpdate,
    deleteSubject: handleSubjectDelete 
  } = useSubjects();

  const overallAttendance = React.useMemo(() => {
    const totalClassesAttended = subjects.reduce((total, subject) => total + subject.attended, 0);
    const totalClassesScheduled = subjects.reduce((total, subject) => total + subject.total, 0);
    const attendancePercentage = totalClassesScheduled > 0 
      ? Math.round((totalClassesAttended / totalClassesScheduled) * 100) 
      : 0;
    return attendancePercentage;
  }, [subjects]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onAddSubject={handleAddNewSubject} />
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Your Subjects</CardTitle>
              <BookOpen className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{subjects.length}</div>
              <p className="text-sm text-muted-foreground mt-1">Total enrolled subjects</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Attendance Score</CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overallAttendance}%</div>
              <p className="text-sm text-muted-foreground mt-1">Overall attendance rate</p>
            </CardContent>
          </Card>
          <AITipsCard subjects={subjects} />
        </div>
        
        <AttendanceCharts subjects={subjects} />

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-headline font-semibold tracking-tight">Your Course List</h2>
          </div>
          {subjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {subjects.map(subject => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onUpdate={handleSubjectUpdate}
                  onDelete={handleSubjectDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary/30 p-12 text-center bg-primary/5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold font-headline">Welcome to AttendZen!</h3>
                <p className="mt-2 text-base text-muted-foreground max-w-sm">
                    Get started by adding your first subject using the "Add Subject" button above.
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
