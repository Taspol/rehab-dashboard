import { NextRequest, NextResponse } from "next/server";
import { getUploadedPatients } from "@/lib/patientCatalog";

export async function GET(request: NextRequest) {
  try {
    const patientId = request.nextUrl.searchParams.get("id");

    if (patientId) {
      const patients = await getUploadedPatients();
      const patient = patients.find((entry) => entry.id === patientId);

      if (!patient) {
        return NextResponse.json(
          { error: "Patient not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(patient);
    } else {
      const patients = await getUploadedPatients();
      return NextResponse.json({
        patients: patients.map((p) => ({
          id: p.id,
          name: p.name,
          condition: p.condition,
          age: p.age,
          weekSessions: p.weekSessions,
          avgTimeMins: p.avgTimeMins,
          scoreBefore: p.scoreBefore,
          scoreNow: p.scoreNow,
          gameHistory: p.gameHistory,
        })),
        count: patients.length,
      });
    }
  } catch (error) {
    console.error("Error in GET /api/patients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
