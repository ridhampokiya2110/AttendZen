"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Lightbulb } from 'lucide-react';
import type { Subject } from '@/types';
import { generateAttendanceTips, type GenerateAttendanceTipsOutput } from '@/ai/flows/generate-attendance-tips';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Skeleton } from './ui/skeleton';

interface AITipsCardProps {
  subjects: Subject[];
}

export default function AITipsCard({ subjects }: AITipsCardProps) {
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState<GenerateAttendanceTipsOutput['tips']>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateTips = async () => {
    setLoading(true);
    setError(null);
    setTips([]);
    try {
      const input = {
        attendanceData: subjects.map(s => ({
          subject: s.name,
          attended: s.attended,
          total: s.total,
          targetAttendance: s.target,
        })),
      };
      const result = await generateAttendanceTips(input);
      setTips(result.tips);
    } catch (e) {
      setError('Failed to generate tips. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Attendance Coach</CardTitle>
        <Bot className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">Get Smart Tips</div>
        <p className="text-xs text-muted-foreground">
          AI-powered advice to help you reach your goals.
        </p>
        <Button onClick={handleGenerateTips} disabled={loading} size="sm" className="mt-4 w-full">
          {loading ? 'Generating...' : 'Generate Tips'}
        </Button>
        <div className="mt-4 space-y-2">
          {loading && <Skeleton className="h-20 w-full" />}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {tips.length > 0 && (
             <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle className="font-headline">Your Personalized Tips!</AlertTitle>
                <AlertDescription>
                   <ul className="list-disc pl-5 space-y-1 mt-2">
                     {tips.map((tip, index) => (
                       <li key={index}>
                         <strong>{tip.subject}:</strong> {tip.tip}
                       </li>
                     ))}
                   </ul>
                </AlertDescription>
            </Alert>
          )}
          {!loading && tips.length === 0 && !error && (
            <p className="text-sm text-muted-foreground text-center pt-4">Click the button to get personalized attendance tips.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
