import { Badge } from "../../components/ui/badge"
import type { JobInterface } from "../../api/rapid"
import { JobCard } from "./JobCard";

// Mock static job data
const staticJobs: JobInterface[] = [
  {
    employer_name: "Tech Innovators Inc.",
    employer_website: "https://techinnovators.com",
    job_title: "Software Engineer",
    job_employment_type: "Full-time",
    job_is_remote: true,
    job_posted_at_datetime_utc: "2023-10-01T12:00:00Z",
    description: "Join our team to build cutting-edge software solutions.",
    job_location: "Remote",
    job_country: "US",
    job_description: "We are looking for a skilled software engineer to join our team.",
    job_id: "job-001"
  },
  {
    employer_name: "Global Solutions Ltd.",
    employer_website: "https://globalsolutions.com",
    job_title: "Data Analyst",
    job_employment_type: "Part-time",
    job_is_remote: false,
    job_posted_at_datetime_utc: "2023-10-02T09:30:00Z",
    description: "Analyze data to help drive business decisions.",
    job_location: "New York, NY",
    job_country: "US",
    job_description: "Seeking a data analyst with experience in SQL and Python.",
    job_id: "job-002"
  },
  {
    employer_name: "Creative Minds Agency",
    employer_website: "https://creativeminds.com",
    job_title: "Graphic Designer",
    job_employment_type: "Contractor",
    job_is_remote: true,
    job_posted_at_datetime_utc: "2023-10-03T15:45:00Z",
    description: "Design stunning visuals for our clients.",
    job_location: "Remote",
    job_country: "US",
    job_description: "Looking for a creative graphic designer with a strong portfolio.",
    job_id: "job-003"
  },
  {
    employer_name: "HealthTech Solutions",
    employer_website: "https://healthtechsolutions.com",
    job_title: "Product Manager",
    job_employment_type: "Full-time",
    job_is_remote: false,
    job_posted_at_datetime_utc: "2023-10-04T08:20:00Z",
    description: "Lead product development for our health tech products.",
    job_location: "San Francisco, CA",
    job_country: "US",
    job_description: "Experienced product manager needed for innovative health tech projects.",
    job_id: "job-004"
  },
];


export function StaticJobsView({ selectJob }: { selectJob: (job: JobInterface) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Default Job Templates</h2>
        <Badge variant="secondary">{staticJobs.length} jobs</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {staticJobs.map((job) => (
          <JobCard key={job.job_id} job={job} selectJob={() => { selectJob(job); }} />
        ))}
      </div>
    </div>
  )
}
