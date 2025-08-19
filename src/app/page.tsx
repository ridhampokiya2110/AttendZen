
import AttendanceCalculator from '@/components/attendance-calculator';
import Header from '@/components/header';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-headline font-bold tracking-tight text-foreground">
              Attendance Calculator
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Plan your way to success. Find out exactly what you need to do to hit your attendance targets.
            </p>
          </header>
          <AttendanceCalculator />
        </div>
      </main>
    </div>
  );
}
