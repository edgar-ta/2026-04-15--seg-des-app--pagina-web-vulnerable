import { NextRequest, NextResponse } from "next/server"

// VULNERABILITY #38: SQL Injection - Query built with string concatenation
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || ""
  const search = searchParams.get("search") || ""
  const sort = searchParams.get("sort") || "name"
  const userId = searchParams.get("userId") || ""

  // VULNERABILITY: SQL built from user input without parameterization
  const sqlQuery = `SELECT * FROM products WHERE category = '${category}' AND name LIKE '%${search}%' ORDER BY ${sort}`
  
  // VULNERABILITY #39: IDOR - User can access any user's data
  const userQuery = `SELECT * FROM users WHERE id = ${userId}`

  console.log("Executing SQL:", sqlQuery)
  console.log("User query:", userQuery)

  // Mock product data
  const products = [
    { id: 1, name: "Wireless Headphones", price: 79.99, category: "electronics" },
    { id: 2, name: "Smart Watch", price: 199.99, category: "electronics" },
    { id: 3, name: "Running Shoes", price: 129.99, category: "sports" },
  ]

  // VULNERABILITY #40: CORS misconfiguration - allows all origins
  return NextResponse.json(
    { products, debug: { query: sqlQuery } },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
        // VULNERABILITY #41: Missing security headers
        // No X-Content-Type-Options
        // No X-Frame-Options
        // No Content-Security-Policy
      },
    }
  )
}

// VULNERABILITY #42: No rate limiting on POST
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // VULNERABILITY #43: Mass assignment vulnerability
  const product = {
    id: Math.random(),
    ...body, // Accepts any field from user input including isAdmin, price, etc.
  }

  // VULNERABILITY #44: No input validation
  // VULNERABILITY #45: Reflected data without sanitization
  return NextResponse.json({
    success: true,
    message: `Product "${body.name}" created successfully`,
    product,
  })
}

// VULNERABILITY #46: HTTP methods not properly restricted
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  
  // VULNERABILITY #47: No authentication check
  // VULNERABILITY #48: No authorization check
  
  return NextResponse.json({
    success: true,
    message: `Product ${id} deleted`,
    // VULNERABILITY #49: Information disclosure
    deletedBy: "admin@vulnshop.com",
    serverTime: new Date().toISOString(),
    serverInfo: {
      hostname: "prod-server-01",
      version: "1.0.0",
      nodeVersion: process.version,
    },
  })
}
