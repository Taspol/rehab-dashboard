/*
 * Example Game Manager - Demonstrates Dashboard Integration
 * 
 * This script shows a practical example of how to use the DashboardAPIClient
 * in a rehabilitation game. It handles game flow and uploads results.
 */

using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class RehabGameManager : MonoBehaviour
{
    [SerializeField]
    private DashboardAPIClient dashboardClient;

    // Game State
    [SerializeField]
    private string currentPatientId = "p001"; // Set this based on patient login

    [SerializeField]
    private string gameName = "Balance Master";

    [SerializeField]
    private string exerciseType = "Balance & Agility";

    // Game tracking
    private int gameScore = 0;
    private float gameStartTime = 0f;
    private bool gameActive = false;

    // UI References
    [SerializeField]
    private Text scoreDisplay;

    [SerializeField]
    private Text timerDisplay;

    [SerializeField]
    private Button startGameButton;

    [SerializeField]
    private Button endGameButton;

    private void Start()
    {
        // Ensure we have the API client
        if (dashboardClient == null)
        {
            dashboardClient = GetComponent<DashboardAPIClient>();
        }

        // Setup UI buttons
        if (startGameButton != null)
            startGameButton.onClick.AddListener(StartGame);
        if (endGameButton != null)
            endGameButton.onClick.AddListener(EndGame);

        // Optional: Get available patients to let user select
        LoadAvailablePatients();
    }

    private void Update()
    {
        // Update game timer if active
        if (gameActive && timerDisplay != null)
        {
            float elapsed = Time.time - gameStartTime;
            timerDisplay.text = $"Time: {elapsed:F1}s";
        }
    }

    public void StartGame()
    {
        gameActive = true;
        gameStartTime = Time.time;
        gameScore = 0;

        Debug.Log($"Game started - Patient: {currentPatientId}");
        Debug.Log($"Game: {gameName} | Exercise: {exerciseType}");
    }

    public void EndGame()
    {
        if (!gameActive)
            return;

        gameActive = false;
        float duration = (Time.time - gameStartTime) / 60f; // Convert to minutes

        // Simulate final score if not already set
        if (gameScore == 0)
        {
            gameScore = Random.Range(50, 95);
        }

        Debug.Log($"Game ended");
        Debug.Log($"Final Score: {gameScore}");
        Debug.Log($"Duration: {duration:F2} minutes");

        // Upload session to dashboard
        UploadGameSession(gameScore, (int)duration);
    }

    private void UploadGameSession(int finalScore, int durationMinutes)
    {
        if (dashboardClient == null)
        {
            Debug.LogError("Dashboard API Client not found!");
            return;
        }

        dashboardClient.UploadGameSession(
            currentPatientId,
            gameName,
            exerciseType,
            finalScore,
            durationMinutes,
            callback: (success, message) =>
            {
                if (success)
                {
                    Debug.Log("✓ Game session uploaded to dashboard");
                    ShowNotification("Session saved to dashboard!");
                }
                else
                {
                    Debug.LogWarning($"✗ Failed to upload session: {message}");
                    ShowNotification("Failed to save session");
                }
            }
        );
    }

    public void AddScore(int points)
    {
        if (gameActive)
        {
            gameScore += points;
            if (scoreDisplay != null)
            {
                scoreDisplay.text = $"Score: {gameScore}";
            }
        }
    }

    public void SetPatient(string patientId)
    {
        currentPatientId = patientId;
        Debug.Log($"Patient set to: {currentPatientId}");
    }

    private void LoadAvailablePatients()
    {
        dashboardClient.GetPatients((patients) =>
        {
            Debug.Log($"Available patients:");
            foreach (var patient in patients)
            {
                Debug.Log($"  - {patient.name} ({patient.id}) - {patient.condition}");
            }
        });
    }

    public void CheckPatientProgress(string patientId)
    {
        dashboardClient.GetPatientSessions(patientId, (sessions) =>
        {
            Debug.Log($"Patient {patientId} has {sessions.Length} recorded sessions:");
            foreach (var session in sessions)
            {
                Debug.Log(
                    $"  {session.date}: {session.gameName} - Score: {session.score} ({session.duration}m)"
                );
            }
        });
    }

    private void ShowNotification(string message)
    {
        // Implement your UI notification here
        Debug.Log($"[NOTIFICATION] {message}");
    }
}
