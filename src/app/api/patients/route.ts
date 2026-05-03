import { NextRequest, NextResponse } from "next/server";
import { getAllPatients, getPatientById } from "@/data/patients";

export async function GET(request: NextRequest) {
  try {
    const patientId = request.nextUrl.searchParams.get("id");

    if (patientId) {
      // Get specific patient
      const patient = getPatientById(patientId);
      if (!patient) {
        return NextResponse.json(
          { error: "Patient not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(patient);
    } else {
      // Get all patients
      const patients = getAllPatients();
      return NextResponse.json({
        patients: patients.map((p) => ({
          id: p.id,
          name: p.name,
          condition: p.condition,
          age: p.age,
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
