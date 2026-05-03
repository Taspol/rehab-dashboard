# Game Integration API Documentation

This document describes the API endpoints available for game applications to upload patient rehabilitation session data to the Physiotherapist Dashboard.

## Base URL

```
http://localhost:3000 (development)
https://your-domain.com (production)
```

## Authentication

Currently, no authentication is required. This should be added for production use.

---

## Endpoints

### 1. Upload Game Session

**Endpoint:** `POST /api/sessions`

Upload a completed rehabilitation game session for a patient.

#### Request Body

```json
{
  "patientId": "p001",
  "session": {
    "date": "2026-05-03",
    "duration": 30,
    "score": 85,
    "gameName": "Balance Master",
    "exerciseType": "Balance & Agility"
  }
}
```

#### Required Fields

- `patientId` (string): Unique patient identifier
- `session.date` (string): Session date in YYYY-MM-DD format
- `session.duration` (number): Session duration in minutes
- `session.score` (number): Game score (0-100)
- `session.gameName` (string): Name of the game/exercise
- `session.exerciseType` (string): Type of exercise (e.g., "Balance & Agility", "Strength Builder", "Coordination", "Mobility Train")

#### Success Response (201)

```json
{
  "message": "Game session saved successfully",
  "patientId": "p001",
  "session": {
    "date": "2026-05-03",
    "duration": 30,
    "score": 85,
    "gameName": "Balance Master",
    "exerciseType": "Balance & Agility"
  }
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "error": "Missing patientId or session data"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to save game session"
}
```

---

### 2. Get Patient Sessions

**Endpoint:** `GET /api/sessions?patientId=p001`

Retrieve all game sessions for a specific patient.

#### Query Parameters

- `patientId` (required): Patient identifier

#### Success Response (200)

```json
{
  "patientId": "p001",
  "sessions": [
    {
      "date": "2026-05-03",
      "duration": 30,
      "score": 85,
      "gameName": "Balance Master",
      "exerciseType": "Balance & Agility"
    },
    {
      "date": "2026-05-02",
      "duration": 35,
      "score": 81,
      "gameName": "Knee Stability Pro",
      "exerciseType": "Balance & Agility"
    }
  ],
  "count": 2
}
```

---

### 3. Get Patients List

**Endpoint:** `GET /api/patients`

Get a list of all registered patients that can receive uploads.

#### Success Response (200)

```json
{
  "patients": [
    {
      "id": "p001",
      "name": "Nisa R.",
      "condition": "Post ACL Rehab",
      "age": 28
    },
    {
      "id": "p002",
      "name": "Arun M.",
      "condition": "Shoulder Mobility",
      "age": 35
    }
  ],
  "count": 2
}
```

---

### 4. Get Patient Details

**Endpoint:** `GET /api/patients?id=p001`

Retrieve detailed information for a specific patient.

#### Query Parameters

- `id` (required): Patient identifier

#### Success Response (200)

```json
{
  "id": "p001",
  "name": "Nisa R.",
  "condition": "Post ACL Rehab",
  "startDate": "2026-01-15",
  "age": 28,
  "weekSessions": 5,
  "avgTimeMins": 32,
  "scoreBefore": 58,
  "scoreNow": 81,
  "notes": "Progressing well with knee stability exercises..."
}
```

#### Error Responses

**404 Not Found:**
```json
{
  "error": "Patient not found"
}
```

---

## JavaScript Client Library

A client library is provided for easy integration in JavaScript/TypeScript applications.

### Installation

```typescript
import { uploadGameSession, getPatientsList } from '@/lib/gameClient';
```

### Usage Examples

#### Upload a Session

```typescript
try {
  const response = await uploadGameSession('p001', {
    date: '2026-05-03',
    duration: 30,
    score: 85,
    gameName: 'Balance Master',
    exerciseType: 'Balance & Agility'
  });
  console.log('Session uploaded:', response);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

#### Get Available Patients

```typescript
try {
  const patients = await getPatientsList();
  patients.forEach(patient => {
    console.log(`${patient.name} - ${patient.condition}`);
  });
} catch (error) {
  console.error('Failed to fetch patients:', error.message);
}
```

#### Get Patient Details

```typescript
try {
  const patient = await getPatientDetails('p001');
  if (patient) {
    console.log(`Patient: ${patient.name}, Current Score: ${patient.scoreNow}`);
  }
} catch (error) {
  console.error('Failed to fetch patient:', error.message);
}
```

#### Get Patient's Session History

```typescript
try {
  const sessions = await getPatientSessions('p001');
  console.log(`Patient has ${sessions.length} recorded sessions`);
  sessions.forEach(session => {
    console.log(`${session.date}: ${session.gameName} - Score: ${session.score}`);
  });
} catch (error) {
  console.error('Failed to fetch sessions:', error.message);
}
```

---

## Data Storage

Game session data is stored locally in the `uploads/` directory with the following structure:

```
uploads/
├── p001/
│   ├── session-1698765432000.json
│   ├── session-1698765500000.json
│   └── ...
├── p002/
│   ├── session-1698765600000.json
│   └── ...
└── ...
```

Each file contains a single game session in JSON format.

---

## Best Practices

1. **Validate patient ID**: Always check that the patientId exists before attempting uploads
2. **Use current date**: Ensure the session date is accurate (ISO 8601 format: YYYY-MM-DD)
3. **Score normalization**: Keep scores in 0-100 range for consistency
4. **Duration accuracy**: Record actual session duration in minutes
5. **Exercise names**: Use standardized exercise type names for analytics
6. **Error handling**: Implement proper error handling for network failures and API errors

---

## Future Enhancements

- [ ] Authentication & authorization
- [ ] Rate limiting
- [ ] Data validation middleware
- [ ] Batch upload endpoint
- [ ] Real-time session updates via WebSocket
- [ ] Session analytics and insights
