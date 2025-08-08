"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Subject } from '@/types';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const subjectSchema = z.object({
  name: z.string().min(2, { message: 'Subject name must be at least 2 characters.' }),
  target: z.coerce.number().min(1, 'Target must be at least 1').max(100, 'Target cannot exceed 100'),
});

interface AddSubjectDialogProps {
  addSubject: (subject: Omit<Subject, 'id' | 'attended' | 'total'>) => void;
}

export function AddSubjectDialog({ addSubject }: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      target: 85,
    },
  });

  function onSubmit(values: z.infer<typeof subjectSchema>) {
    addSubject(values);
    toast({
      title: "Subject Added",
      description: `"${values.name}" has been added to your list.`,
    })
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Subject</DialogTitle>
          <DialogDescription>
            Enter the details for your new subject. You can start logging attendance right away.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Advanced AI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendance Target (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 85" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Subject</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
