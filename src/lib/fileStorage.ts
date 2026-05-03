import * as fs from "fs/promises";
import * as path from "path";
import { GameSession } from "@/types/patient";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

async function ensureUploadsDir() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }
}

export async function saveGameSession(
  patientId: string,
  session: GameSession
): Promise<boolean> {
  try {
    await ensureUploadsDir();

    const patientDir = path.join(UPLOADS_DIR, patientId);
    await fs.mkdir(patientDir, { recursive: true });

    const sessionFile = path.join(patientDir, `session-${Date.now()}.json`);
    await fs.writeFile(sessionFile, JSON.stringify(session, null, 2));

    return true;
  } catch (error) {
    console.error("Error saving game session:", error);
    return false;
  }
}

export async function getPatientSessions(patientId: string): Promise<GameSession[]> {
  try {
    await ensureUploadsDir();

    const patientDir = path.join(UPLOADS_DIR, patientId);
    const files = await fs.readdir(patientDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const sessions: GameSession[] = [];
    for (const file of jsonFiles) {
      const filePath = path.join(patientDir, file);
      const content = await fs.readFile(filePath, "utf-8");
      sessions.push(JSON.parse(content));
    }

    return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error reading patient sessions:", error);
    return [];
  }
}

export async function getAllPatientIds(): Promise<string[]> {
  try {
    await ensureUploadsDir();
    const entries = await fs.readdir(UPLOADS_DIR, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch (error) {
    console.error("Error reading patient IDs:", error);
    return [];
  }
}
