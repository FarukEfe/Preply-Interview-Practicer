import React, { useState, useEffect } from 'react'
import { InterviewSessionItem, type InterviewSession } from "./InterviewSessionItem"
import { Button } from '../../components/ui/button'
import { authStore } from '../../lib/authStore'
import { getInterviews } from '../../api/ribbon'

const Interview = () => {
  const [sessions, setSessions] = useState<InterviewSession[] | null>(null)

  useEffect(() => {
    authStore.setState({ isGettingInterview: true });
    const fetchSessions = async () => {
        getInterviews(authStore.getState().authUser?._id).then(response => {
            if (response && response.data) {
                console.log("Fetched interview sessions:", response.data.data)
                setSessions(response.data.data)
            } else {
                console.error("Failed to fetch interview sessions")
            }
        }).catch(error => {
            console.error("Error fetching interview sessions:", error)
        });
        authStore.setState({ isGettingInterview: false });
    }

    fetchSessions();
  })

  if (!sessions) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading interview sessions...</p>
      </div>
    )
  }

  const handleContinue = (sessionId: string) => {
    console.log("Continuing session:", sessionId)
    // Implement navigation to the interview flow
  }

  const handleDelete = (sessionId: string) => {
    console.log("Deleting session:", sessionId)
    setSessions(sessions.filter((s) => s.interview_id !== sessionId))
  }

  const handleViewDetails = (session: InterviewSession) => {
    console.log("Viewing details for session:", session.interview_id, session)
    // Implement opening a modal or navigating to a detailed page
  }

  const handleCreateNewSession = () => {
    console.log("Creating new interview session")
    // Implement logic to start a new session
  }
  
  return (
        <>
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <InterviewSessionItem
                key={session.interview_id}
                session={session}
                onContinue={handleContinue}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No interview sessions found.</p>
              <Button onClick={handleCreateNewSession} className="mt-4">
                Start your first session
              </Button>
            </div>
          )}
        </>
  )
}

export default Interview