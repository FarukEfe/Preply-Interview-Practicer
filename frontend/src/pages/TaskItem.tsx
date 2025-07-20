"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Clock, CheckCircle, Hourglass, XCircle, Eye, Trash2, RefreshCw } from "lucide-react"
import { formatDistanceToNowStrict } from "date-fns"

// Define the interface for your job process object
import type { Task } from "./HomePage"

interface TaskProcessItemProps {
  task: Task
  analyzeVideo: (job: string) => void
  onCancel?: (jobId: string) => void
  onRetry?: (jobId: string) => void
  onDelete?: (jobId: string) => void
}

export function TaskProcessItem({ task, analyzeVideo, onCancel, onRetry, onDelete }: TaskProcessItemProps) {
  const formattedCreatedAt = formatDistanceToNowStrict(new Date(task.createdAt), { addSuffix: true })
  const formattedUpdatedAt = formatDistanceToNowStrict(new Date(task.updatedAt), { addSuffix: true })

  const getStatusBadgeVariant = (status: boolean) => {
    if (status) {
        return "ready"
    } else {
        return "processing"
    }
  }

  const getStatusIcon = (status: boolean) => {
    if (status) {
        return <CheckCircle className="h-4 w-4 text-green-500" />
    } else {
        return <Hourglass className="h-4 w-4 text-yellow-500" />
    }
  }

  const handleAnalysis = () => {
    analyzeVideo(task.id)
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
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${(task.status === "ready") ? "cursor-pointer" : "cursor-default"}`} onClick={() => { if (task.status === "ready") handleAnalysis(); }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {`Upload: ${task.id.substring(0, 6)}`}
            <Badge variant="secondary" className="text-xs capitalize">
              <span className="flex items-center gap-1">
                {getStatusIcon(task.status === "ready")}
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
        </div>
        <div className="flex gap-2">
          {task.status === "pending" || task.status === "failed" ? (
            <Button size="sm" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          ) : null}
          {(task.status === "pending" || task.status === "in_progress") && (
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={handleAnalysis} disabled={task.status !== "ready"}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">View Details</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
