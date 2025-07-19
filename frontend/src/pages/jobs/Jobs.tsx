import React, { useEffect, useState } from 'react';
import { getJobsFilter } from '../../api/rapid.ts'; // Assuming you have an API function to fetch jobs
import { authStore } from '../../lib/authStore.ts';

import { Loader } from 'lucide-react';
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { StaticJobsView } from "./JobsStatic.tsx"
import { ApiJobsView } from "./JobsAPI.tsx"

// Define default values for query filters. Allow user to change, and use the interface provided in rapid.ts

const Jobs = () => {

  const isLoadingJobs = authStore(state => state.isLoadingJobs);

  const [data, setData] = useState<any>(null);

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
    <div className="min-h-screen bg-gray-50">
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
            <StaticJobsView />
          </TabsContent>

          <TabsContent value="api">
            <ApiJobsView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Jobs