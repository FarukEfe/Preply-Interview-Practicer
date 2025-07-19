import React, { useEffect, useState } from 'react';
import { getJobsFilter } from '../../api/rapid.ts'; // Assuming you have an API function to fetch jobs
import { authStore } from '../../lib/authStore.ts';

import { Loader } from 'lucide-react';

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
    <div>Jobs</div>
  )
}

export default Jobs