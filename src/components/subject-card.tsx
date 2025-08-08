"use client";

import type { Subject } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubjectCardProps {
  subject: Subject;
  onUpdate: (id: string, newValues: Partial<Omit<Subject, 'id'>>) => void;
  onDelete: (id: string) => void;
}

export default function SubjectCard({ subject, onUpdate, onDelete }: SubjectCardProps) {
  const { toast } = useToast();
  const attendanceRate = subject.total > 0 ? Math.round((subject.attended / subject.total) * 100) : 0;
  const isAttendanceBelowTarget = attendanceRate < subject.target && subject.total > 0;

  const markPresent = () => {
    onUpdate(subject.id, { 
      attended: subject.attended + 1, 
      total: subject.total + 1 
    });
  };

  const markAbsent = () => {
    onUpdate(subject.id, { 
      total: subject.total + 1 
    });
  };

  const handleDeleteClick = () => {
    onDelete(subject.id);
    toast({
      title: "Subject Removed",
      description: `${subject.name} has been removed from your list.`,
      variant: 'destructive',
    })
  }

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg hover:shadow-primary/10 border-secondary/20">
      <CardHeader className="bg-secondary/5">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-lg text-foreground font-semibold">{subject.name}</CardTitle>
                <CardDescription className="text-muted-foreground">Target: {subject.target}%</CardDescription>
            </div>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                    <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the subject "{subject.name}" and all its attendance data. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteClick} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-center mb-4">
          <span className="text-4xl font-bold">{attendanceRate}</span>
          <span className="text-xl text-muted-foreground">%</span>
        </div>
        <Progress 
          value={attendanceRate} 
          className={isAttendanceBelowTarget ? '[&>div]:bg-destructive' : '[&>div]:bg-emerald-500'} 
        />
        <p className="text-center text-sm text-muted-foreground mt-2">
          {subject.attended} of {subject.total} classes attended
        </p>
      </CardContent>
      <CardFooter className="flex justify-stretch space-x-2">
        <Button variant="success" className="w-full group" onClick={markPresent}>
            <ArrowUp className="h-4 w-4 group-hover:scale-110 transition-transform" /> Present
        </Button>
        <Button variant="danger" className="w-full group" onClick={markAbsent}>
            <ArrowDown className="h-4 w-4 group-hover:scale-110 transition-transform" /> Absent
        </Button>
      </CardFooter>
    </Card>
  );
}
