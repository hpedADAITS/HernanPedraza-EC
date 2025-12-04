# PlantUML Diagram Generator (PowerShell - Windows)
# Generates PNG diagrams from .puml files and inserts them into markdown
# Unified script combining features from both Bash and PowerShell versions
# Usage: .\generate-diagrams.ps1

param(
    [string]$PlantUMLImage = "plantuml/plantuml:latest"
)

# Get the script directory (Docs\Diagrams)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
# Get the project root (two levels up: Docs\Diagrams -> Docs -> Root)
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptDir)

$DiagramsSourceDir = $ScriptDir  # Current directory is Docs\Diagrams
$OutputDir = Join-Path $ScriptDir "Generated"
$DocsDir = Split-Path -Parent $ScriptDir  # Parent is Docs
$LogsDir = Join-Path $ProjectRoot "logs"

################################################################################
# Logging Functions
################################################################################

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

################################################################################
# Setup and Validation
################################################################################

Write-Info "========================================="
Write-Info "PlantUML Diagram Generator"
Write-Info "========================================="
Write-Info "Project Root: $ProjectRoot"
Write-Info "Diagrams Directory: $DiagramsSourceDir"

# Clean and setup Output directory (delete all PNGs and recreate)
if (Test-Path $OutputDir) {
    Write-Info "Cleaning existing diagrams folder..."
    Remove-Item -Path $OutputDir -Recurse -Force
    Write-Success "Removed: $OutputDir"
}

# Setup directories
@($OutputDir, $LogsDir) | ForEach-Object {
    if (-not (Test-Path $_)) {
        $null = New-Item -ItemType Directory -Path $_ -Force
    }
}

Write-Success "Directories ready"

# Check Docker
if (-not (docker ps 2>$null)) {
    Write-Error "Docker is not running or not installed"
    exit 1
}
Write-Success "Docker is available"

# Pull image if needed
$imageExists = docker image ls --quiet --filter "reference=$PlantUMLImage" 2>$null
if (-not $imageExists) {
    Write-Info "Pulling PlantUML image..."
    docker pull $PlantUMLImage
}

################################################################################
# Diagram Generation
################################################################################

Write-Info "Processing diagrams..."

$pumlFiles = @(Get-ChildItem -Path $DiagramsSourceDir -Filter "*.puml" -File | Sort-Object Name)
$successCount = 0

foreach ($pumlFile in $pumlFiles) {
    $filename = $pumlFile.Name
    $basename = $filename -replace '\.puml$', ''
    $outputPng = Join-Path $OutputDir "$basename.png"
    
    Write-Info "Generating: $basename.png"
    
    # Convert paths for Docker (Docker expects forward slashes)
    $sourceDir = $DiagramsSourceDir -replace '\\', '/'
    $outputDirDocker = $OutputDir -replace '\\', '/'
    
    # Run docker to generate PNG
    # Note: -filename specifies output name to prevent PlantUML from using diagram title
    $result = docker run --rm `
        -v "${sourceDir}:/diagrams" `
        -v "${outputDirDocker}:/output" `
        $PlantUMLImage `
        -filename "$basename.png" `
        /diagrams/$filename `
        -o /output
    
    # Display output if there are errors
    if ($result) {
        Write-Host $result
    }
    
    # Check if file was created
    if (Test-Path $outputPng) {
        Write-Success "Generated: $basename.png"
        $successCount++
    } else {
        # PlantUML might have created PNG with a different name, find and rename it
        $recentPngs = @(Get-ChildItem -Path $OutputDir -Filter "*.png" -File -ErrorAction SilentlyContinue | Where-Object { $_.LastWriteTime -gt (Get-Date).AddSeconds(-10) })
        if ($recentPngs.Count -gt 0) {
            $newest = $recentPngs | Sort-Object LastWriteTime -Descending | Select-Object -First 1
            Rename-Item -Path $newest.FullName -NewName "$basename.png" -Force
            Write-Success "Generated: $basename.png (renamed)"
            $successCount++
        } else {
            Write-Error "Failed to generate: $basename.png"
            # Check for PlantUML syntax errors in output
            if ($result -match "error|Error|ERROR") {
                Write-Error "  Possible PlantUML syntax error:"
                $result | Where-Object { $_ -match "error|Error|ERROR" } | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
            }
        }
    }
}

Write-Info "Generated $successCount/$($pumlFiles.Count) diagrams"

################################################################################
# Markdown Insertion Functions
################################################################################

function Get-DiagramNameFromPuml {
    param([string]$PumlFilePath)
    
    $content = Get-Content $PumlFilePath -ErrorAction SilentlyContinue
    $titleLine = $content | Where-Object { $_ -match "^title\s+" } | Select-Object -First 1
    
    if ($titleLine) {
        return $titleLine -replace "^title\s+", "" -replace '[''"]', ""
    } else {
        $basename = (Split-Path $PumlFilePath -Leaf) -replace '\.puml$', ''
        return $basename -replace '^[0-9]*-', '' -replace '-', ' '
    }
}

function Insert-DiagramIntoMarkdown {
    param(
        [string]$MdFile,
        [string]$DiagramName,
        [string]$PngFilename,
        [string]$Basename
    )
    
    $mdContent = Get-Content $MdFile -Raw -ErrorAction SilentlyContinue
    
    # Check if diagram is already inserted
    if ($mdContent -match [regex]::Escape("Generated/$PngFilename")) {
        Write-Warn "Diagram already present in $(Split-Path $MdFile -Leaf)"
        return $false
    }
    
    $mdLines = @(Get-Content $MdFile)
    $insertIndex = -1
    
    # Mapping of diagram files to insertion points in markdown
    $diagramMappings = @{
        "01-system-architecture-diagram.png" = @{
            heading = "Descripción General del Sistema"
            insertAfter = 1
        }
        "02-data-flow-pipeline.png" = @{
            heading = "Estructuras de Datos"
            insertAfter = 1
        }
        "03-ai-interaction-sequence.png" = @{
            heading = "Pipeline de Procesamiento"
            insertAfter = 2
        }
        "04-backend-workflow-process.png" = @{
            heading = "Pipeline de Procesamiento"
            insertAfter = 3
        }
        "05-frontend-state-flow.png" = @{
            heading = "Arquitectura de Componentes"
            insertAfter = 2
        }
        "06-file-structure-and-hierarchy.png" = @{
            heading = "Estructuras de Datos"
            insertAfter = 2
        }
        "07-deployment-architecture.png" = @{
            heading = "Volúmenes y Enlances"
            insertAfter = 1
        }
        "08-api-endpoint-schema.png" = @{
            heading = "Esquema de Solicitud/Respuesta de Tool Call"
            insertAfter = 1
        }
    }
    
    # Use mapping if available
    if ($diagramMappings.ContainsKey($PngFilename)) {
        $mapping = $diagramMappings[$PngFilename]
        $headingPattern = $mapping.heading
        
        for ($i = 0; $i -lt $mdLines.Count; $i++) {
            if ($mdLines[$i] -match [regex]::Escape($headingPattern)) {
                $insertIndex = $i + $mapping.insertAfter
                break
            }
        }
    }
    
    # Fallback: find any relevant heading
    if ($insertIndex -eq -1) {
        for ($i = 0; $i -lt $mdLines.Count; $i++) {
            if ($mdLines[$i] -match "^#{1,6}\s.*(diagram|flujo|arquitectura|frontend|backend|data|deployment|api|procesamiento)" -and $insertIndex -eq -1) {
                $insertIndex = $i + 2
                break
            }
        }
    }
    
    # Fallback: insert at line 10 if no heading found
    if ($insertIndex -eq -1 -or $insertIndex -gt $mdLines.Count) {
        $insertIndex = [Math]::Min(10, $mdLines.Count)
    }
    
    # Build the new content with inserted diagram
    $imageMd = "`n![${DiagramName}](Diagrams/Generated/${PngFilename})`n"
    
    $newContent = @()
    for ($i = 0; $i -lt $mdLines.Count; $i++) {
        $newContent += $mdLines[$i]
        if ($i -eq ($insertIndex - 1)) {
            $newContent += $imageMd
        }
    }
    
    Set-Content -Path $MdFile -Value ($newContent -join "`n") -Encoding UTF8
    Write-Success "Inserted $PngFilename at line $insertIndex into $(Split-Path $MdFile -Leaf)"
    return $true
}

################################################################################
# Process Diagram Insertions
################################################################################

Write-Info "Processing markdown insertions..."

$mdFile = Join-Path $DocsDir "ARQUITECTURA_DETALLADA.md"
if (Test-Path $mdFile) {
    foreach ($pumlFile in $pumlFiles) {
        $filename = $pumlFile.Name
        $basename = $filename -replace '\.puml$', ''
        $pngFilename = "$basename.png"
        $diagramName = Get-DiagramNameFromPuml $pumlFile.FullName
        
        Insert-DiagramIntoMarkdown -MdFile $mdFile -DiagramName $diagramName -PngFilename $pngFilename -Basename $basename | Out-Null
    }
    Write-Success "Markdown insertions complete"
} else {
    Write-Warn "Could not find markdown file: $mdFile"
}

################################################################################
# Generate Report
################################################################################

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$reportFile = Join-Path $LogsDir "diagram-generation-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

$report = @"
PlantUML Diagram Generation Report
=====================================
Generated: $timestamp
Source: $DiagramsSourceDir
Output: $OutputDir

"@

$pngCount = (Get-ChildItem -Path $OutputDir -Filter "*.png" -File -ErrorAction SilentlyContinue | Measure-Object).Count
$report += "Generated Files: $pngCount`n"

if ($pngCount -gt 0) {
    $report += "`nDetails:`n"
    Get-ChildItem -Path $OutputDir -Filter "*.png" -File | ForEach-Object {
        $size = [math]::Round($_.Length / 1KB, 2)
        $report += "  - $($_.Name) ($size KB)`n"
    }
}

$report | Set-Content -Path $reportFile -Encoding UTF8

################################################################################
# Summary
################################################################################

Write-Host "`n" -NoNewline
Write-Info "========================================="
Write-Success "Diagram generation complete!"
Write-Info "Diagrams saved to: $OutputDir"
Write-Info "Report saved to: $reportFile"
Write-Info "========================================="
