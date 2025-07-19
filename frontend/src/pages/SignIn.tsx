import { useState } from "react";

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { userSignIn } from "../api/user";
import { authStore } from "../lib/authStore";

export default function SignInPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
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

            <Button type="submit" className="w-full" onClick={(e) => {
                e.preventDefault();
                // Handle sign in logic here
                // console.log("Sign in with email:", email);
                // Call your sign-in API here
                userSignIn(email, password).then(response => {
                  if (response) {
                    console.log("Sign in successful:", response);
                    // Set user in auth store
                    authStore.setState({ authUser: response.data });
                    // Debug
                    // console.log(authStore.getState().authUser);
                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                  } else {
                    console.error("Sign in failed");
                  }
                }).catch(error => {
                  console.error("Error during sign in:", error);
                  // Maybe have error feedback instead of this
                  window.location.href = '/signin'; // Redirect to sign in on error
                })
              }
            }>
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
