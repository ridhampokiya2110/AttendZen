interface GenerateAttendanceTipsInput {
  attendanceData: {
    subject: string;
    attended: number;
    total: number;
    targetAttendance: number;
  }[];
}

export interface GenerateAttendanceTipsOutput {
  tips: {
    subject: string;
    tip: string;
  }[];
}

export async function generateAttendanceTips(input: GenerateAttendanceTipsInput): Promise<GenerateAttendanceTipsOutput> {
  // Simple placeholder implementation
  return {
    tips: input.attendanceData.map(data => {
      const currentPercentage = (data.attended / data.total) * 100;
      const needToReach = data.targetAttendance;
      
      if (currentPercentage >= needToReach) {
        return {
          subject: data.subject,
          tip: `Great job! You're meeting your target attendance of ${needToReach}%.`,
        };
      } else {
        return {
          subject: data.subject,
          tip: `Try to attend more classes to reach your target of ${needToReach}%.`,
        };
      }
    }),
  };
}
