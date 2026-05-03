import { NextRequest, NextResponse } from "next/server";
import { saveGameSession } from "@/lib/fileStorage";
import { GameSession } from "@/types/patient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, session } = body;

    if (!patientId || !session) {
      return NextResponse.json(
        { error: "Missing patientId or session data" },
        { status: 400 }
      );
    }

    if (
      !session.date ||
      !session.duration ||
      session.score === undefined ||
      !session.gameName ||
      !session.exerciseType
    ) {
      return NextResponse.json(
        { error: "Invalid session data. Required fields: date, duration, score, gameName, exerciseType" },
        { status: 400 }
      );
    }

    const sessionData: GameSession = {
      date: session.date,
      duration: parseInt(session.duration),
      score: parseInt(session.score),
      gameName: session.gameName,
      exerciseType: session.exerciseType,
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