# Script para corrigir perfil de paciente

Write-Host "🔧 Corrigindo perfil de paciente..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# Login
$body = @{
    email = "joao.teste@email.com"
    password = "Senha123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $loginResponse.data.token
$headers = @{ "Authorization" = "Bearer $token" }

Write-Host "✅ Login realizado" -ForegroundColor Green
Write-Host ""

# Atualizar perfil de paciente
Write-Host "📝 Atualizando perfil de paciente..." -ForegroundColor Yellow

$patientBody = @{
    dateOfBirth = "1990-05-15"
    emergencyContact = @{
        name = "Maria Silva"
        phone = "(11) 98888-7777"
        relationship = "Irmã"
    }
    preferredTherapyType = "individual"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/users/patient-profile" -Method Put -Body $patientBody -ContentType "application/json" -Headers $headers
    Write-Host "✅ Perfil de paciente atualizado com sucesso!" -ForegroundColor Green
    $response.data | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🏁 Correção concluída! Execute test-advanced.ps1 novamente." -ForegroundColor Green
