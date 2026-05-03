# Unity Quick Start (5 Minutes)

## TL;DR - Get Your Game Uploading in 5 Steps

### 1. Copy Files
Copy to your Unity project:
- `DashboardAPIClient.cs` → Assets/Scripts/
- `RehabGameManager.cs` → Assets/Scripts/

### 2. Add to Scene
Create empty GameObject named "DashboardManager":
```
GameObject → Create Empty → Rename to "DashboardManager"
Add Component → DashboardAPIClient
```

### 3. Set API URL
In Inspector, set API Base URL:
- **Dev:** `http://localhost:3000`
- **Prod:** `https://your-domain.com`

### 4. Simple Upload Code

```csharp
// Get reference
DashboardAPIClient api = GetComponent<DashboardAPIClient>();

// When game ends, call:
api.UploadGameSession(
    patientId: "p001",
    gameName: "My Game",
    exerciseType: "Balance & Agility",
    score: 85,
    durationMinutes: 30,
    callback: (success, msg) => Debug.Log(success ? "✓ Saved!" : "✗ Failed")
);
```

### 5. Test
- Run `npm run dev` in dashboard folder
- Play game in Unity
- Check `http://localhost:3000` → patient card → game history

---

## Available Patients

```
ID      Name         Condition
p001    Nisa R.      Post ACL Rehab
p002    Arun M.      Shoulder Mobility
p003    Pimlada T.   Balance Recovery
```

---

## Example: Track Score During Gameplay

```csharp
void Update()
{
    // Game logic...
    if (playerCompletedChallenge)
    {
        gameScore += 10;
        Debug.Log($"Score: {gameScore}");
    }
}

void OnGameEnd()
{
    int durationMinutes = Mathf.CeilToInt((Time.time - startTime) / 60f);
    
    api.UploadGameSession(
        "p001",
        "Balance Master",
        "Balance & Agility",
        gameScore,
        durationMinutes
    );
}
```

---

## Check Network Call

Open browser developer tools (F12):
```javascript
// Console - check recent uploads
fetch('http://localhost:3000/api/game-sessions?patientId=p001')
  .then(r => r.json())
  .then(d => console.log(d.sessions))
```

---

## Common Mistakes

❌ Score > 100 (normalize to 0-100)
❌ Wrong patient ID (check dashboard first)
❌ API URL is localhost but server running elsewhere
❌ Forgetting to call the upload method
❌ Not checking callback for errors

---

For full documentation, see [UNITY_SETUP.md](UNITY_SETUP.md) and [API_DOCS.md](API_DOCS.md)
