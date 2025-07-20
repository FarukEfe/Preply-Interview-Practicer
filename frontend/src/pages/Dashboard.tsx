import React, { use, useEffect, useState } from 'react'

import { InterviewTemplateList } from './interview/InteriewTemplateList'
import Interview from './interview/Interview'
import type { InterviewTemplate } from './interview/InteriewTemplateList'
import { backend } from '../lib/axios'
import { createInterview, getTemplates } from '../api/ribbon'
import { authStore } from '../lib/authStore'
import { Loader } from 'lucide-react'

import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

  const [templates, setTemplates] = useState<InterviewTemplate[] | null>([])

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      authStore.setState({ isGettingFlow: true })
      // console.log(authStore.getState().authUser)
      try {
        getTemplates(authStore.getState().authUser?._id).then(response => {
          if (response && response.data) {
            console.log(response)
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
  if (authStore.getState().isGettingInterview || authStore.getState().isGettingFlow) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin w-12 h-12 text-blue-500" />
        <p className="ml-4 text-lg">Loading templates...</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4 p-6 bg-gray-50 min-h-screen max-w-screen'>
      <h1 className="text-2xl font-bold mb-4 w-screen px-10 text-left">Dashboard</h1>
      {/* <p>Welcome to your dashboard! Here you can manage your interviews, templates, and more.</p> */}
      {/* Add more dashboard content here */}
      <div className='w-full max-w-screen flex flex-col align-top items-start justify-middle'>
        <div className="mt-6 p-2">
          <h2 className="text-xl font-semibold">Your Interviews</h2>
          {/* List of interviews will go here */}
          <Interview />
        </div>
        <div className="mt-6 p-2">
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
                onUse={(template) => {
                  authStore.setState({ isCreatingInterview: true });
                  console.log(authStore.getState().authUser)
                  createInterview(template.interview_flow_id, authStore.getState().authUser?._id).then(response => {
                    if (response) {
                      console.log("Interview created successfully:", response);
                      // Optionally, you can show a success message or update the UI
                      // Show success popup, with button that navigates the user to created flows (from there to create templates)
                      console.log(response.data.data.interview_link)
                      window.open(response.data.data.interview_link, "_blank"); // Redirect to interview link
                      navigate('/jobs'); // Redirect to dashboard after creating interview
                    } else {
                      console.error("Failed to create interview");
                    }
                  }).catch(error => {
                    console.error("Error creating interview:", error);
                  })
                  authStore.setState({ isCreatingInterview: false });
                }}
                onCreateNew={() => console.log('Create new template')}
              />
            )
          }
        </div>
      </div>

      {/* <div>
        <div>
          <div className="mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Interview Sessions</h1>
            <p className="text-gray-600 mt-2">Manage your ongoing and completed interviews</p>
          </div>

          <Interview />
        </div>
      </div> */}
    </div>
  )
}

export default Dashboard;