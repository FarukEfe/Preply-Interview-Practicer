import { useState } from "react"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { JobCard } from "./JobCard"

import type { QueryInterface, JobInterface } from "../../api/rapid"

interface ApiJobsViewProps {
  data: QueryInterface
  onApply?: (jobId: number) => void
  onSave?: (jobId: number) => void
  onRefresh?: () => void
}

export function ApiJobsView({ data, onApply, onSave, onRefresh }: ApiJobsViewProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [job_data, setJobData] = useState<QueryInterface>(data)

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
          <Badge variant="secondary">{job_data.data.length} jobs</Badge>
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
          {job_data.data.map((job: JobInterface) => (
            <JobCard key={job.job_id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
