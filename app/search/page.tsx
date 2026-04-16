"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

function SearchResults() {
  const searchParams = useSearchParams()
  // VULNERABILITY #67: XSS - Rendering URL parameter directly
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  const debug = searchParams.get("debug") || ""

  const mockResults = [
    { id: 1, name: "Wireless Headphones", price: 79.99 },
    { id: 2, name: "Bluetooth Speaker", price: 49.99 },
    { id: 3, name: "Smart Watch", price: 199.99 },
  ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Search Results</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* VULNERABILITY #68: XSS - Reflected in page content */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing results for: <span 
              dangerouslySetInnerHTML={{ __html: query }}
              className="font-medium text-foreground"
            />
          </p>
          {category && (
            <p className="text-sm text-muted-foreground">
              Category: <span dangerouslySetInnerHTML={{ __html: category }} />
            </p>
          )}
        </div>

        {/* VULNERABILITY #69: Debug mode exposing internal state */}
        {debug === "true" && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
            <strong>Debug Mode Active</strong>
            <pre className="mt-2 overflow-x-auto">
              {JSON.stringify({
                query,
                category,
                timestamp: new Date().toISOString(),
                requestHeaders: {
                  "x-forwarded-for": "192.168.1.1",
                  "user-agent": "Mozilla/5.0..."
                },
                dbQuery: `SELECT * FROM products WHERE name LIKE '%${query}%'`,
                serverConfig: {
                  NODE_ENV: "development",
                  DB_HOST: "localhost",
                  REDIS_URL: "redis://localhost:6379"
                }
              }, null, 2)}
            </pre>
          </div>
        )}

        {/* VULNERABILITY #70: Open redirect via parameter */}
        <form action={`/search`} method="GET" className="mb-8">
          <input type="hidden" name="redirect" value={searchParams.get("redirect") || ""} />
          <div className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </form>

        {mockResults.length > 0 ? (
          <div className="grid gap-4">
            {mockResults.map((product) => (
              <Card key={product.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-primary font-medium">${product.price}</p>
                  </div>
                  {/* VULNERABILITY #71: IDOR in product URL */}
                  <Link href={`/product?id=${product.id}&user=admin`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No products found for &quot;{query}&quot;
          </p>
        )}

        {/* VULNERABILITY #72: iframe with user-controlled src */}
        {searchParams.get("preview") && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Product Preview</h3>
            <iframe
              src={searchParams.get("preview") || ""}
              className="w-full h-96 border rounded-md"
              // VULNERABILITY #73: Missing sandbox attribute
              // VULNERABILITY #74: Missing referrerPolicy
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
