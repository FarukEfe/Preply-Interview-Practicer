import React, { useEffect, useState } from 'react';
import { getJobsFilter, type JobInterface } from '../../api/rapid.ts'; // Assuming you have an API function to fetch jobs
import { authStore } from '../../lib/authStore.ts';

import { Loader } from 'lucide-react';
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"

import { StaticJobsView } from "./JobsStatic.tsx"
import { ApiJobsView } from "./JobsAPI.tsx"
import { JobDetailsModal } from './JobModal.tsx';
import { createTemplate } from '../../api/ribbon.ts';

// Define default values for query filters. Allow user to change, and use the interface provided in rapid.ts

const Jobs = () => {

  const isLoadingJobs = authStore(state => state.isLoadingJobs);

  const [data, setData] = useState<any>(null);
  const [job, setJob] = useState<JobInterface | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      const _new_data = await getJobsFilter();
      setData(_new_data);
    }
    authStore.setState({ isLoadingJobs: true });
    // Fetch jobs when the component mounts
    fetchJobs().then(() => {
      authStore.setState({ isLoadingJobs: false });
    }).catch((err) => {
      console.error('Error fetching jobs:', err);
      authStore.setState({ isLoadingJobs: false });
    });
  }, []);

  useEffect(() => { console.log(data); }, [data]);

  if (isLoadingJobs) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-12 h-12 text-blue-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Could not fetch data. Please try later.</p>
      </div>
    );
  }

  return (
    // Display the job details modal if a job is selected
    <div className="min-h-screen bg-gray-50">
      {/* Modal */}
      {job && (
        <JobDetailsModal
          job={job}
          isOpen={!!job}
          createTemplate={(job: JobInterface) => {
            // make the backend call to create a job template (including user id to pair with)
            console.log("Creating template for job id:", job.job_id);
            createTemplate(job, authStore.getState().authUser?.id).then(response => {
              if (response) {
                console.log("Template created successfully:", response);
                // Optionally, you can show a success message or update the UI
                // Show success popup, with button that navigates the user to created flows (from there to create templates)
              } else {
                console.error("Failed to create template");
              }
            }).catch(error => {
              console.error("Error creating template:", error);
            }
            )
          }}
          onClose={() => setJob(null)}
        />
      )}
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600 mt-2">Find your next opportunity</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="static" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="static">Static Templates</TabsTrigger>
              <TabsTrigger value="api">API Job Postings</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="outline">
                Refresh Jobs
              </Button>
              <Button>Post a Job</Button>
            </div>
          </div>

          <TabsContent value="static">
            <StaticJobsView selectJob={setJob} />
          </TabsContent>

          <TabsContent value="api">
            <ApiJobsView data={data} selectJob={setJob} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Jobs