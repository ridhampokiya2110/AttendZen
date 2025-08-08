"use client"

import * as React from "react"
import type { Subject } from "@/types"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  attendance: {
    label: "Attendance",
    color: "hsl(var(--chart-1))",
  },
  target: {
    label: "Target",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface AttendanceChartsProps {
  subjects: Subject[]
}

export default function AttendanceCharts({ subjects }: AttendanceChartsProps) {
  const chartData = React.useMemo(() => {
    return subjects.map(subject => ({
      subject: subject.name,
      attendance: subject.total > 0 ? Math.round((subject.attended / subject.total) * 100) : 0,
      target: subject.target,
    }))
  }, [subjects])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Attendance Overview</CardTitle>
        <CardDescription>A summary of your attendance vs. your targets.</CardDescription>
      </CardHeader>
      <CardContent>
        {subjects.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={350}>
                 <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="subject" tickLine={false} axisLine={false} tickMargin={8}
                    />
                    <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="attendance" fill="var(--color-attendance)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="var(--color-target)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
             <div className="h-[350px] w-full flex items-center justify-center">
                <p className="text-muted-foreground">Add subjects to see your attendance chart.</p>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
