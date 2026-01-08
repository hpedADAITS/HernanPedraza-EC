#!/usr/bin/env pwsh
# ============================================================================
# Automatic Documentation Generator - Setup Script
# ============================================================================

param(
    [switch]$Install,
    [switch]$Start,
    [switch]$Dev,
    [switch]$Help
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "=== $Text ===" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Text)
    Write-Host "[OK] $Text" -ForegroundColor Green
}

function Write-Error-Msg {
    param([string]$Text)
    Write-Host "[ERROR] $Text" -ForegroundColor Red
}

function Write-Info {
    param([string]$Text)
    Write-Host "[*] $Text" -ForegroundColor Cyan
}

function Show-Help {
    Write-Header "Generador de Documentación Java - Ayuda"
    Write-Host "USO: .\Setup.ps1 [opciones]"
    Write-Host ""
    Write-Host "OPCIONES:"
    Write-Host "  -Install   Instalar dependencias"
    Write-Host "  -Start     Iniciar servicios"
    Write-Host "  -Dev       Instalar + Iniciar"
    Write-Host "  -Help      Mostrar esta ayuda"
    Write-Host ""
}

function Check-Prerequisites {
    Write-Header "Verificando Requisitos"
    
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error-Msg "Node.js no encontrado"
        exit 1
    }
    Write-Success "Node.js encontrado: $(node --version)"
    
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Error-Msg "npm no encontrado"
        exit 1
    }
    Write-Success "npm encontrado: $(npm --version)"
    
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error-Msg "Git no encontrado"
        exit 1
    }
    Write-Success "Git encontrado"
}

function Setup-Backend {
    Write-Header "Configurando Backend"
    
    if (-not (Test-Path ".\backend")) {
        Write-Error-Msg "Directorio backend no encontrado"
        exit 1
    }
    
    Push-Location ".\backend"
    try {
        if (-not (Test-Path ".env")) {
            if (Test-Path ".env.example") {
                Write-Info "Creando .env desde plantilla"
                Copy-Item ".env.example" ".env"
            }
        }
        
        Write-Info "Instalando dependencias..."
        npm install --legacy-peer-deps | Out-Null
        
        Write-Success "Backend listo"
    } finally {
        Pop-Location
    }
}

function Setup-Frontend {
    Write-Header "Configurando Frontend"
    
    if (-not (Test-Path ".\frontend")) {
        Write-Error-Msg "Directorio frontend no encontrado"
        exit 1
    }
    
    Push-Location ".\frontend"
    try {
        if (-not (Test-Path ".env")) {
            if (Test-Path ".env.example") {
                Write-Info "Creando .env desde plantilla"
                Copy-Item ".env.example" ".env"
            }
        }
        
        Write-Info "Instalando dependencias..."
        npm install | Out-Null
        
        Write-Success "Frontend listo"
    } finally {
        Pop-Location
    }
}

function Start-Services {
    Write-Header "Iniciando Servicios"
    
    Write-Info "Iniciando backend..."
    $backendJob = Start-Job -ScriptBlock {
        cd $using:PSScriptRoot\backend
        npm run dev
    }
    Start-Sleep -Seconds 3
    
    Write-Info "Iniciando frontend..."
    $frontendJob = Start-Job -ScriptBlock {
        cd $using:PSScriptRoot\frontend
        npm start
    }
    Start-Sleep -Seconds 2
    
    Write-Header "Servicios En Ejecución"
    Write-Success "Backend:  http://localhost:3000"
    Write-Success "Frontend: http://localhost:3001"
    Write-Info "LM Studio debe ejecutarse en http://localhost:1234"
    Write-Host ""
    Write-Info "Presiona Ctrl+C para detener los servicios..."
    Write-Host ""
    
    # Keep the script running and display output from jobs
    try {
        while ($true) {
            $backendOut = Receive-Job -Job $backendJob -ErrorAction SilentlyContinue
            if ($backendOut) {
                Write-Host "[BACKEND] $backendOut" -ForegroundColor Yellow
            }
            
            $frontendOut = Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue
            if ($frontendOut) {
                Write-Host "[FRONTEND] $frontendOut" -ForegroundColor Cyan
            }
            
            if ($backendJob.State -ne "Running" -or $frontendJob.State -ne "Running") {
                Write-Error-Msg "Un servicio se detuvo inesperadamente"
                break
            }
            
            Start-Sleep -Milliseconds 500
        }
    } catch {
        Write-Info "Deteniendo servicios..."
    } finally {
        Write-Info "Deteniendo backend..."
        Stop-Job -Job $backendJob
        Remove-Job -Job $backendJob -Force -ErrorAction SilentlyContinue
        
        Write-Info "Deteniendo frontend..."
        Stop-Job -Job $frontendJob
        Remove-Job -Job $frontendJob -Force -ErrorAction SilentlyContinue
        
        Write-Success "Servicios detenidos"
    }
}

# Main
if ($Help) {
    Show-Help
    exit 0
}

if (-not $Install -and -not $Start -and -not $Dev) {
    Show-Help
    exit 0
}

Check-Prerequisites

if ($Install -or $Dev) {
    Setup-Backend
    Setup-Frontend
}

if ($Start -or $Dev) {
    Start-Services
}

Write-Host ""
Write-Host "Configuración completa! Abre http://localhost:3001 en tu navegador"
