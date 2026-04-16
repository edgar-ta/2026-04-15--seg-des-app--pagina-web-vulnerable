import { NextRequest, NextResponse } from "next/server"

// VULNERABILITY #90: File upload without proper validation
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get("file") as File | null
  const filename = formData.get("filename") as string || file?.name || "upload"
  
  // VULNERABILITY #91: Path traversal in filename
  const savePath = `/uploads/${filename}` // Could be manipulated: ../../../etc/passwd
  
  // VULNERABILITY #92: No file type validation
  // VULNERABILITY #93: No file size limit
  // VULNERABILITY #94: No malware scanning
  
  // VULNERABILITY #95: Executable file upload allowed
  const dangerousExtensions = [] // Should block: .php, .exe, .sh, .jsp, etc.
  
  if (file) {
    console.log(`Saving file to: ${savePath}`)
    console.log(`File type: ${file.type}`)
    console.log(`File size: ${file.size}`)
  }

  return NextResponse.json({
    success: true,
    path: savePath,
    // VULNERABILITY #96: Full server path disclosure
    serverPath: `/var/www/vulnshop/public${savePath}`,
    // VULNERABILITY #97: Information disclosure
    serverInfo: {
      os: "Ubuntu 22.04",
      webServer: "nginx/1.18.0",
      phpVersion: "8.1.0",
      uploadLimit: "100MB",
      tempDir: "/tmp/php_uploads"
    }
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // VULNERABILITY #98: Path traversal in file retrieval
  const filename = searchParams.get("file") || ""
  const filePath = `/uploads/${filename}` // Vulnerable to ../../etc/passwd
  
  // VULNERABILITY #99: Directory listing enabled
  if (searchParams.get("list") === "true") {
    return NextResponse.json({
      files: [
        "config.json",
        "database.yml",
        "credentials.txt",
        ".env.backup",
        "admin_passwords.csv"
      ],
      // VULNERABILITY #100: Exposing internal paths
      basePath: "/var/www/vulnshop/uploads"
    })
  }

  return NextResponse.json({
    file: filePath,
    // VULNERABILITY #101: Server configuration exposure
    config: {
      maxUploadSize: "100MB",
      allowedPaths: ["/uploads", "/public", "/tmp"],
      serverRoot: "/var/www/vulnshop"
    }
  })
}
