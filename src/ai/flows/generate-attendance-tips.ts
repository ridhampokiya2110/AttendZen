// src/ai/flows/generate-attendance-tips.ts
'use server';

/**
 * @fileOverview Flow for generating personalized attendance tips using AI.
 *
 * - generateAttendanceTips -  Generates personalized tips based on user's attendance data to help maintain attendance goals.
 * - GenerateAttendanceTipsInput - The input type for the generateAttendanceTips function.
 * - GenerateAttendanceTipsOutput - The return type for the generateAttendanceTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttendanceDataSchema = z.object({
  subject: z.string().describe('The name of the subject or course.'),
  attended: z.number().int().nonnegative().describe('Number of classes attended.'),
  total: z.number().int().positive().describe('Total number of classes.'),
  targetAttendance: z.number().int().min(0).max(100).describe('Target attendance percentage for the subject.'),
});

const GenerateAttendanceTipsInputSchema = z.object({
  attendanceData: z.array(AttendanceDataSchema).describe('Array of attendance data for different subjects.'),
});
export type GenerateAttendanceTipsInput = z.infer<typeof GenerateAttendanceTipsInputSchema>;

const GenerateAttendanceTipsOutputSchema = z.object({
  tips: z.array(
    z.object({
      subject: z.string().describe('The subject the tip is for.'),
      tip: z.string().describe('A personalized tip to improve attendance for the subject.'),
    })
  ).describe('Personalized tips for each subject, if needed.')
});
export type GenerateAttendanceTipsOutput = z.infer<typeof GenerateAttendanceTipsOutputSchema>;

const shouldProvideTip = ai.defineTool(
  {
    name: 'shouldProvideTip',
    description:
      'Determines whether a tip is necessary and useful based on the attendance data.',
    inputSchema: AttendanceDataSchema,
    outputSchema: z.boolean(),
  },
  async (input) => {
    // Implement logic to determine if a tip is needed.
    // This could be based on how far the user is from their target attendance.
    const attendancePercentage = (input.attended / input.total) * 100;
    return attendancePercentage < input.targetAttendance;
  },
);

const generateAttendanceTipPrompt = ai.definePrompt({
  name: 'generateAttendanceTipPrompt',
  input: {schema: AttendanceDataSchema},
  output: {schema: z.string().describe('A personalized tip to improve attendance.')},
  tools: [shouldProvideTip],
  prompt: `You are an AI assistant providing personalized tips to students to improve their attendance.

  Consider the following attendance data for a subject:
  Subject: {{subject}}
  Attended Classes: {{attended}}
  Total Classes: {{total}}
  Target Attendance: {{targetAttendance}}%

  If shouldProvideTip tool returns true, generate one specific and actionable tip to improve attendance in the subject. If shouldProvideTip tool returns false, respond with "".
  `,
});


const generateAttendanceTipsFlow = ai.defineFlow(
  {
    name: 'generateAttendanceTipsFlow',
    inputSchema: GenerateAttendanceTipsInputSchema,
    outputSchema: GenerateAttendanceTipsOutputSchema,
  },
  async input => {
    const tips: { subject: string; tip: string }[] = [];

    for (const attendanceData of input.attendanceData) {
      const shouldProvide = await shouldProvideTip(attendanceData);
      if (shouldProvide) {
        const {output} = await generateAttendanceTipPrompt(attendanceData);
        if (output) {
          tips.push({ subject: attendanceData.subject, tip: output });
        }
      }
    }

    return { tips };
  }
);

export async function generateAttendanceTips(input: GenerateAttendanceTipsInput): Promise<GenerateAttendanceTipsOutput> {
  return generateAttendanceTipsFlow(input);
}
