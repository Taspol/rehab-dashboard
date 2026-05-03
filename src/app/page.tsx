import Link from "next/link";
import { getUploadedPatients } from "@/lib/patientCatalog";

export default async function Dashboard() {
  const patientData = await getUploadedPatients();
  const hasPatients = patientData.length > 0;

  const totalWeeklySessions = patientData.reduce((sum, p) => sum + p.weekSessions, 0);
  const avgDailyTime = hasPatients
    ? Math.round(patientData.reduce((sum, p) => sum + p.avgTimeMins, 0) / patientData.length)
    : 0;
  const avgImprovement = hasPatients
    ? Math.round(
        patientData.reduce((sum, p) => sum + (p.scoreNow - p.scoreBefore), 0) /
          patientData.length
      )
    : 0;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
      <header className="rounded-3xl border border-border bg-surface/90 p-5 shadow-sm backdrop-blur sm:p-7">
        <p className="text-sm font-bold tracking-[0.18em] text-primary">PHYSIO MONITOR</p>
        <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Home Rehab Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-base text-foreground/75">
              Monitor your patients&apos; at-home training progress, game performance, and session frequency.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-sm font-bold text-primary">
            Active Patients: {patientData.length}
          </span>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-bold text-foreground/70">Total Weekly Sessions</p>
          <p className="mt-2 text-3xl font-bold text-primary">{totalWeeklySessions}</p>
          <p className="mt-2 text-sm text-foreground/65">All patients combined</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-bold text-foreground/70">Average Daily Rehab Time</p>
          <p className="mt-2 text-3xl font-bold text-primary">{avgDailyTime} mins</p>
          <p className="mt-2 text-sm text-foreground/65">Per patient session</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-bold text-foreground/70">Average Performance Gain</p>
          <p className="mt-2 text-3xl font-bold text-primary">+{avgImprovement}</p>
          <p className="mt-2 text-sm text-foreground/65">Game score points improved</p>
        </article>
        <article className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-bold text-foreground/70">Adherence Level</p>
          <p className="mt-2 text-3xl font-bold text-primary">87%</p>
          <p className="mt-2 text-sm text-foreground/65">Meeting targets</p>
        </article>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Your Patients&apos;</h2>
        {!hasPatients ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/70 p-8 text-center text-foreground/70">
            No uploaded patients yet. Once a game sends session data to <span className="font-bold">/api/sessions</span>, the patient card will appear here.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patientData.map((patient) => {
            const improvementPercentage = Math.round(
              ((patient.scoreNow - patient.scoreBefore) / patient.scoreBefore) * 100
            );
            const lastSession = patient.gameHistory[0];

            return (
              <Link key={patient.id} href={`/patients/${patient.id}`}>
                <article className="group cursor-pointer rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary">
                        {patient.name}
                      </h3>
                      <p className="mt-1 text-sm text-foreground/70">{patient.condition}</p>
                      <p className="mt-1 text-xs text-foreground/60">Age: {patient.age}</p>
                    </div>
                    <div className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                      +{improvementPercentage}%
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border/50 pt-4">
                    <div>
                      <p className="text-xs text-foreground/60">Weekly Sessions</p>
                      <p className="mt-1 text-xl font-bold text-foreground">
                        {patient.weekSessions}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60">Avg Time</p>
                      <p className="mt-1 text-xl font-bold text-foreground">
                        {patient.avgTimeMins}m
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60">Latest Score</p>
                      <p className="mt-1 text-xl font-bold text-primary">{patient.scoreNow}</p>
                    </div>
                  </div>

                  {lastSession && (
                    <div className="mt-4 rounded-lg bg-surface-soft p-3">
                      <p className="text-xs text-foreground/70">
                        Last session: <span className="font-bold">{lastSession.date}</span>
                      </p>
                      <p className="mt-1 text-xs text-foreground/70">
                        {lastSession.exerciseType} • {lastSession.duration} mins
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex items-center text-sm font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    View Details →
                  </div>
                </article>
              </Link>
            );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
