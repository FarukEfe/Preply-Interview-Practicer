import React, { useState } from 'react'

// Components
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

// SignUp
import { userSignUp } from '../api/user'
import { authStore } from '../lib/authStore'

const SignUp = () => {

  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">Enter your information to create your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input onChange={
                (e) => setFullname(e.target.value)
              } id="fullname" name="fullname" type="text" placeholder="John Doe" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input onChange={
                (e) => setUsername(e.target.value)
              } id="username" name="username" type="text" placeholder="johndoe" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input onChange={
                (e) => setEmail(e.target.value)
              } id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input onChange={
                (e) => setPassword(e.target.value)
              } id="password" name="password" type="password" placeholder="••••••••" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input onChange={
                (e) => setConfirmPassword(e.target.value)
              } id="password" name="password" type="password" placeholder="••••••••" required />
            </div>

            <Button type="submit" className="w-full" onClick={
              (e) => {
                e.preventDefault();
                // Handle sign up logic here
                userSignUp(email, password, fullname, username).then(response => {
                  if (response) {
                    console.log("Sign up successful:", response);
                    authStore.setState({ authUser: response.data });
                    console.log(authStore.getState().authUser);
                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                  } else {
                    console.error("Sign up failed");
                  }
                }).catch(error => {
                  console.error("Error during sign up:", error);
                  // Maybe have error feedback instead of this
                  window.location.href = '/signup'; // Redirect to sign up on error
                })
              }
            }>
              Create Account
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="#" className="text-primary hover:underline">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp;