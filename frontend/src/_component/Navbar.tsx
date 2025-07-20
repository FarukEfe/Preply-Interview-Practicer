import React from 'react'
import { useNavigate } from 'react-router-dom'
import { authStore } from '../lib/authStore'
import { Button } from '../components/ui/button'

import { Link } from 'lucide-react'

import logo from '../../public/nailedit.png'

const Navbar = () => {
    const authUser = authStore(state => state.authUser)
    const signOut = authStore(state => state.signOut)
    const navigate = useNavigate()

    const handleSignOut = () => {
        signOut()
        navigate('/signin')
    }

    return (
        <nav className="bg-white border-b px-4 py-2 flex justify-between items-center">
            <div
                className="flex flex-row gap-2 text-xl font-bold cursor-pointer"
                onClick={() => navigate('/')}
            >
                {/* <Link to="/" className="flex items-center space-x-2">
                    <img src={logo} alt="NailedIt" />
                    <span className="text-xl font-bold text-gray-900">NailedIt</span>
                </Link> */}
                NailedIT
            </div>
            <div className="flex items-center gap-4">
                {/* Main navigation links */}
                <Button variant="ghost" onClick={() => navigate('/')}>
                    Home
                </Button>
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                    Dashboard
                </Button>
                <Button variant="ghost" onClick={() => navigate('/jobs')}>
                    Job Postings
                </Button>
                <Button variant="ghost" onClick={() => navigate('/jobs/applications')}>
                    Applications
                </Button>
                {/* Add more job-related pages as needed */}

                {authUser ? (
                    <>
                        <span>Welcome, {authUser.fullname || authUser.username}</span>
                        <Button variant="outline" onClick={handleSignOut}>
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate('/signin')}>
                            Sign In
                        </Button>
                        <Button onClick={() => navigate('/signup')}>
                            Sign Up
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
