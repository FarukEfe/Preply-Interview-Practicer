import React from 'react'
import { useNavigate } from 'react-router-dom'
import { authStore } from '../lib/authStore'
import { Button } from '../components/ui/button'

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
      <div className="text-xl font-bold">Interview Practicer</div>
      <div className="flex items-center gap-4">
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