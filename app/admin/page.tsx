"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Package, Settings, Database, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// VULNERABILITY #75: Admin credentials hardcoded
const ADMIN_USERS = [
  { username: "admin", password: "admin123", role: "superadmin" },
  { username: "manager", password: "manager456", role: "admin" },
  { username: "support", password: "support789", role: "moderator" },
]

export default function AdminPage() {
  const [sqlQuery, setSqlQuery] = useState("")
  const [queryResult, setQueryResult] = useState("")
  const [systemCommand, setSystemCommand] = useState("")
  const [commandOutput, setCommandOutput] = useState("")

  // VULNERABILITY #76: No authentication check on admin page
  // VULNERABILITY #77: No authorization check

  const executeQuery = () => {
    // VULNERABILITY #78: Direct SQL execution from user input
    setQueryResult(`Executed: ${sqlQuery}\n\nResults:\n[{ id: 1, name: "Product 1" }, { id: 2, name: "Product 2" }]`)
  }

  const executeCommand = () => {
    // VULNERABILITY #79: Command injection
    setCommandOutput(`$ ${systemCommand}\n\nOutput:\nCommand executed successfully`)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            {/* VULNERABILITY #80: Session token in URL */}
            <Link href="/admin/settings?token=admin_session_xyz789">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* VULNERABILITY #81: Sensitive data displayed without masking */}
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">System Information (Debug)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-700">
            <p>Database: PostgreSQL 14.5 @ db.vulnshop.internal:5432</p>
            <p>Redis: redis://cache.vulnshop.internal:6379</p>
            <p>API Key: sk_live_prod_key_abc123xyz</p>
            <p>JWT Secret: super_secret_jwt_key_do_not_share</p>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {[
            { title: "Total Users", value: "12,543", icon: Users },
            { title: "Products", value: "1,234", icon: Package },
            { title: "Orders Today", value: "89", icon: Package },
            { title: "Revenue", value: "$45,678", icon: Database },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardContent className="flex items-center gap-4 p-6">
                <stat.icon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>Manage administrator accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {/* VULNERABILITY #82: Displaying passwords in UI */}
                <div className="space-y-4">
                  {ADMIN_USERS.map((user) => (
                    <div key={user.username} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-muted-foreground">Password: {user.password}</p>
                        <p className="text-xs text-muted-foreground">Role: {user.role}</p>
                      </div>
                      {/* VULNERABILITY #83: Delete without confirmation */}
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>SQL Console</CardTitle>
                <CardDescription>Execute SQL queries directly on the database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* VULNERABILITY #84: SQL injection via admin console */}
                <div className="space-y-2">
                  <Label htmlFor="sql">SQL Query</Label>
                  <Textarea
                    id="sql"
                    placeholder="SELECT * FROM users WHERE..."
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={executeQuery}>
                  <Database className="h-4 w-4 mr-2" />
                  Execute Query
                </Button>
                {queryResult && (
                  <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
                    {queryResult}
                  </pre>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Console</CardTitle>
                <CardDescription>Execute system commands</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* VULNERABILITY #85: OS command injection */}
                <div className="space-y-2">
                  <Label htmlFor="cmd">Command</Label>
                  <Input
                    id="cmd"
                    placeholder="ls -la /var/www"
                    value={systemCommand}
                    onChange={(e) => setSystemCommand(e.target.value)}
                  />
                </div>
                <Button onClick={executeCommand}>
                  <Terminal className="h-4 w-4 mr-2" />
                  Run Command
                </Button>
                {commandOutput && (
                  <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
                    {commandOutput}
                  </pre>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent application logs</CardDescription>
              </CardHeader>
              <CardContent>
                {/* VULNERABILITY #86: Exposing sensitive logs */}
                <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto h-64">
{`[2024-01-15 10:23:45] INFO: User login - admin@vulnshop.com from 192.168.1.100
[2024-01-15 10:24:12] DEBUG: DB Query - SELECT * FROM users WHERE password='admin123'
[2024-01-15 10:25:33] INFO: API Key used - sk_live_abc123 for order #12345
[2024-01-15 10:26:01] ERROR: Payment failed - Card 4111-1111-1111-1111 expired
[2024-01-15 10:27:15] DEBUG: Redis connection - redis://:password123@localhost:6379
[2024-01-15 10:28:00] INFO: Backup started - s3://vulnshop-backups/db-2024-01-15.sql
[2024-01-15 10:29:30] WARN: Rate limit exceeded for IP 203.0.113.50
[2024-01-15 10:30:45] DEBUG: JWT Token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9...`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* VULNERABILITY #87: File upload without validation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upload Configuration</CardTitle>
            <CardDescription>Upload configuration files to the server</CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/upload" method="POST" encType="multipart/form-data">
              {/* VULNERABILITY #88: No file type restriction */}
              <Input 
                type="file" 
                name="config" 
                accept="*/*" // Accepts any file type
              />
              <Button type="submit" className="mt-4">Upload</Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* VULNERABILITY #89: Hidden form with credentials */}
      <form id="backup-form" style={{ display: "none" }}>
        <input type="hidden" name="db_user" value="postgres" />
        <input type="hidden" name="db_pass" value="prod_password_2024" />
        <input type="hidden" name="backup_key" value="aws_backup_key_xyz" />
      </form>
    </div>
  )
}
