# Script de Teste da API AgendaMental

Write-Host "🧪 Testando API AgendaMental..." -ForegroundColor Cyan
Write-Host ""

# Teste 1: Endpoint raiz
Write-Host "📍 Teste 1: Endpoint Raiz (GET /)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000" -Method Get
    Write-Host "✅ Sucesso!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Falhou: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Teste 2: Health Check
Write-Host "📍 Teste 2: Health Check (GET /health)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
    Write-Host "✅ Sucesso!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Falhou: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Teste 3: Registrar novo usuário
Write-Host "📍 Teste 3: Registrar Paciente (POST /api/auth/register)" -ForegroundColor Yellow
try {
    $body = @{
        name = "João Silva"
        email = "joao.teste@email.com"
        password = "Senha123"
        phone = "(11) 99999-9999"
        role = "patient"
        dateOfBirth = "1990-05-15"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Usuário registrado com sucesso!" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "⚠️  Erro (pode ser usuário já existente): $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Teste 4: Login
Write-Host "📍 Teste 4: Login (POST /api/auth/login)" -ForegroundColor Yellow
try {
    $body = @{
        email = "joao.teste@email.com"
        password = "Senha123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
    $global:token = $response.data.token
    Write-Host "🔑 Token: $global:token" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Teste 5: Listar psicólogos
Write-Host "📍 Teste 5: Listar Psicólogos (GET /api/psychologists)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/psychologists" -Method Get
    Write-Host "✅ Sucesso! Total: $($response.count)" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 2
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

Write-Host "🎉 Testes concluídos!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Para usar o token nos próximos testes:" -ForegroundColor Cyan
Write-Host '   $headers = @{ "Authorization" = "Bearer $global:token" }' -ForegroundColor White
Write-Host '   Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Headers $headers' -ForegroundColor White
