import { NextRequest, NextResponse } from "next/server";
import { saveGameSession } from "@/lib/fileStorage";
import { GameSession } from "@/types/patient";

type SessionInput = Partial<GameSession> & {
  level?: number;
  durationMinutes?: number | string;
  durationSeconds?: number | string;
  rehabType?: string;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeDuration(session: SessionInput): number | null {
  const directDuration = toNumber(session.duration);
  if (directDuration !== null && directDuration > 0) {
    return directDuration;
  }

  const minutes = toNumber(session.durationMinutes);
  if (minutes !== null && minutes > 0) {
    return minutes;
  }

  const seconds = toNumber(session.durationSeconds);
  if (seconds !== null && seconds > 0) {
    return Math.max(1, Math.round(seconds / 60));
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const patientId = body.patientId ?? body.patientld;
    const session: SessionInput = body.session ?? body;

    if (!patientId) {
      return NextResponse.json(
        { error: "Missing patientId (or patientld)" },
        { status: 400 }
      );
    }

    const gameName = session.gameName?.trim();
    const exerciseType = session.exerciseType?.trim() ?? session.rehabType?.trim();
    const date = session.date?.trim() ?? new Date().toISOString().slice(0, 10);
    const duration = normalizeDuration(session);
    const score = toNumber(session.score);

    if (!gameName || !exerciseType || duration === null || score === null) {
      return NextResponse.json(
        {
          error:
            "Invalid session data. Required fields: gameName, exerciseType (or rehabType), score, and durationMinutes or durationSeconds or duration",
        },
        { status: 400 }
      );
    }

    const sessionData: GameSession = {
      date,
      duration,
      score,
      gameName,
      exerciseType,
    };

    const success = await saveGameSession(patientId, sessionData);

    if (success) {
      return NextResponse.json(
        {
          message: "Game session saved successfully",
          patientId,
          session: sessionData,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save game session" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in POST /api/sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const patientId = request.nextUrl.searchParams.get("patientId");

    if (!patientId) {
      return NextResponse.json(
        { error: "Missing patientId query parameter" },
        { status: 400 }
      );
    }

    const { getPatientSessions } = await import("@/lib/fileStorage");
    const sessions = await getPatientSessions(patientId);

    return NextResponse.json({
      patientId,
      sessions,
      count: sessions.length,
    });
  } catch (error) {
    console.error("Error in GET /api/sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}