
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calculator, CheckCircle2, AlertTriangle } from 'lucide-react';

const calculatorSchema = z.object({
    attended: z.coerce.number({invalid_type_error: "Please enter a number."}).int().min(0, "Attended classes must be a positive number."),
    total: z.coerce.number({invalid_type_error: "Please enter a number."}).int().min(0, "Total classes must be a positive number."),
    target: z.coerce.number({invalid_type_error: "Please enter a number."}).min(1, 'Target must be at least 1%').max(100, 'Target cannot exceed 100%'),
}).refine(data => data.total >= data.attended, {
    message: "Total classes must be greater than or equal to attended classes.",
    path: ["total"],
});

type CalculatorValues = z.infer<typeof calculatorSchema>;

interface CalculationResult {
  currentPercentage: number;
  neededToAttend: number | 'unreachable';
  canMiss: number;
  targetMet: boolean;
}

export default function AttendanceCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const form = useForm<CalculatorValues>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      attended: undefined,
      total: undefined,
      target: 85,
    },
  });

  function onSubmit(values: CalculatorValues) {
    const { attended, total, target } = values;
    
    const currentPercentage = total > 0 ? (attended / total) * 100 : 0;

    if (currentPercentage >= target) {
      const canMiss = target > 0 ? Math.floor((attended * 100 / target) - total) : Infinity;
      setResult({
        currentPercentage: parseFloat(currentPercentage.toFixed(2)),
        neededToAttend: 0,
        canMiss: canMiss < 0 ? 0 : canMiss,
        targetMet: true,
      });
    } else {
      if (target === 100 || 100 - target <= 0) {
         setResult({
            currentPercentage: parseFloat(currentPercentage.toFixed(2)),
            neededToAttend: 'unreachable',
            canMiss: 0,
            targetMet: false,
        });
        return;
      }
      const needed = (target * total - 100 * attended) / (100 - target);
      if (needed < 0) {
        // This can happen due to floating point inaccuracies, means target is basically met
         setResult({
          currentPercentage: parseFloat(currentPercentage.toFixed(2)),
          neededToAttend: 0,
          canMiss: 0,
          targetMet: true,
        });
        return;
      }
      const neededToAttend = Math.ceil(needed);
      setResult({
        currentPercentage: parseFloat(currentPercentage.toFixed(2)),
        neededToAttend: neededToAttend,
        canMiss: 0,
        targetMet: false,
      });
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="pt-6 grid gap-6">
              <div className="grid sm:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="attended"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Classes Attended</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g. 18" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="total"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Total Classes So Far</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g. 20" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              </div>
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attendance Target (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 85" {...field} value={field.value ?? ''}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
            </Button>
          </CardFooter>
        </form>
      </Form>

      {result && (
        <div className="p-6 pt-0">
          <Alert variant={result.targetMet ? 'default' : 'destructive'} className={result.targetMet ? 'border-primary/50' : ''}>
             {result.targetMet ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <AlertTitle className="font-headline">
                Your current attendance is {result.currentPercentage}%.
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
                {result.targetMet ? (
                    <p>
                       Congratulations! You're on track. You can miss <strong>{isFinite(result.canMiss) ? result.canMiss : 'any number of'}</strong> more class{result.canMiss !== 1 ? 'es' : ''} and still maintain your goal.
                    </p>
                ) : (
                    <>
                    {result.neededToAttend === 'unreachable' ? (
                        <p>Unfortunately, it's not mathematically possible to reach your target of {form.getValues('target')}% from your current standing.</p>
                    ) : (
                       <p>
                        To reach your target of {form.getValues('target')}%, you need to attend the next <strong>{result.neededToAttend}</strong> class{result.neededToAttend !== 1 ? 'es' : ''} consecutively.
                       </p>
                    )}
                    </>
                )}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}
