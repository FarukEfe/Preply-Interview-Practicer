import React, { useState, useEffect } from 'react';
import { getTasks, analyzeVideo } from '../api/twelve';
import { authStore } from '../lib/authStore';
import { TaskProcessItem } from './TaskItem';

// Define the Task interface if not already defined
interface Task {
  id: string;
  status: string;
  videoId?: string;
  createdAt: string;
  updatedAt: string;
  indexId: string;
  videoUrl?: string;
}

const HomePage = () => {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [responseType, setResponseType] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks(authStore.getState().authUser?._id);
        if (response) {
          console.log("Fetched tasks:", response.tasks);
          setTasks(response.tasks);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => { console.log(tasks); }, [tasks]);
  useEffect(() => { console.log(analysis); }, [analysis]);

  const parseAnalysisResponse = (response: any) => {
    try {
      // If the response contains JSON-like analysis, try to parse it
      if (typeof response === 'string' && response.includes('{')) {
        const jsonMatch = response.match(/\{.*\}/s);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      return response;
    } catch (error) {
      return response; // Return original if parsing fails
    }
  };

  return (
    <>
      {tasks ? (
        tasks.map((task) => (
          <TaskProcessItem 
            key={task.id}
            task={task} 
            analyzeVideo={async () => {
              console.log("Analyzing video for task:", task.id);
              setAnalysis(null); // Clear previous analysis
              setResponseType(null);
              
              try {
                const response = await analyzeVideo(task.id);
                console.log("Analysis response:", response);
                setAnalysis(response);
                setResponseType('success');
              } catch (error: any) {
                console.error("Analysis error:", error);
                setAnalysis(error.response?.data || error.message || error);
                setResponseType('error');
              }
            }} 
          />
        ))
      ) : null}
      
      {/* Enhanced Response Display */}
      <div id="response" className="mt-6 max-w-6xl mx-auto p-6">
        {analysis && (
          <div className={`rounded-lg border p-6 ${
            responseType === 'error' 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              responseType === 'error' ? 'text-red-800' : 'text-green-800'
            }`}>
              {responseType === 'error' ? '❌ Analysis Error' : '✅ Video Analysis Results'}
            </h3>
            
            {responseType === 'success' ? (
              <div className="space-y-6">
                {/* Display specific metrics cards */}
                {(() => {
                  const parsedAnalysis = parseAnalysisResponse(analysis.analysis || analysis);
                  
                  if (typeof parsedAnalysis === 'object' && (
                    parsedAnalysis.confidence_score !== undefined || 
                    parsedAnalysis.enthusiasm !== undefined ||
                    parsedAnalysis.eye_contact !== undefined ||
                    parsedAnalysis.number_of_filler_words !== undefined
                  )) {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {parsedAnalysis.confidence_score !== undefined && (
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <div className="text-sm text-gray-600 mb-1">Confidence Score</div>
                            <div className="text-3xl font-bold text-blue-600">{parsedAnalysis.confidence_score}/100</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${parsedAnalysis.confidence_score}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {parsedAnalysis.enthusiasm !== undefined && (
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <div className="text-sm text-gray-600 mb-1">Enthusiasm</div>
                            <div className="text-3xl font-bold text-green-600">{parsedAnalysis.enthusiasm}/100</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${parsedAnalysis.enthusiasm}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {parsedAnalysis.eye_contact !== undefined && (
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <div className="text-sm text-gray-600 mb-1">Eye Contact</div>
                            <div className="text-3xl font-bold text-purple-600">{parsedAnalysis.eye_contact}/100</div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${parsedAnalysis.eye_contact}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {parsedAnalysis.number_of_filler_words !== undefined && (
                          <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <div className="text-sm text-gray-600 mb-1">Filler Words</div>
                            <div className="text-3xl font-bold text-red-600">{parsedAnalysis.number_of_filler_words}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {parsedAnalysis.number_of_filler_words <= 5 ? 'Excellent' : 
                               parsedAnalysis.number_of_filler_words <= 10 ? 'Good' : 
                               parsedAnalysis.number_of_filler_words <= 20 ? 'Fair' : 'Needs Improvement'}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  // Fallback for old format (confidence, enthusiasm, positivity)
                  if (typeof parsedAnalysis === 'object' && parsedAnalysis.confidence !== undefined) {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border shadow-sm">
                          <div className="text-sm text-gray-600 mb-1">Confidence</div>
                          <div className="text-3xl font-bold text-blue-600">{parsedAnalysis.confidence}/100</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${parsedAnalysis.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border shadow-sm">
                          <div className="text-sm text-gray-600 mb-1">Enthusiasm</div>
                          <div className="text-3xl font-bold text-green-600">{parsedAnalysis.enthusiasm}/100</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${parsedAnalysis.enthusiasm}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border shadow-sm">
                          <div className="text-sm text-gray-600 mb-1">Positivity</div>
                          <div className="text-3xl font-bold text-purple-600">{parsedAnalysis.positivity}/100</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${parsedAnalysis.positivity}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return null;
                })()}
                
                {/* Raw response */}
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium mb-2 text-gray-700">Full Analysis Response:</h4>
                  <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto whitespace-pre-wrap border">
                    {typeof analysis === 'object' 
                      ? JSON.stringify(analysis, null, 2)
                      : String(analysis)
                    }
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded border">
                <h4 className="font-medium mb-2 text-red-700">Error Details:</h4>
                <pre className="text-sm text-red-700 whitespace-pre-wrap bg-red-50 p-3 rounded border">
                  {typeof analysis === 'object' 
                    ? JSON.stringify(analysis, null, 2)
                    : String(analysis)
                  }
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;