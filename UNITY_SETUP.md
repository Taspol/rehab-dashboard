# Unity Integration Guide

This guide explains how to integrate the Physiotherapist Dashboard API with your Unity rehabilitation game.

## Files Provided

1. **DashboardAPIClient.cs** - Main API client for communication
2. **RehabGameManager.cs** - Example game manager showing integration
3. **This guide** - Setup and usage instructions

---

## Setup Instructions

### 1. Import Files into Your Unity Project

Copy the provided C# scripts into your Unity project:
```
Assets/
├── Scripts/
│   ├── DashboardAPIClient.cs
│   └── RehabGameManager.cs
├── Plugins/
└── ...
```

### 2. Create Setup in Your Scene

**Step A: Add DashboardAPIClient Component**
1. Create an empty GameObject named "DashboardManager"
2. Add the `DashboardAPIClient` component to it
3. In the Inspector, set the API Base URL:
   - **Development:** `http://localhost:3000`
   - **Production:** `https://your-deployed-url.com`

**Step B: Add Game Manager Component**
1. Create another empty GameObject named "GameManager"
2. Add the `RehabGameManager` component
3. Drag the "DashboardManager" object into the `dashboardClient` field
4. Configure the game settings in Inspector:
   - Patient ID (set during patient login)
   - Game Name (e.g., "Balance Master")
   - Exercise Type (e.g., "Balance & Agility")

### 3. Connect UI Elements (Optional)

If your game has UI buttons, connect them in the Inspector:
- Start Game Button → StartGame()
- End Game Button → EndGame()
- Score Display Text → Update via AddScore()

---

## Basic Usage

### Minimal Implementation

```csharp
public class SimpleGame : MonoBehaviour
{
    private DashboardAPIClient dashboardClient;
    private string patientId = "p001";

    void Start()
    {
        dashboardClient = GetComponent<DashboardAPIClient>();
    }

    void OnGameEnd(int score, int durationMinutes)
    {
        // Upload session to dashboard
        dashboardClient.UploadGameSession(
            patientId,
            "My Game Name",
            "Balance & Agility",
            score,
            durationMinutes,
            (success, message) =>
            {
                if (success)
                    Debug.Log("Session saved!");
                else
                    Debug.LogError("Upload failed: " + message);
            }
        );
    }
}
```

### Complete Example

See `RehabGameManager.cs` for a full implementation with:
- Game state management
- Score tracking
- Duration calculation
- Patient selection
- Session upload with callbacks
- Progress checking

---

## API Methods

### 1. Upload Game Session

```csharp
dashboardClient.UploadGameSession(
    patientId: "p001",
    gameName: "Balance Master",
    exerciseType: "Balance & Agility",
    score: 85,
    durationMinutes: 30,
    callback: (success, message) => 
    {
        if (success)
            Debug.Log("Uploaded!");
        else
            Debug.LogError(message);
    }
);
```

**Parameters:**
- `patientId` (string): Patient identifier (e.g., "p001", "p002")
- `gameName` (string): Name of your game/exercise
- `exerciseType` (string): Category (see Exercise Types below)
- `score` (int): Final game score (0-100 recommended)
- `durationMinutes` (int): Session duration in minutes
- `callback` (optional): Called when upload completes

### 2. Get Available Patients

```csharp
dashboardClient.GetPatients((patients) =>
{
    foreach (var patient in patients)
    {
        Debug.Log($"{patient.name} - {patient.condition}");
    }
});
```

### 3. Get Patient Sessions

```csharp
dashboardClient.GetPatientSessions("p001", (sessions) =>
{
    Debug.Log($"Patient has {sessions.Length} sessions");
    foreach (var session in sessions)
    {
        Debug.Log($"{session.date}: {session.gameName} - {session.score}");
    }
});
```

---

## Exercise Types

Use these standardized exercise type names for consistency:

- `Balance & Agility`
- `Strength Builder`
- `Coordination`
- `Mobility Train`
- (Or define your own custom types)

---

## Real-World Game Integration Example

### Scenario: Balance Game with Multiple Levels

```csharp
public class BalanceGameController : MonoBehaviour
{
    private DashboardAPIClient dashboard;
    private string currentPatientId;
    private int totalScore = 0;
    private float gameStartTime;
    private List<int> levelScores = new List<int>();

    void Start()
    {
        dashboard = FindObjectOfType<DashboardAPIClient>();
    }

    public void StartSession(string patientId)
    {
        currentPatientId = patientId;
        gameStartTime = Time.time;
        totalScore = 0;
        levelScores.Clear();
    }

    public void CompleteLevel(int levelNumber, int levelScore)
    {
        levelScores.Add(levelScore);
        totalScore += levelScore;
        Debug.Log($"Level {levelNumber} completed - Score: {levelScore}");
    }

    public void EndSession()
    {
        float durationSeconds = Time.time - gameStartTime;
        int durationMinutes = Mathf.CeilToInt(durationSeconds / 60f);
        int averageScore = totalScore / levelScores.Count;

        // Upload to dashboard
        dashboard.UploadGameSession(
            currentPatientId,
            "Balance Master",
            "Balance & Agility",
            averageScore,
            durationMinutes,
            (success, msg) =>
            {
                if (success)
                {
                    Debug.Log($"Session saved: Avg Score {averageScore}, Duration {durationMinutes}m");
                }
            }
        );
    }
}
```

---

## Testing the Integration

### Test in Unity Editor

1. **Start Development Server:**
   ```bash
   cd /path/to/dashboard
   npm run dev
   ```

2. **In Unity, create a test script:**
   ```csharp
   void TestUpload()
   {
       dashboardClient.UploadGameSession(
           "p001",
           "Test Game",
           "Balance & Agility",
           75,
           25,
           (success, msg) => 
           {
               if (success)
                   Debug.Log("✓ Upload test passed!");
               else
                   Debug.LogError("✗ Upload test failed: " + msg);
           }
       );
   }
   ```

3. **Check the Dashboard:**
   - Open `http://localhost:3000`
   - Click on patient "Nisa R." (p001)
   - Scroll to "Game History" table
   - Your test session should appear

### Verify Data in Browser

Check the uploaded data by opening the dev console:
```javascript
// In browser console
fetch('/api/game-sessions?patientId=p001')
  .then(r => r.json())
  .then(data => console.log(data.sessions))
```

---

## Troubleshooting

### Connection Issues

**Problem:** "Failed to connect to API"
```
Solution:
1. Ensure dashboard server is running (npm run dev)
2. Check API Base URL matches server address
3. On different machines: update URL from localhost to your server IP
```

### Upload Fails with 400 Error

**Problem:** Missing or invalid session data
```
Solution: Ensure all required fields are provided:
- date: YYYY-MM-DD format
- duration: positive integer
- score: integer (0-100)
- gameName: non-empty string
- exerciseType: non-empty string
```

### CORS Issues

If you get CORS errors, add this to your next.config.ts in the dashboard:
```typescript
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
        ],
      },
    ];
  },
};
```

---

## Best Practices

1. **Validate Scores:** Normalize scores to 0-100 range for consistency
2. **Accurate Duration:** Use actual session time, not arbitrary values
3. **Patient ID:** Get from secure user login, not hardcoded
4. **Error Handling:** Always check callback response
5. **Network Fallback:** Cache scores locally if upload fails
6. **User Feedback:** Show upload status to the player
7. **Test Data:** Use patient IDs from dashboard API list

---

## Example Patient IDs

```
"p001" - Nisa R. (Post ACL Rehab)
"p002" - Arun M. (Shoulder Mobility)
"p003" - Pimlada T. (Balance Recovery)
```

Use these for testing, or load from API via `GetPatients()`

---

## Next Steps

1. Implement player authentication (optional)
2. Add session caching for offline play
3. Create UI to display patient progress from dashboard
4. Build level/difficulty progression
5. Add real-time analytics

For API documentation, see [API_DOCS.md](API_DOCS.md)
