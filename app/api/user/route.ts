import { NextRequest, NextResponse } from "next/server"

// VULNERABILITY #50: Hardcoded secrets in code
const JWT_SECRET = "super_secret_key_123"
const DB_PASSWORD = "production_db_pass_456"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // VULNERABILITY #51: IDOR - Accessing any user by ID without auth
  const userId = searchParams.get("id")
  
  // VULNERABILITY #52: Path traversal possibility
  const file = searchParams.get("avatar") || "default.png"
  const avatarPath = `/uploads/avatars/${file}`
  
  // VULNERABILITY #53: SSRF - URL from user input
  const webhookUrl = searchParams.get("webhook")
  if (webhookUrl) {
    // Would fetch arbitrary URL
    console.log(`Would call webhook: ${webhookUrl}`)
  }

  const mockUser = {
    id: userId,
    email: "user@example.com",
    // VULNERABILITY #54: Exposing sensitive data
    passwordHash: "$2b$10$hashedpasswordexample",
    ssn: "123-45-6789",
    creditCard: "4111-1111-1111-1111",
    apiKey: "user_api_key_secret_789",
    avatarPath,
  }

  return NextResponse.json(mockUser, {
    headers: {
      // VULNERABILITY #55: Insecure cookie settings
      "Set-Cookie": `userId=${userId}; Path=/`,
      // Missing: HttpOnly, Secure, SameSite
    },
  })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  
  // VULNERABILITY #56: No CSRF token validation
  // VULNERABILITY #57: No authentication
  
  // VULNERABILITY #58: Unsafe redirect
  const redirectUrl = body.redirect || "/"
  
  // VULNERABILITY #59: Command injection possibility
  const username = body.username
  const command = `echo "User updated: ${username}"`
  console.log(`Would execute: ${command}`)

  return NextResponse.json({
    success: true,
    redirect: redirectUrl,
    // VULNERABILITY #60: Version disclosure
    serverVersion: "Apache/2.4.41 (Ubuntu)",
    phpVersion: "7.4.3",
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // VULNERABILITY #61: Weak password requirements
  const passwordRegex = /^.{3,}$/ // Only requires 3 characters
  
  if (!passwordRegex.test(body.password)) {
    return NextResponse.json({ error: "Password too short" }, { status: 400 })
  }
  
  // VULNERABILITY #62: Password stored in plain text
  const user = {
    email: body.email,
    password: body.password, // Not hashed!
    role: body.role || "user", // VULNERABILITY #63: Role can be set by user
  }
  
  // VULNERABILITY #64: User enumeration
  if (body.email === "admin@vulnshop.com") {
    return NextResponse.json({ 
      error: "This email is already registered" 
    }, { status: 400 })
  }

  // VULNERABILITY #65: Weak session token
  const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
  
  return NextResponse.json({
    success: true,
    user: { ...user, password: undefined },
    token: sessionToken,
    // VULNERABILITY #66: Debug info in response
    debug: {
      dbHost: "192.168.1.100",
      jwtSecret: JWT_SECRET.substring(0, 10) + "...",
    },
  })
}
