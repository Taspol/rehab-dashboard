import { Patient } from "@/types/patient";

export const patientData: Patient[] = [
  {
    id: "p001",
    name: "Nisa R.",
    condition: "Post ACL Rehab",
    startDate: "2026-01-15",
    age: 28,
    weekSessions: 5,
    avgTimeMins: 32,
    scoreBefore: 58,
    scoreNow: 81,
    notes:
      "Progressing well with knee stability exercises. Good compliance with home program. Continue balance training.",
    gameHistory: [
      {
        date: "2026-05-02",
        duration: 35,
        score: 81,
        gameName: "Knee Stability Pro",
        exerciseType: "Balance & Agility",
      },
      {
        date: "2026-05-01",
        duration: 32,
        score: 79,
        gameName: "Leg Power Builder",
        exerciseType: "Strength Builder",
      },
      {
        date: "2026-04-30",
        duration: 28,
        score: 76,
        gameName: "Knee Stability Pro",
        exerciseType: "Balance & Agility",
      },
      {
        date: "2026-04-29",
        duration: 30,
        score: 74,
        gameName: "Leg Power Builder",
        exerciseType: "Strength Builder",
      },
      {
        date: "2026-04-28",
        duration: 25,
        score: 71,
        gameName: "Reflex Trainer",
        exerciseType: "Coordination",
      },
      {
        date: "2026-04-27",
        duration: 33,
        score: 69,
        gameName: "Knee Stability Pro",
        exerciseType: "Balance & Agility",
      },
      {
        date: "2026-04-26",
        duration: 29,
        score: 65,
        gameName: "Leg Power Builder",
        exerciseType: "Strength Builder",
      },
    ],
  },
  {
    id: "p002",
    name: "Arun M.",
    condition: "Shoulder Mobility",
    startDate: "2026-02-10",
    age: 35,
    weekSessions: 4,
    avgTimeMins: 25,
    scoreBefore: 52,
    scoreNow: 74,
    notes:
      "Excellent shoulder ROM improvement. Patient motivated and engaged. Increase intensity in next phase.",
    gameHistory: [
      {
        date: "2026-05-02",
        duration: 28,
        score: 74,
        gameName: "Shoulder Range Optimizer",
        exerciseType: "Mobility Train",
      },
      {
        date: "2026-05-01",
        duration: 25,
        score: 71,
        gameName: "Shoulder Range Optimizer",
        exerciseType: "Mobility Train",
      },
      {
        date: "2026-04-30",
        duration: 26,
        score: 68,
        gameName: "Reflex Trainer",
        exerciseType: "Coordination",
      },
      {
        date: "2026-04-29",
        duration: 22,
        score: 65,
        gameName: "Shoulder Range Optimizer",
        exerciseType: "Mobility Train",
      },
      {
        date: "2026-04-28",
        duration: 24,
        score: 62,
        gameName: "Arm Strength Challenge",
        exerciseType: "Strength Builder",
      },
      {
        date: "2026-04-27",
        duration: 27,
        score: 59,
        gameName: "Shoulder Range Optimizer",
        exerciseType: "Mobility Train",
      },
    ],
  },
  {
    id: "p003",
    name: "Pimlada T.",
    condition: "Balance Recovery",
    startDate: "2026-01-20",
    age: 62,
    weekSessions: 6,
    avgTimeMins: 29,
    scoreBefore: 49,
    scoreNow: 79,
    notes:
      "Significant fall risk reduction achieved. Continue with vestibular and proprioceptive exercises.",
    gameHistory: [
      {
        date: "2026-05-02",
        duration: 31,
        score: 79,
        gameName: "Balance Master",
        exerciseType: "Balance & Agility",
      },
      {
        date: "2026-05-01",
        duration: 29,
        score: 77,
        gameName: "Balance Master",
        exerciseType: "Balance & Agility",
      },
      {
        date: "2026-04-30",
        duration: 28,
        score: 75,
        gameName: "Reflex Trainer",
        exerciseType: "Coordination",
      },
      {
        date: "2026-04-29",
        duration: 30,
        score: 72,
        gameName: "Balance Master",
        exerciseType: "Balance & Agility",
      },
      {
        date: "2026-04-28",
        duration: 26,
        score: 70,
        gameName: "Leg Power Builder",
        exerciseType: "Strength Builder",
      },
      {
        date: "2026-04-27",
        duration: 32,
        score: 68,
        gameName: "Balance Master",
        exerciseType: "Balance & Agility",
      },
      {
        date: "2026-04-26",
        duration: 27,
        score: 65,
        gameName: "Reflex Trainer",
        exerciseType: "Coordination",
      },
    ],
  },
];

export function getPatientById(id: string): Patient | undefined {
  return patientData.find((patient) => patient.id === id);
}

export function getAllPatients(): Patient[] {
  return patientData;
}
