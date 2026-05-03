/*
 * Physiotherapist Dashboard - Unity Integration Example
 * 
 * This script demonstrates how to upload game session data from a Unity game
 * to the Physiotherapist Dashboard API.
 * 
 * Usage:
 * 1. Attach this script to a GameObject in your scene
 * 2. Configure the API Base URL in the Inspector
 * 3. Call the public methods when game events occur
 */

using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;

[System.Serializable]
public class GameSession
{
    public string date;
    public int duration; // minutes
    public int score;
    public string gameName;
    public string exerciseType;
}

[System.Serializable]
public class GameSessionUploadRequest
{
    public string patientId;
    public GameSession session;
}

[System.Serializable]
public class UploadResponse
{
    public string message;
    public string patientId;
    public GameSession session;
}

[System.Serializable]
public class Patient
{
    public string id;
    public string name;
    public string condition;
    public int age;
}

[System.Serializable]
public class PatientsResponse
{
    public Patient[] patients;
    public int count;
}

[System.Serializable]
public class SessionsResponse
{
    public string patientId;
    public GameSession[] sessions;
    public int count;
}

public class DashboardAPIClient : MonoBehaviour
{
    [SerializeField]
    private string apiBaseURL = "http://localhost:3000";

    public delegate void OnUploadCompleted(bool success, string message);
    public delegate void OnPatientsLoaded(Patient[] patients);
    public delegate void OnSessionsLoaded(GameSession[] sessions);

    /// <summary>
    /// Upload a game session to the dashboard
    /// </summary>
    public void UploadGameSession(
        string patientId,
        string gameName,
        string exerciseType,
        int score,
        int durationMinutes,
        OnUploadCompleted callback = null
    )
    {
        StartCoroutine(UploadGameSessionCoroutine(
            patientId,
            gameName,
            exerciseType,
            score,
            durationMinutes,
            callback
        ));
    }

    private IEnumerator UploadGameSessionCoroutine(
        string patientId,
        string gameName,
        string exerciseType,
        int score,
        int durationMinutes,
        OnUploadCompleted callback
    )
    {
        // Create session data
        var gameSession = new GameSession
        {
            date = System.DateTime.Now.ToString("yyyy-MM-dd"),
            duration = durationMinutes,
            score = score,
            gameName = gameName,
            exerciseType = exerciseType
        };

        // Create request payload
        var uploadRequest = new GameSessionUploadRequest
        {
            patientId = patientId,
            session = gameSession
        };

        string jsonData = JsonUtility.ToJson(uploadRequest);

        // Create HTTP request
        using (UnityWebRequest request = new UnityWebRequest(
            $"{apiBaseURL}/api/sessions",
            "POST"
        ))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Debug.Log($"✓ Game session uploaded successfully for patient {patientId}");
                callback?.Invoke(true, "Session uploaded successfully");
            }
            else
            {
                Debug.LogError(
                    $"✗ Failed to upload game session: {request.error}\n{request.downloadHandler.text}"
                );
                callback?.Invoke(false, request.error);
            }
        }
    }

    /// <summary>
    /// Get all available patients
    /// </summary>
    public void GetPatients(OnPatientsLoaded callback)
    {
        StartCoroutine(GetPatientsCoroutine(callback));
    }

    private IEnumerator GetPatientsCoroutine(OnPatientsLoaded callback)
    {
        using (UnityWebRequest request = UnityWebRequest.Get($"{apiBaseURL}/api/patients"))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                var response = JsonUtility.FromJson<PatientsResponse>(
                    request.downloadHandler.text
                );
                Debug.Log($"✓ Loaded {response.count} patients");
                callback?.Invoke(response.patients);
            }
            else
            {
                Debug.LogError($"✗ Failed to load patients: {request.error}");
                callback?.Invoke(new Patient[0]);
            }
        }
    }

    /// <summary>
    /// Get sessions for a specific patient
    /// </summary>
    public void GetPatientSessions(string patientId, OnSessionsLoaded callback)
    {
        StartCoroutine(GetPatientSessionsCoroutine(patientId, callback));
    }

    private IEnumerator GetPatientSessionsCoroutine(
        string patientId,
        OnSessionsLoaded callback
    )
    {
        using (UnityWebRequest request = UnityWebRequest.Get(
            $"{apiBaseURL}/api/sessions?patientId={patientId}"
        ))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                var response = JsonUtility.FromJson<SessionsResponse>(
                    request.downloadHandler.text
                );
                Debug.Log($"✓ Loaded {response.count} sessions for patient {patientId}");
                callback?.Invoke(response.sessions);
            }
            else
            {
                Debug.LogError($"✗ Failed to load sessions: {request.error}");
                callback?.Invoke(new GameSession[0]);
            }
        }
    }

    /// <summary>
    /// Set the API base URL (useful for production deployments)
    /// </summary>
    public void SetAPIBaseURL(string baseURL)
    {
        apiBaseURL = baseURL;
        Debug.Log($"API Base URL set to: {apiBaseURL}");
    }
}
