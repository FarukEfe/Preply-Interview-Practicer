"use client"

import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Separator } from "../../components/ui/separator"
import { ScrollArea } from "../../components/ui/scroll-area"
import { MapPin, Clock, Building2, ExternalLink, Globe, Users } from "lucide-react"

import type { JobInterface } from "../../api/rapid"

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

interface JobDetailsModalProps {
  job: JobInterface
  isOpen: boolean
  onClose: () => void
  createTemplate: (job: JobInterface) => void
}

export function JobDetailsModal({ job, isOpen, onClose, createTemplate }: JobDetailsModalProps) {

  if (!job) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <DialogTitle className="text-2xl font-bold">{job.job_title}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5" />
                    <span>{job.employer_name}</span>
                    {job.employer_website && (
                      <a
                        href={job.employer_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </DialogDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={job.job_is_remote ? "default" : "secondary"} className="text-sm">
                    {job.job_is_remote ? "Remote" : "On-site"}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {formatEmploymentType(job.job_employment_type)}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <Separator className="my-6" />

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p>{job.job_location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Globe className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-foreground">Country</p>
                    <p>{job.job_country}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-foreground">Posted</p>
                    <p>{formatPostedDate(job.job_posted_at_datetime_utc)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <div>
                    <p className="font-medium text-foreground">Employment Type</p>
                    <p>{formatEmploymentType(job.job_employment_type)}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Job Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Job Description</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Mock additional details - you can expand this based on your API */}
            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Requirements</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Bachelor's degree or equivalent experience</li>
                  <li>• 3+ years of relevant experience</li>
                  <li>• Strong communication skills</li>
                  <li>• Ability to work in a fast-paced environment</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Benefits</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Competitive salary</li>
                  <li>• Health, dental, and vision insurance</li>
                  <li>• 401(k) with company matching</li>
                  <li>• Flexible work arrangements</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button variant="outline" onClick={() => {
                createTemplate(job);
              }}>
                Create Template
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
