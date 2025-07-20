"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Clock, Play, Trash2, Copy } from "lucide-react"
import { formatDistanceToNowStrict } from "date-fns"
import { createTask } from "../../api/twelve"
import { authStore } from "../../lib/authStore"

// Define the interface for your interview session object
export interface InterviewSession {
  interview_flow_id: string
  interview_id: string // UUID,
  interview_data: {
    video_url: string
  } | null,
  transcript: string,
  status: "incomplete" | "complete"
  userId: string
  createdAt: string // ISO date string
  flowData: {
    org_name: string,
    title: string
  }
}

interface InterviewSessionItemProps {
  session: InterviewSession
  onContinue?: (sessionId: string) => void
  onDelete?: (sessionId: string) => void
  onViewDetails?: (session: InterviewSession) => void
}

export function InterviewSessionItem({ session, onContinue, onDelete, onViewDetails }: InterviewSessionItemProps) {
  const formattedCreatedAt = formatDistanceToNowStrict(new Date(session.createdAt), { addSuffix: true })

  const handleContinue = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click from triggering
    const user = authStore.getState().authUser;
    if (!session.interview_data || !user) {
      console.error("No video URL available for this session")
      return
    }
    // console.log(user);
    createTask(session.interview_data.video_url, user.twelveIndexId, user._id).then(response => {
      if (response) {
        console.log("Task created successfully:", response);
        
      } else {
        console.error("Failed to create task for session:", session.interview_id);
      }
    }).catch(error => {
      console.error("Error creating task:", error);
    })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click from triggering
    onDelete?.(session.interview_id)
  }

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(session.interview_id)
    // Optionally, add a toast notification here
    console.log("Copied interview ID:", session.interview_id)
  }

  const handleCopyIdTemplate = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(session.interview_flow_id)
    // Optionally, add a toast notification here
    console.log("Copied interview ID:", session.interview_id)
  }


  const handleViewDetails = () => {
    onViewDetails?.(session)
  }

  const getStatusBadgeVariant = (status: boolean) => {
    if (status) {
      return "secondary"
    }

    return "destructive"
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 min-w-[550px] w-3/6 cursor-pointer" onClick={handleViewDetails}>
      <CardHeader className="pb-2">
        <div className="flex flex-col items-start justify-between">
            <div className="flex items-center justify-between w-full">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                Interview Flow: {session.interview_flow_id}
                <Badge variant={getStatusBadgeVariant(!session.interview_data)} className="text-xs">
                {session.status.replace(/_/g, " ")}
                </Badge>
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formattedCreatedAt}</span>
            </div>
            </div>
            <span className="text-sm text-muted-foreground">{session.flowData.org_name}</span>
        </div>
      </CardHeader>
      <CardContent className="flex gap-8 justify-between items-center pt-2">
        <div className="flex flex-col">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-mono text-xs">ID: {session.interview_flow_id.substring(0, 8)}...</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyIdTemplate}>
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Template ID</span>
                </Button>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-mono text-xs">ID: {session.interview_id.substring(0, 8)}...</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyId}>
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Interview ID</span>
                </Button>
            </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleContinue} disabled={!session.interview_data}>
            <Play className="h-4 w-4 mr-1" />
            Submit For Review
          </Button>
          {/* <Button size="sm" variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button> */}
        </div>
      </CardContent>
    </Card>
  )
}
