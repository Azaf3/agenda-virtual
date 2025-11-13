# Teste de Diagnóstico - Verificar estruturas do banco

Write-Host "🔍 DIAGNÓSTICO - Verificando estruturas do banco" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

$baseUrl = "http://localhost:5000"

# Login
Write-Host "1️⃣ Fazendo login..." -ForegroundColor Yellow
$body = @{
    email = "joao.teste@email.com"
    password = "Senha123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $loginResponse.data.token
$userId = $loginResponse.data._id
Write-Host "✅ Login OK - User ID: $userId" -ForegroundColor Green
Write-Host ""

# Obter perfil completo
Write-Host "2️⃣ Obtendo perfil completo..." -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $token" }
try {
    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/profile" -Headers $headers
    Write-Host "✅ Perfil obtido:" -ForegroundColor Green
    $profileResponse.data | ConvertTo-Json -Depth 3
    
    if ($profileResponse.data.patientInfo) {
        Write-Host "✅ PatientInfo encontrado!" -ForegroundColor Green
        $patientId = $profileResponse.data.patientInfo._id
        Write-Host "   Patient ID: $patientId" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  PatientInfo NÃO encontrado! Isso pode causar erro nos agendamentos." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erro ao obter perfil: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3️⃣ Listando psicólogos..." -ForegroundColor Yellow
try {
    $psychologists = Invoke-RestMethod -Uri "$baseUrl/api/psychologists"
    Write-Host "✅ Total de psicólogos: $($psychologists.count)" -ForegroundColor Green
    
    if ($psychologists.count -gt 0) {
        $psychologistId = $psychologists.data[0]._id
        Write-Host "   Psicólogo ID: $psychologistId" -ForegroundColor Cyan
        Write-Host "   Nome: $($psychologists.data[0].user.name)" -ForegroundColor Cyan
        
        Write-Host ""
        Write-Host "4️⃣ Tentando criar agendamento..." -ForegroundColor Yellow
        
        $futureDate = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
        $appointmentBody = @{
            psychologistId = $psychologistId
            appointmentDate = $futureDate
            startTime = "14:00"
            endTime = "14:50"
            type = "online"
            notes = "Teste de diagnóstico"
        } | ConvertTo-Json
        
        try {
            $appointmentResponse = Invoke-RestMethod -Uri "$baseUrl/api/appointments" -Method Post -Body $appointmentBody -ContentType "application/json" -Headers $headers
            Write-Host "✅ Agendamento criado com sucesso!" -ForegroundColor Green
            $appointmentResponse.data | ConvertTo-Json -Depth 2
        } catch {
            Write-Host "❌ Erro ao criar agendamento:" -ForegroundColor Red
            Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
            
            if ($_.Exception.Response) {
                $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
                $responseBody = $reader.ReadToEnd()
                Write-Host "   Detalhes do erro:" -ForegroundColor Yellow
                Write-Host "   $responseBody" -ForegroundColor Yellow
            }
        }
    }
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🏁 Diagnóstico concluído!" -ForegroundColor Green
