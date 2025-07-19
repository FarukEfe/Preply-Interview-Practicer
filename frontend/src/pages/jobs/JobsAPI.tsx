import { useState } from "react"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { JobCard, type JobData } from "./JobCard"

// Mock API job data
const apiJobs: JobData[] = [
  {
    id: 101,
    employer_name: "CloudFirst",
    employer_website: "https://cloudfirst.dev",
    job_title: "DevOps Engineer",
    job_employment_type: "FULLTIME",
    job_is_remote: true,
    job_posted_at_datetime_utc: "2024-01-17T08:00:00Z",
    description:
      "Manage cloud infrastructure and deployment pipelines. You'll be responsible for maintaining our Kubernetes clusters, implementing CI/CD processes, and ensuring system reliability and scalability.",
    job_location: "Seattle, WA",
    job_country: "US",
  },
  {
    id: 102,
    employer_name: "AI Innovations",
    employer_website: "https://ai-innovations.com",
    job_title: "Data Scientist",
    job_employment_type: "PARTTIME",
    job_is_remote: false,
    job_posted_at_datetime_utc: "2024-01-17T12:30:00Z",
    description:
      "Analyze complex datasets and build machine learning models to drive business insights. You'll work with large-scale data processing, statistical analysis, and collaborate with cross-functional teams.",
    job_location: "Boston, MA",
    job_country: "US",
  },
]

interface ApiJobsViewProps {
  onApply?: (jobId: number) => void
  onSave?: (jobId: number) => void
  onRefresh?: () => void
}

export function ApiJobsView({ onApply, onSave, onRefresh }: ApiJobsViewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState<JobData[]>(apiJobs)

  const handleRefresh = async () => {
    setIsLoading(true)
    onRefresh?.()

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch from your API here
      // const newJobs = await fetchJobsFromApi()
      // setJobs(newJobs)
      setIsLoading(false)
    }, 1500)
  }

  // Auto-refresh when component mounts (simulate real-time updates)
  // useEffect(() => {
  //   const interval = setInterval(handleRefresh, 30000) // Refresh every 30 seconds
  //   return () => clearInterval(interval)
  // }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Live Job Postings</h2>
        <div className="flex items-center gap-2">
          {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
          <Badge variant="secondary">{jobs.length} jobs</Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={onApply} onSave={onSave} />
          ))}
        </div>
      )}
    </div>
  )
}
