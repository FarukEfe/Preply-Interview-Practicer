import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
// Auth
import { authStore } from './lib/authStore';
// Components
import Navbar from './_component/Navbar';
// Pages
import Jobs from './pages/jobs/Jobs';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';

const App = () => {
  
  // auth store
  const authUser = authStore(state => state.authUser);

  const [res, setRes] = useState<any>(null);

  useEffect(() => {
    // Fetch initial data here
    console.log('Fetching initial data...');
    authStore.setState({ isSigningIn: false });
  }, [])

  // Debug
  // useEffect(() => { console.log(res); }, [res])

  // if (authStore.getState().isSigningIn) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //         <Loader className="animate-spin w-12 h-12 text-blue-500" />
  //     </div>
  //   )
  // }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={(authUser) ? <Jobs /> : <Navigate to="/signin" />} />
        {/* <Route path="/jobs" element={<Jobs />} /> */}
        <Route path="/dashboard" element={(authUser) ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={(authUser) ? <Navigate to="/dashboard" /> : <SignIn />} />
        <Route path="/signup" element={(authUser) ? <Navigate to="/dashboard" /> : <SignUp />} />
        {/* <Route path='/interviews' element={(authUser) ? <RibbonData /> : <Navigate to="/signin" />} /> */}
      </Routes>
    </div>
  )
}

export default App;