"use client"

import { Badge } from "../../components/ui/badge"
import { JobCard, type JobData } from "./JobCard"

// Mock static job data
const staticJobs: JobData[] = [
  {
    id: 1,
    employer_name: "TechCorp Inc.",
    employer_website: "https://techcorp.com",
    job_title: "Senior Frontend Developer",
    job_employment_type: "FULLTIME",
    job_is_remote: true,
    job_posted_at_datetime_utc: "2024-01-15T10:30:00Z",
    description:
      "We're looking for a senior frontend developer to join our growing team. You'll be responsible for building modern web applications using React, TypeScript, and Next.js. This role offers the opportunity to work on cutting-edge projects with a collaborative team.",
    job_location: "San Francisco, CA",
    job_country: "US",
  },
  {
    id: 2,
    employer_name: "StartupXYZ",
    employer_website: "https://startupxyz.io",
    job_title: "Product Manager",
    job_employment_type: "FULLTIME",
    job_is_remote: false,
    job_posted_at_datetime_utc: "2024-01-16T14:20:00Z",
    description:
      "Join our product team to drive innovation and growth. You'll work closely with engineering, design, and business teams to define product strategy and execute on our roadmap. Experience with SaaS products and agile methodologies preferred.",
    job_location: "New York, NY",
    job_country: "US",
  },
  {
    id: 3,
    employer_name: "Design Studio",
    employer_website: "https://designstudio.co",
    job_title: "UX/UI Designer",
    job_employment_type: "FULLTIME",
    job_is_remote: true,
    job_posted_at_datetime_utc: "2024-01-14T09:15:00Z",
    description:
      "Create beautiful and intuitive user experiences for our digital products. You'll be involved in the entire design process from user research to final implementation. Strong portfolio and experience with Figma required.",
    job_location: "Remote",
    job_country: "US",
  },
  {
    id: 4,
    employer_name: "CloudTech Solutions",
    employer_website: "https://cloudtech.com",
    job_title: "Backend Engineer",
    job_employment_type: "CONTRACTOR",
    job_is_remote: true,
    job_posted_at_datetime_utc: "2024-01-12T16:45:00Z",
    description:
      "Build scalable backend systems and APIs using modern technologies. You'll work with microservices architecture, cloud platforms, and help maintain our high-performance systems. Experience with Node.js and AWS required.",
    job_location: "Austin, TX",
    job_country: "US",
  },
]

interface StaticJobsViewProps {
  onApply?: (jobId: number) => void
  onSave?: (jobId: number) => void
}

export function StaticJobsView({ onApply, onSave }: StaticJobsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Default Job Templates</h2>
        <Badge variant="secondary">{staticJobs.length} jobs</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {staticJobs.map((job) => (
          <JobCard key={job.id} job={job} onApply={onApply} onSave={onSave} />
        ))}
      </div>
    </div>
  )
}
