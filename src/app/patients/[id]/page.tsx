import Link from "next/link";
import { getUploadedPatients } from "@/lib/patientCatalog";

type PatientDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id: patientId } = await params;
  const patient = (await getUploadedPatients()).find((entry) => entry.id === patientId);

  if (!patient) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-foreground">Patient not found in uploaded data</p>
          <Link href="/" className="mt-4 text-primary hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  const improvement = patient.scoreNow - patient.scoreBefore;
  const improvementPercentage = Math.round((improvement / patient.scoreBefore) * 100);

  // Calculate stats
  const totalMinutes = patient.gameHistory.reduce((sum, session) => sum + session.duration, 0);
  const averageScore =
    patient.gameHistory.reduce((sum, session) => sum + session.score, 0) / patient.gameHistory.length;
  const highestScore = Math.max(...patient.gameHistory.map((session) => session.score));

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold text-primary hover:bg-surface-soft"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <header className="rounded-3xl border border-border bg-surface/90 p-5 shadow-sm backdrop-blur sm:p-7">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {patient.name}
            </h1>
            <p className="mt-2 text-lg text-foreground/75">{patient.condition}</p>
            <p className="mt-1 text-sm text-foreground/60">
              Age: {patient.age} • Started: {patient.startDate}
            </p>
          </div>
          <div className="flex items-end gap-4">
            <div className="text-right">
              <p className="text-sm text-foreground/70">Overall Improvement</p>
              <p className="mt-1 text-3xl font-bold text-primary">+{improvementPercentage}%</p>
              <p className="mt-1 text-xs text-foreground/60">
                {patient.scoreBefore} → {patient.scoreNow}
              </p>
            </div>
          </div>
        </div>

        {patient.notes && (
          <div className="mt-5 border-t border-border/50 pt-4">
            <p className="text-sm font-bold text-foreground/70">Therapist Notes</p>
            <p className="mt-2 text-foreground/80">{patient.notes}</p>
          </div>
        )}
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-bold text-foreground/70">Total Sessions</p>
          <p className="mt-2 text-3xl font-bold text-primary">{patient.gameHistory.length}</p>
          <p className="mt-2 text-sm text-foreground/65">Recorded games</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-bold text-foreground/70">Total Training Time</p>
          <p className="mt-2 text-3xl font-bold text-primary">{totalMinutes} mins</p>
          <p className="mt-2 text-sm text-foreground/65">Combined duration</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-bold text-foreground/70">Highest Score</p>
          <p className="mt-2 text-3xl font-bold text-primary">{highestScore}</p>
          <p className="mt-2 text-sm text-foreground/65">Peak performance</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-bold text-foreground/70">Average Score</p>
          <p className="mt-2 text-3xl font-bold text-primary">{Math.round(averageScore)}</p>
          <p className="mt-2 text-sm text-foreground/65">Across all sessions</p>
        </article>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Game History</h2>
          <span className="rounded-full bg-surface-soft px-3 py-1 text-xs font-bold text-foreground/70">
            {patient.gameHistory.length} sessions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-sm text-foreground/70">
                <th className="px-3 py-3 font-bold">Date</th>
                <th className="px-3 py-3 font-bold">Exercise Type</th>
                <th className="px-3 py-3 font-bold">Game Name</th>
                <th className="px-3 py-3 font-bold">Duration</th>
                <th className="px-3 py-3 font-bold">Score</th>
                <th className="px-3 py-3 font-bold">Trend</th>
              </tr>
            </thead>
            <tbody>
              {patient.gameHistory.map((session, index) => {
                const nextSession = patient.gameHistory[index - 1];
                const scoreTrend = nextSession ? session.score - nextSession.score : null;

                return (
                  <tr key={index} className="border-b border-border/70 text-sm hover:bg-surface-soft">
                    <td className="px-3 py-3 font-bold">{session.date}</td>
                    <td className="px-3 py-3 text-foreground/80">{session.exerciseType}</td>
                    <td className="px-3 py-3 text-foreground/80">{session.gameName}</td>
                    <td className="px-3 py-3 text-foreground/80">{session.duration} mins</td>
                    <td className="px-3 py-3">
                      <span className="inline-block rounded-full bg-primary-soft px-2 py-1 font-bold text-primary">
                        {session.score}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {scoreTrend !== null ? (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${
                            scoreTrend > 0
                              ? "bg-green-100 text-green-700"
                              : scoreTrend < 0
                                ? "bg-red-100 text-red-700"
                                : "bg-surface-soft text-foreground/70"
                          }`}
                        >
                          {scoreTrend > 0 ? "↑" : scoreTrend < 0 ? "↓" : "→"} {Math.abs(scoreTrend)}
                        </span>
                      ) : (
                        <span className="text-foreground/50">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="text-xl font-bold">Exercise Breakdown</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {Array.from(new Set(patient.gameHistory.map((s) => s.exerciseType))).map((exerciseType) => {
            const exerciseSessions = patient.gameHistory.filter(
              (s) => s.exerciseType === exerciseType
            );
            const avgScore = Math.round(
              exerciseSessions.reduce((sum, s) => sum + s.score, 0) / exerciseSessions.length
            );

            return (
              <div key={exerciseType} className="rounded-xl border border-border/50 bg-surface-soft p-4">
                <p className="font-bold text-foreground">{exerciseType}</p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-foreground/70">
                    Sessions: <span className="font-bold text-foreground">{exerciseSessions.length}</span>
                  </p>
                  <p className="text-sm text-foreground/70">
                    Avg Score: <span className="font-bold text-primary">{avgScore}</span>
                  </p>
                  <p className="text-sm text-foreground/70">
                    Total Time:{" "}
                    <span className="font-bold text-foreground">
                      {exerciseSessions.reduce((sum, s) => sum + s.duration, 0)} mins
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
