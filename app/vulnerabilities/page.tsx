import Link from "next/link"
import { ArrowLeft, AlertTriangle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const vulnerabilities = [
  // Client-Side Vulnerabilities
  { id: 1, name: "Hardcoded Credentials in Client Code", category: "Sensitive Data Exposure", location: "page.tsx", severity: "Critical" },
  { id: 2, name: "API Keys in Frontend", category: "Sensitive Data Exposure", location: "page.tsx", severity: "Critical" },
  { id: 3, name: "XSS via Search Query", category: "Cross-Site Scripting", location: "page.tsx, search/page.tsx", severity: "High" },
  { id: 4, name: "Insecure Direct Object Reference (IDOR)", category: "Broken Access Control", location: "Multiple pages", severity: "High" },
  { id: 5, name: "Missing Security Headers", category: "Security Misconfiguration", location: "API routes", severity: "Medium" },
  { id: 6, name: "Form Action Manipulation", category: "Injection", location: "page.tsx", severity: "Medium" },
  { id: 7, name: "No Input Validation", category: "Injection", location: "Multiple forms", severity: "High" },
  { id: 8, name: "Session Token in URL", category: "Sensitive Data Exposure", location: "page.tsx", severity: "High" },
  { id: 9, name: "Inline Event Handlers", category: "XSS", location: "page.tsx", severity: "Low" },
  { id: 10, name: "Unsanitized Data in onclick", category: "XSS", location: "page.tsx", severity: "Medium" },
  { id: 11, name: "dangerouslySetInnerHTML Usage", category: "XSS", location: "Multiple pages", severity: "High" },
  { id: 12, name: "Untrusted Image Sources", category: "Security Misconfiguration", location: "page.tsx", severity: "Low" },
  { id: 13, name: "Missing Image Security Attributes", category: "Security Misconfiguration", location: "page.tsx", severity: "Low" },
  { id: 14, name: "Client-Side Price Manipulation", category: "Business Logic", location: "page.tsx", severity: "High" },
  { id: 15, name: "Sensitive Data in localStorage", category: "Sensitive Data Exposure", location: "page.tsx", severity: "High" },
  { id: 16, name: "Hidden Form with Sensitive Data", category: "Sensitive Data Exposure", location: "page.tsx", severity: "High" },
  { id: 17, name: "Missing CSRF Token", category: "CSRF", location: "Multiple forms", severity: "High" },
  { id: 18, name: "Email Field Without Validation", category: "Input Validation", location: "page.tsx", severity: "Medium" },
  { id: 19, name: "Admin Panel Link Exposed", category: "Information Disclosure", location: "page.tsx", severity: "Medium" },
  { id: 20, name: "System Information Exposure", category: "Information Disclosure", location: "page.tsx footer", severity: "Medium" },
  { id: 21, name: "Sensitive Comments in Code", category: "Information Disclosure", location: "page.tsx", severity: "Medium" },
  
  // Login Page Vulnerabilities
  { id: 22, name: "Password in URL Query String", category: "Sensitive Data Exposure", location: "login/page.tsx", severity: "Critical" },
  { id: 23, name: "GET Request for Authentication", category: "Security Misconfiguration", location: "login/page.tsx", severity: "High" },
  { id: 24, name: "Missing Security Headers in Request", category: "Security Misconfiguration", location: "login/page.tsx", severity: "Medium" },
  { id: 25, name: "Verbose Error Messages", category: "Information Disclosure", location: "login/page.tsx", severity: "Medium" },
  { id: 26, name: "Stack Trace Exposure", category: "Information Disclosure", location: "login/page.tsx", severity: "High" },
  { id: 27, name: "Credentials in localStorage", category: "Sensitive Data Exposure", location: "login/page.tsx", severity: "Critical" },
  { id: 28, name: "Insecure Session Cookie", category: "Session Management", location: "login/page.tsx", severity: "High" },
  { id: 29, name: "No CSRF Protection on Login", category: "CSRF", location: "login/page.tsx", severity: "High" },
  { id: 30, name: "XSS via Error Rendering", category: "XSS", location: "login/page.tsx", severity: "High" },
  { id: 31, name: "Autocomplete on Sensitive Fields", category: "Security Misconfiguration", location: "login/page.tsx", severity: "Low" },
  { id: 32, name: "Wrong Input Type for Email", category: "Input Validation", location: "login/page.tsx", severity: "Low" },
  { id: 33, name: "No Password Strength Validation", category: "Authentication", location: "login/page.tsx", severity: "Medium" },
  { id: 34, name: "Predictable Password Reset Token", category: "Broken Authentication", location: "login/page.tsx", severity: "Critical" },
  { id: 35, name: "Missing OAuth State Parameter", category: "CSRF", location: "login/page.tsx", severity: "High" },
  { id: 36, name: "Open Redirect in OAuth", category: "Open Redirect", location: "login/page.tsx", severity: "Medium" },
  { id: 37, name: "Debug Information in Footer", category: "Information Disclosure", location: "login/page.tsx", severity: "Medium" },
  
  // API Vulnerabilities
  { id: 38, name: "SQL Injection", category: "Injection", location: "api/products/route.ts", severity: "Critical" },
  { id: 39, name: "IDOR in User Query", category: "Broken Access Control", location: "api/products/route.ts", severity: "High" },
  { id: 40, name: "CORS Misconfiguration (*)", category: "Security Misconfiguration", location: "api/products/route.ts", severity: "High" },
  { id: 41, name: "Missing Security Headers", category: "Security Misconfiguration", location: "api/products/route.ts", severity: "Medium" },
  { id: 42, name: "No Rate Limiting", category: "Security Misconfiguration", location: "api/products/route.ts", severity: "Medium" },
  { id: 43, name: "Mass Assignment", category: "Broken Access Control", location: "api/products/route.ts", severity: "High" },
  { id: 44, name: "No Input Validation", category: "Input Validation", location: "api/products/route.ts", severity: "High" },
  { id: 45, name: "Reflected Data Without Sanitization", category: "XSS", location: "api/products/route.ts", severity: "Medium" },
  { id: 46, name: "HTTP Methods Not Restricted", category: "Security Misconfiguration", location: "api/products/route.ts", severity: "Medium" },
  { id: 47, name: "No Authentication Check", category: "Broken Authentication", location: "api/products/route.ts", severity: "Critical" },
  { id: 48, name: "No Authorization Check", category: "Broken Access Control", location: "api/products/route.ts", severity: "Critical" },
  { id: 49, name: "Information Disclosure in Response", category: "Information Disclosure", location: "api/products/route.ts", severity: "Medium" },
  
  // User API Vulnerabilities
  { id: 50, name: "Hardcoded Secrets", category: "Sensitive Data Exposure", location: "api/user/route.ts", severity: "Critical" },
  { id: 51, name: "IDOR - User Access", category: "Broken Access Control", location: "api/user/route.ts", severity: "High" },
  { id: 52, name: "Path Traversal", category: "Path Traversal", location: "api/user/route.ts", severity: "High" },
  { id: 53, name: "SSRF", category: "SSRF", location: "api/user/route.ts", severity: "High" },
  { id: 54, name: "Sensitive Data Exposure (PII)", category: "Sensitive Data Exposure", location: "api/user/route.ts", severity: "Critical" },
  { id: 55, name: "Insecure Cookie Settings", category: "Session Management", location: "api/user/route.ts", severity: "High" },
  { id: 56, name: "No CSRF Validation", category: "CSRF", location: "api/user/route.ts", severity: "High" },
  { id: 57, name: "No Authentication on PUT", category: "Broken Authentication", location: "api/user/route.ts", severity: "Critical" },
  { id: 58, name: "Unsafe Redirect", category: "Open Redirect", location: "api/user/route.ts", severity: "Medium" },
  { id: 59, name: "Command Injection", category: "Injection", location: "api/user/route.ts", severity: "Critical" },
  { id: 60, name: "Server Version Disclosure", category: "Information Disclosure", location: "api/user/route.ts", severity: "Low" },
  { id: 61, name: "Weak Password Requirements", category: "Authentication", location: "api/user/route.ts", severity: "Medium" },
  { id: 62, name: "Plain Text Password Storage", category: "Cryptographic Failures", location: "api/user/route.ts", severity: "Critical" },
  { id: 63, name: "Role Assignment by User", category: "Broken Access Control", location: "api/user/route.ts", severity: "Critical" },
  { id: 64, name: "User Enumeration", category: "Information Disclosure", location: "api/user/route.ts", severity: "Medium" },
  { id: 65, name: "Weak Session Token", category: "Session Management", location: "api/user/route.ts", severity: "High" },
  { id: 66, name: "Debug Info in Response", category: "Information Disclosure", location: "api/user/route.ts", severity: "Medium" },
  
  // Search Page Vulnerabilities
  { id: 67, name: "Reflected XSS via Query Param", category: "XSS", location: "search/page.tsx", severity: "High" },
  { id: 68, name: "XSS in Page Content", category: "XSS", location: "search/page.tsx", severity: "High" },
  { id: 69, name: "Debug Mode Exposure", category: "Information Disclosure", location: "search/page.tsx", severity: "High" },
  { id: 70, name: "Open Redirect", category: "Open Redirect", location: "search/page.tsx", severity: "Medium" },
  { id: 71, name: "IDOR in Product URL", category: "Broken Access Control", location: "search/page.tsx", severity: "Medium" },
  { id: 72, name: "Iframe with User-Controlled src", category: "XSS/Clickjacking", location: "search/page.tsx", severity: "High" },
  { id: 73, name: "Missing Iframe Sandbox", category: "Security Misconfiguration", location: "search/page.tsx", severity: "Medium" },
  { id: 74, name: "Missing referrerPolicy", category: "Information Disclosure", location: "search/page.tsx", severity: "Low" },
  
  // Admin Page Vulnerabilities
  { id: 75, name: "Hardcoded Admin Credentials", category: "Sensitive Data Exposure", location: "admin/page.tsx", severity: "Critical" },
  { id: 76, name: "No Auth on Admin Page", category: "Broken Authentication", location: "admin/page.tsx", severity: "Critical" },
  { id: 77, name: "No Authorization Check", category: "Broken Access Control", location: "admin/page.tsx", severity: "Critical" },
  { id: 78, name: "SQL Injection in Admin Console", category: "Injection", location: "admin/page.tsx", severity: "Critical" },
  { id: 79, name: "OS Command Injection", category: "Injection", location: "admin/page.tsx", severity: "Critical" },
  { id: 80, name: "Session Token in Admin URL", category: "Session Management", location: "admin/page.tsx", severity: "High" },
  { id: 81, name: "Sensitive Data Display", category: "Sensitive Data Exposure", location: "admin/page.tsx", severity: "Critical" },
  { id: 82, name: "Passwords Displayed in UI", category: "Sensitive Data Exposure", location: "admin/page.tsx", severity: "Critical" },
  { id: 83, name: "Delete Without Confirmation", category: "Business Logic", location: "admin/page.tsx", severity: "Medium" },
  { id: 84, name: "SQL Console Without Auth", category: "Injection", location: "admin/page.tsx", severity: "Critical" },
  { id: 85, name: "System Console Available", category: "Injection", location: "admin/page.tsx", severity: "Critical" },
  { id: 86, name: "Sensitive Log Exposure", category: "Information Disclosure", location: "admin/page.tsx", severity: "High" },
  { id: 87, name: "File Upload Without Validation", category: "Unrestricted Upload", location: "admin/page.tsx", severity: "High" },
  { id: 88, name: "No File Type Restriction", category: "Unrestricted Upload", location: "admin/page.tsx", severity: "High" },
  { id: 89, name: "Hidden Form with DB Credentials", category: "Sensitive Data Exposure", location: "admin/page.tsx", severity: "Critical" },
  
  // Upload API Vulnerabilities
  { id: 90, name: "File Upload Without Validation", category: "Unrestricted Upload", location: "api/upload/route.ts", severity: "High" },
  { id: 91, name: "Path Traversal in Filename", category: "Path Traversal", location: "api/upload/route.ts", severity: "High" },
  { id: 92, name: "No File Type Validation", category: "Unrestricted Upload", location: "api/upload/route.ts", severity: "High" },
  { id: 93, name: "No File Size Limit", category: "Denial of Service", location: "api/upload/route.ts", severity: "Medium" },
  { id: 94, name: "No Malware Scanning", category: "Security Misconfiguration", location: "api/upload/route.ts", severity: "Medium" },
  { id: 95, name: "Executable Upload Allowed", category: "Unrestricted Upload", location: "api/upload/route.ts", severity: "Critical" },
  { id: 96, name: "Server Path Disclosure", category: "Information Disclosure", location: "api/upload/route.ts", severity: "Medium" },
  { id: 97, name: "Server Info Disclosure", category: "Information Disclosure", location: "api/upload/route.ts", severity: "Medium" },
  { id: 98, name: "Path Traversal in Retrieval", category: "Path Traversal", location: "api/upload/route.ts", severity: "High" },
  { id: 99, name: "Directory Listing Enabled", category: "Information Disclosure", location: "api/upload/route.ts", severity: "Medium" },
  { id: 100, name: "Internal Path Exposure", category: "Information Disclosure", location: "api/upload/route.ts", severity: "Medium" },
  { id: 101, name: "Server Config Exposure", category: "Information Disclosure", location: "api/upload/route.ts", severity: "Medium" },
]

const severityColors: Record<string, string> = {
  Critical: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-yellow-500",
  Low: "bg-blue-500",
}

export default function VulnerabilitiesPage() {
  const grouped = vulnerabilities.reduce((acc, vuln) => {
    if (!acc[vuln.category]) acc[vuln.category] = []
    acc[vuln.category].push(vuln)
    return acc
  }, {} as Record<string, typeof vulnerabilities>)

  const stats = {
    total: vulnerabilities.length,
    critical: vulnerabilities.filter(v => v.severity === "Critical").length,
    high: vulnerabilities.filter(v => v.severity === "High").length,
    medium: vulnerabilities.filter(v => v.severity === "Medium").length,
    low: vulnerabilities.filter(v => v.severity === "Low").length,
  }

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
            <div>
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Vulnerability Reference
              </h1>
              <p className="text-sm text-muted-foreground">For OWASP ZAP Testing</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5" />
              Educational Use Only
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700 dark:text-amber-300">
            <p>This application is intentionally vulnerable for cybersecurity training and testing purposes. 
            It contains {stats.total} documented vulnerabilities designed to be detected by security scanning tools like OWASP ZAP.</p>
            <p className="mt-2"><strong>Never deploy this application in a production environment.</strong></p>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-5 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-red-500">{stats.critical}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </CardContent>
          </Card>
          <Card className="border-orange-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-orange-500">{stats.high}</p>
              <p className="text-sm text-muted-foreground">High</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.medium}</p>
              <p className="text-sm text-muted-foreground">Medium</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-500">{stats.low}</p>
              <p className="text-sm text-muted-foreground">Low</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {Object.entries(grouped).map(([category, vulns]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
                <CardDescription>{vulns.length} vulnerabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vulns.map((vuln) => (
                    <div key={vuln.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-8">#{vuln.id}</span>
                        <span className="font-medium">{vuln.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{vuln.location}</code>
                        <Badge className={severityColors[vuln.severity]}>{vuln.severity}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
