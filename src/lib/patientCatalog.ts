import { getAllPatients } from "@/data/patients";
import { Patient } from "@/types/patient";
import { getAllPatientIds, getPatientSessions } from "@/lib/fileStorage";

function buildPatientFromSessions(patientId: string, sessions: Patient["gameHistory"], seed?: Patient): Patient {
  const sortedSessions = [...sessions].sort(
    (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime()
  );

  const averageDuration =
    sortedSessions.length > 0
      ? Math.round(
          sortedSessions.reduce((sum, session) => sum + session.duration, 0) /
            sortedSessions.length
        )
      : seed?.avgTimeMins ?? 0;

  const latestScore = sortedSessions[0]?.score ?? seed?.scoreNow ?? 0;
  const baselineScore = seed?.scoreBefore ?? sortedSessions.at(-1)?.score ?? latestScore;

  return {
    id: seed?.id ?? patientId,
    name: seed?.name ?? patientId,
    condition: seed?.condition ?? "Uploaded rehab program",
    startDate: seed?.startDate ?? sortedSessions.at(-1)?.date ?? new Date().toISOString().slice(0, 10),
    age: seed?.age ?? 0,
    weekSessions: sortedSessions.length,
    avgTimeMins: averageDuration,
    scoreBefore: baselineScore,
    scoreNow: latestScore,
    notes: seed?.notes ?? "",
    gameHistory: sortedSessions,
  };
}

export async function getUploadedPatients(): Promise<Patient[]> {
  const [seedPatients, uploadedPatientIds] = await Promise.all([
    Promise.resolve(getAllPatients()),
    getAllPatientIds(),
  ]);

  const seedById = new Map(seedPatients.map((patient) => [patient.id, patient]));

  const patients = await Promise.all(
    uploadedPatientIds.map(async (patientId) => {
      const seed = seedById.get(patientId);
      const sessions = await getPatientSessions(patientId);

      if (seed && sessions.length === 0) {
        return seed;
      }

      return buildPatientFromSessions(patientId, sessions.length > 0 ? sessions : seed?.gameHistory ?? [], seed);
    })
  );

  return patients;
}
