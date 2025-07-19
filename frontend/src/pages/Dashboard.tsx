import React, { useEffect, useState } from 'react'

import { InterviewTemplateList } from './interview/InteriewTemplateList'
import type { InterviewTemplate } from './interview/InteriewTemplateList'
import { backend } from '../lib/axios'
import { getTemplates } from '../api/ribbon'
import { authStore } from '../lib/authStore'
import { Loader } from 'lucide-react'

const Dashboard = () => {

  const [templates, setTemplates] = useState<InterviewTemplate[] | null>([])

  useEffect(() => {
    const fetchTemplates = async () => {
      authStore.setState({ isGettingFlow: true })
      console.log(authStore.getState().authUser)
      try {
        getTemplates(authStore.getState().authUser?._id).then(response => {
          if (response && response.data) {
            console.log(response.data.data)
            setTemplates(response.data.data)
          } else {
            console.error("Failed to fetch templates")
          }
        })
        
      } catch (error) {
        console.error("Error fetching templates:", error)
      }
      authStore.setState({ isGettingFlow: false })
    }
    fetchTemplates()

  }, []);

  // Return loader if templates are still being fetched using lucide-react loader
  if (authStore.getState().isGettingFlow) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin w-12 h-12 text-blue-500" />
        <p className="ml-4 text-lg">Loading templates...</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4 p-6 bg-gray-50 min-h-screen min-w-fit max-w-screen'>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your dashboard! Here you can manage your interviews, templates, and more.</p>
      {/* Add more dashboard content here */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Your Interviews</h2>
        {/* List of interviews will go here */}
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Templates</h2>
        {/* List of templates will go here */}
        {
          (!templates) ? (
            <p className="text-gray-500">No templates available at the moment.</p>
          ) : (
            <InterviewTemplateList
              templates={templates} // Pass your templates data here
              onEdit={(template) => console.log('Edit template:', template)}
              onCopy={(template) => console.log('Copy template:', template)}
              onDelete={(templateId) => console.log('Delete template with ID:', templateId)}
              onUse={(template) => console.log('Use template:', template)}
              onCreateNew={() => console.log('Create new template')}
            />
          )
        }
      </div>
    </div>
  )
}

export default Dashboard;