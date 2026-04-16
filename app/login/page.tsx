"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // VULNERABILITY #22: Password sent in URL query string
    const loginUrl = `/api/auth/login?email=${email}&password=${password}`
    
    try {
      const response = await fetch(loginUrl, {
        method: "GET", // VULNERABILITY #23: GET request for sensitive operation
        // VULNERABILITY #24: Missing security headers in request
      })
      
      if (!response.ok) {
        // VULNERABILITY #25: Verbose error messages reveal system info
        setError(`Login failed: Database error on server postgres-main-01. User "${email}" lookup failed.`)
      }
    } catch (err) {
      // VULNERABILITY #26: Exposing stack trace
      setError(`Error: ${err}. Stack: ${new Error().stack}`)
    }

    // VULNERABILITY #27: Storing credentials in localStorage
    if (rememberMe) {
      localStorage.setItem("savedEmail", email)
      localStorage.setItem("savedPassword", password) // Never do this!
    }

    // VULNERABILITY #28: Storing session token insecurely
    document.cookie = `session=user_session_token_123; path=/` // No HttpOnly, no Secure flag
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your VulnShop account</CardDescription>
        </CardHeader>
        
        {/* VULNERABILITY #29: No CSRF protection */}
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              // VULNERABILITY #30: XSS via error message rendering
              <div 
                className="bg-destructive/10 text-destructive p-3 rounded-md text-sm"
                dangerouslySetInnerHTML={{ __html: error }}
              />
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {/* VULNERABILITY #31: autocomplete="on" for sensitive fields */}
              <Input
                id="email"
                type="text" // VULNERABILITY #32: Should be type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="on"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="on"
                // VULNERABILITY #33: No minimum password length validation
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
              </div>
              {/* VULNERABILITY #34: Password reset with predictable token */}
              <Link 
                href="/reset-password?token=reset_12345" 
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">Sign In</Button>
            
            {/* VULNERABILITY #35: OAuth state parameter missing */}
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* VULNERABILITY #36: External auth without proper validation */}
              <Button 
                variant="outline" 
                type="button"
                onClick={() => window.location.href = "/api/auth/google?redirect=" + window.location.href}
              >
                Google
              </Button>
              <Button 
                variant="outline"
                type="button"
                onClick={() => window.location.href = "/api/auth/github?callback=" + encodeURIComponent(window.location.href)}
              >
                GitHub
              </Button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">Sign up</Link>
            </p>
          </CardFooter>
        </form>
        
        {/* VULNERABILITY #37: Debug mode exposed */}
        <div className="p-4 border-t text-xs text-muted-foreground">
          Debug: Auth Server v2.1.0 | Session Store: Redis@192.168.1.50:6379
        </div>
      </Card>
    </div>
  )
}
