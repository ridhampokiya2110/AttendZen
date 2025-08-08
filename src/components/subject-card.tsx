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
  updateSubject: (id: string, newValues: Partial<Omit<Subject, 'id'>>) => void;
  deleteSubject: (id: string) => void;
}

export default function SubjectCard({ subject, updateSubject, deleteSubject }: SubjectCardProps) {
  const { toast } = useToast();
  const attendancePercentage = subject.total > 0 ? Math.round((subject.attended / subject.total) * 100) : 0;
  const isBelowTarget = attendancePercentage < subject.target && subject.total > 0;

  const handlePresent = () => {
    updateSubject(subject.id, { attended: subject.attended + 1, total: subject.total + 1 });
  };

  const handleAbsent = () => {
    updateSubject(subject.id, { total: subject.total + 1 });
  };

  const handleDelete = () => {
    deleteSubject(subject.id);
    toast({
      title: "Subject Deleted",
      description: `"${subject.name}" has been removed.`,
      variant: 'destructive',
    })
  }

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline">{subject.name}</CardTitle>
                <CardDescription>Target: {subject.target}%</CardDescription>
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
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-center mb-4">
          <span className="text-4xl font-bold">{attendancePercentage}</span>
          <span className="text-xl text-muted-foreground">%</span>
        </div>
        <Progress value={attendancePercentage} className={isBelowTarget ? '[&>div]:bg-destructive' : ''} />
        <p className="text-center text-sm text-muted-foreground mt-2">
          {subject.attended} / {subject.total} classes attended
        </p>
      </CardContent>
      <CardFooter className="flex justify-stretch space-x-2">
        <Button variant="outline" className="w-full" onClick={handlePresent}>
            <ArrowUp className="h-4 w-4 mr-2" /> Present
        </Button>
        <Button variant="outline" className="w-full" onClick={handleAbsent}>
            <ArrowDown className="h-4 w-4 mr-2" /> Absent
        </Button>
      </CardFooter>
    </Card>
  );
}
