"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Clock, CheckCircle, Hourglass, XCircle, Eye, Trash2, RefreshCw } from "lucide-react"
import { formatDistanceToNowStrict } from "date-fns"

// Define the Task interface directly here (don't import from HomePage)
interface Task {
  id: string;
  status: string;
  videoId?: string;
  createdAt: string;
  updatedAt: string;
  indexId: string;
  videoUrl?: string;
}

interface TaskProcessItemProps {
  task: Task
  analyzeVideo: () => void  // Changed: no parameter needed
  onCancel?: (jobId: string) => void
  onRetry?: (jobId: string) => void
  onDelete?: (jobId: string) => void
}

export function TaskProcessItem({ task, analyzeVideo, onCancel, onRetry, onDelete }: TaskProcessItemProps) {
  const formattedCreatedAt = formatDistanceToNowStrict(new Date(task.createdAt), { addSuffix: true })
  const formattedUpdatedAt = formatDistanceToNowStrict(new Date(task.updatedAt), { addSuffix: true })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ready":
        return "default"
      case "pending":
        return "secondary"
      case "in_progress":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "in_progress":
        return <Hourglass className="h-4 w-4 text-blue-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const handleAnalysis = () => {
    analyzeVideo()  // No parameter passed
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCancel?.(task.id)
  }

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRetry?.(task.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(task.id)
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${
      (task.status === "ready") ? "cursor-pointer" : "cursor-default"
    }`} onClick={() => { 
      if (task.status === "ready") handleAnalysis(); 
    }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {`Upload: ${task.id.substring(0, 8)}`}
            <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs capitalize">
              <span className="flex items-center gap-1">
                {getStatusIcon(task.status)}
                {task.status.replace(/_/g, " ")}
              </span>
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Created {formattedCreatedAt}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex justify-between items-center pt-2">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>Last updated {formattedUpdatedAt}</span>
          {task.videoId && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              Video ID: {task.videoId.substring(0, 8)}...
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {/* Retry button for failed or pending tasks */}
          {(task.status === "pending" || task.status === "failed") && (
            <Button size="sm" variant="outline" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          )}
          
          {/* Cancel button for in-progress tasks */}
          {(task.status === "pending" || task.status === "in_progress") && (
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
          
          {/* Analyze button - only enabled when ready */}
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              handleAnalysis();
            }}
            disabled={task.status !== "ready"}
            className={task.status === "ready" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
          >
            <Eye className="h-4 w-4 mr-1" />
            {task.status === "ready" ? "Analyze" : "Processing..."}
          </Button>
          
          {/* Delete button */}
          <Button size="sm" variant="ghost" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Export the Task interface so HomePage can use it
export type { Task }