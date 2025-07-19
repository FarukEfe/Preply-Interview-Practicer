"use client"

import type { JobInterface } from "../../api/rapid"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { MapPin, Clock, Building2, ExternalLink, Globe } from "lucide-react"

// Helper function to format employment type
function formatEmploymentType(type: string) {
  const types: { [key: string]: string } = {
    FULLTIME: "Full-time",
    PARTTIME: "Part-time",
    CONTRACTOR: "Contract",
    INTERN: "Internship",
  }
  return types[type] || type
}

// Helper function to format posted date
function formatPostedDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))

  if (diffDays === 0) {
    if (diffHours === 0) return "Just posted"
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  }
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
}

interface JobCardProps {
  job: JobInterface
  onApply?: (jobId: number) => void
  onSave?: (jobId: number) => void
}

export function JobCard({ job }: JobCardProps) {

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-xl">{job.job_title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{job.employer_name}</span>
              {job.employer_website && (
                <a
                  href={job.employer_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1">
            <Badge variant={job.job_is_remote ? "default" : "secondary"}>
              {job.job_is_remote ? "Remote" : "On-site"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {formatEmploymentType(job.job_employment_type)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.job_location}
          </div>
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            {job.job_country}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatPostedDate(job.job_posted_at_datetime_utc)}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={() => {}}>
            Create Template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
