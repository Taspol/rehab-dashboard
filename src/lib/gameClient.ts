/**
 * Game Session Upload Client
 * 
 * This module provides utilities for game applications to upload rehab session data
 * to the Physiotherapist Dashboard.
 * 
 * Usage Example:
 * 
 * import { uploadGameSession, getPatientsList } from '@/lib/gameClient';
 * 
 * // Get list of available patients
 * const patients = await getPatientsList();
 * 
 * // Upload a game session
 * const response = await uploadGameSession('p001', {
 *   date: '2026-05-03',
 *   duration: 30,
 *   score: 85,
 *   gameName: 'Balance Master',
 *   exerciseType: 'Balance & Agility'
 * });
 */

import { GameSession } from "@/types/patient";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3000";

export interface Patient {
  id: string;
  name: string;
  condition: string;
  age: number;
}

export interface UploadResponse {
  message: string;
  patientId: string;
  session: GameSession;
}

export interface PatientResponse {
  patients: Patient[];
  count: number;
}

/**
 * Upload a game session for a specific patient
 * 
 * @param patientId - Unique identifier of the patient
 * @param session - Game session data to upload
 * @returns Upload response with status
 */
export async function uploadGameSession(
  patientId: string,
  session: Omit<GameSession, "">
): Promise<UploadResponse> {
  const response = await fetch(`${API_BASE}/api/game-sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patientId,
      session,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload game session");
  }

  return response.json();
}

/**
 * Get list of all available patients
 * 
 * @returns List of patients that can receive session uploads
 */
export async function getPatientsList(): Promise<Patient[]> {
  const response = await fetch(`${API_BASE}/api/patients`);

  if (!response.ok) {
    throw new Error("Failed to fetch patients list");
  }

  const data: PatientResponse = await response.json();
  return data.patients;
}

/**
 * Get a specific patient's details
 * 
 * @param patientId - Patient ID to retrieve
 * @returns Patient details or null if not found
 */
export async function getPatientDetails(patientId: string) {
  const response = await fetch(`${API_BASE}/api/patients?id=${patientId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch patient details");
  }

  return response.json();
}

/**
 * Get all game sessions for a patient
 * 
 * @param patientId - Patient ID to get sessions for
 * @returns Array of game sessions sorted by date (newest first)
 */
export async function getPatientSessions(patientId: string): Promise<GameSession[]> {
  const response = await fetch(`${API_BASE}/api/game-sessions?patientId=${patientId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch patient sessions");
  }

  const data = await response.json();
  return data.sessions;
}
