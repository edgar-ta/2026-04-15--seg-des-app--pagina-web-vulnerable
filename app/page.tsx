"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Search, User, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// VULNERABILITY #1: Hardcoded credentials exposed in client-side code
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123"
}

// VULNERABILITY #2: Sensitive API keys in client code
const API_KEY = "sk_live_abc123xyz789secretkey"

const products = [
  { id: 1, name: "Wireless Headphones", price: 79.99, rating: 4.5, image: "/placeholder.svg?height=200&width=200", category: "Electronics" },
  { id: 2, name: "Smart Watch", price: 199.99, rating: 4.8, image: "/placeholder.svg?height=200&width=200", category: "Electronics" },
  { id: 3, name: "Running Shoes", price: 129.99, rating: 4.3, image: "/placeholder.svg?height=200&width=200", category: "Sports" },
  { id: 4, name: "Backpack", price: 59.99, rating: 4.6, image: "/placeholder.svg?height=200&width=200", category: "Accessories" },
  { id: 5, name: "Coffee Maker", price: 89.99, rating: 4.4, image: "/placeholder.svg?height=200&width=200", category: "Home" },
  { id: 6, name: "Bluetooth Speaker", price: 49.99, rating: 4.2, image: "/placeholder.svg?height=200&width=200", category: "Electronics" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)

  // VULNERABILITY #3: XSS - Search query rendered without sanitization
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect with unsanitized query parameter
    window.location.href = `/search?q=${searchQuery}`
  }

  // VULNERABILITY #4: Insecure direct object reference in URL
  const viewProduct = (id: number) => {
    window.location.href = `/product?id=${id}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* VULNERABILITY #5: Missing security headers would be detected */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              VulnShop
            </Link>
            
            {/* VULNERABILITY #6: Form action could be manipulated */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  // VULNERABILITY #7: No input validation or max length
                />
              </div>
            </form>

            <div className="flex items-center gap-4">
              {/* VULNERABILITY #8: Session info in URL */}
              <Link href="/account?session=abc123token">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* VULNERABILITY #9: Inline event handlers */}
      <nav className="bg-muted/50 border-b">
        <div className="container mx-auto px-4">
          <ul className="flex gap-6 py-3">
            {["Electronics", "Sports", "Home", "Accessories"].map((cat) => (
              <li key={cat}>
                <a 
                  href={`/category/${cat.toLowerCase()}`}
                  // VULNERABILITY #10: onclick with unsanitized data
                  onClick={() => console.log(`Category clicked: ${cat}`)}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {cat}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* VULNERABILITY #11: innerHTML equivalent - dangerouslySetInnerHTML */}
        <section className="mb-8">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: `<h1 class="text-3xl font-bold mb-2">Welcome to VulnShop</h1>
                       <p class="text-muted-foreground">Best deals on quality products!</p>` 
            }} 
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* VULNERABILITY #12: Image src from untrusted source */}
                <div className="aspect-square bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    // VULNERABILITY #13: No loading="lazy" or security attributes
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{product.rating}</span>
                  </div>
                  <p className="text-lg font-bold text-primary">${product.price}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 gap-2">
                  {/* VULNERABILITY #14: Price in client-side, could be manipulated */}
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setCartCount(c => c + 1)
                      // VULNERABILITY #15: Storing sensitive data in localStorage
                      localStorage.setItem('lastProduct', JSON.stringify(product))
                      localStorage.setItem('userToken', 'secret_token_12345')
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => viewProduct(product.id)}
                  >
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* VULNERABILITY #16: Hidden form with sensitive data */}
        <form id="hidden-checkout" style={{ display: 'none' }}>
          <input type="hidden" name="api_key" value={API_KEY} />
          <input type="hidden" name="admin_pass" value={ADMIN_CREDENTIALS.password} />
        </form>

        {/* Newsletter Section */}
        <section className="mt-12 bg-muted rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Subscribe to Newsletter</h2>
          <p className="text-muted-foreground mb-4">Get updates on new products and deals!</p>
          {/* VULNERABILITY #17: Form without CSRF token */}
          <form 
            action="/api/subscribe" 
            method="POST"
            className="flex max-w-md mx-auto gap-2"
          >
            {/* VULNERABILITY #18: Email field without proper validation */}
            <Input 
              type="text" 
              name="email" 
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </section>
      </main>

      <footer className="border-t mt-12 py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">VulnShop</h3>
              <p className="text-sm text-muted-foreground">Your trusted online shopping destination.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-primary">About Us</a></li>
                <li><a href="/contact" className="hover:text-primary">Contact</a></li>
                {/* VULNERABILITY #19: Admin panel link exposed */}
                <li><a href="/admin?debug=true" className="hover:text-primary">Admin</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/faq" className="hover:text-primary">FAQ</a></li>
                <li><a href="/returns" className="hover:text-primary">Returns</a></li>
                <li><a href="/shipping" className="hover:text-primary">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Debug Info</h4>
              {/* VULNERABILITY #20: Exposing system information */}
              <p className="text-xs text-muted-foreground">
                Server: Node.js v18.0.0<br />
                Framework: Next.js 16<br />
                DB: PostgreSQL 14<br />
                Build: dev-debug-mode
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* VULNERABILITY #21: Comment with sensitive info */}
      {/* TODO: Remove before production - DB connection: postgres://admin:password123@localhost:5432/shop */}
    </div>
  )
}
