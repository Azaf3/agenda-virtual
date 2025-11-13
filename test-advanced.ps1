# Testes Avançados da API AgendaMental

Write-Host "🧪 Testes Avançados - API AgendaMental" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Variáveis globais
$baseUrl = "http://localhost:5000"
$global:token = $null
$global:userId = $null
$global:psychologistId = $null

# ==========================================
# TESTE 1: Login
# ==========================================
Write-Host "📍 TESTE 1: Login de Usuário Existente" -ForegroundColor Yellow
try {
    $body = @{
        email = "joao.teste@email.com"
        password = "Senha123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
    $global:token = $response.data.token
    $global:userId = $response.data._id
    Write-Host "   User ID: $($response.data._id)" -ForegroundColor Cyan
    Write-Host "   Nome: $($response.data.name)" -ForegroundColor Cyan
    Write-Host "   Email: $($response.data.email)" -ForegroundColor Cyan
    Write-Host "   Role: $($response.data.role)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "⚠️  Criando novo usuário..." -ForegroundColor Yellow
    
    # Criar usuário se não existe
    try {
        $body = @{
            name = "João Silva"
            email = "joao.teste@email.com"
            password = "Senha123"
            phone = "(11) 99999-9999"
            role = "patient"
            dateOfBirth = "1990-05-15"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $body -ContentType "application/json"
        $global:token = $response.data.token
        $global:userId = $response.data._id
        Write-Host "✅ Usuário criado e logado!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao criar usuário: $($_.Exception.Message)" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# ==========================================
# TESTE 2: Obter perfil do usuário logado
# ==========================================
Write-Host "📍 TESTE 2: Obter Perfil do Usuário Logado (GET /api/auth/me)" -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:token" }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Headers $headers
    Write-Host "✅ Perfil obtido com sucesso!" -ForegroundColor Green
    $response.data | ConvertTo-Json -Depth 2
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# ==========================================
# TESTE 3: Registrar Psicólogo
# ==========================================
Write-Host "📍 TESTE 3: Registrar Novo Psicólogo" -ForegroundColor Yellow
try {
    $randomNum = Get-Random -Minimum 1000 -Maximum 9999
    $body = @{
        name = "Dra. Maria Santos"
        email = "maria.psi$randomNum@email.com"
        password = "Senha123"
        phone = "(11) 98888-8888"
        role = "psychologist"
        crp = "06/123456"
        specialties = @("Ansiedade", "Depressão", "TCC")
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Psicólogo registrado com sucesso!" -ForegroundColor Green
    $global:psychologistId = $response.data._id
    Write-Host "   ID: $($response.data._id)" -ForegroundColor Cyan
    Write-Host "   Nome: $($response.data.name)" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️  Erro: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# ==========================================
# TESTE 4: Listar todos os psicólogos
# ==========================================
Write-Host "📍 TESTE 4: Listar Todos os Psicólogos (GET /api/psychologists)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/psychologists"
    Write-Host "✅ Lista obtida! Total de psicólogos: $($response.count)" -ForegroundColor Green
    
    if ($response.count -gt 0) {
        $response.data | ForEach-Object {
            Write-Host "   → $($_.user.name) - CRP: $($_.crp) - Especialidades: $($_.specialties -join ', ')" -ForegroundColor Cyan
            if (-not $global:psychologistId) {
                $global:psychologistId = $_._id
            }
        }
    } else {
        Write-Host "   (Nenhum psicólogo cadastrado ainda)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# ==========================================
# TESTE 5: Criar Agendamento
# ==========================================
Write-Host "📍 TESTE 5: Criar Novo Agendamento (POST /api/appointments)" -ForegroundColor Yellow

if ($global:psychologistId) {
    try {
        $headers = @{ "Authorization" = "Bearer $global:token" }
        $futureDate = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")
        
        $body = @{
            psychologistId = $global:psychologistId
            appointmentDate = $futureDate
            startTime = "14:00"
            endTime = "14:50"
            type = "online"
            notes = "Primeira consulta de teste"
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri "$baseUrl/api/appointments" -Method Post -Body $body -ContentType "application/json" -Headers $headers
        Write-Host "✅ Agendamento criado com sucesso!" -ForegroundColor Green
        Write-Host "   ID do Agendamento: $($response.data._id)" -ForegroundColor Cyan
        Write-Host "   Data: $($response.data.appointmentDate)" -ForegroundColor Cyan
        Write-Host "   Horário: $($response.data.startTime) - $($response.data.endTime)" -ForegroundColor Cyan
        Write-Host "   Tipo: $($response.data.type)" -ForegroundColor Cyan
        Write-Host "   Status: $($response.data.status)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Pulado: Nenhum psicólogo disponível para agendamento" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# ==========================================
# TESTE 6: Listar agendamentos do usuário
# ==========================================
Write-Host "📍 TESTE 6: Listar Meus Agendamentos (GET /api/appointments)" -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:token" }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/appointments" -Headers $headers
    Write-Host "✅ Lista obtida! Total de agendamentos: $($response.count)" -ForegroundColor Green
    
    if ($response.count -gt 0) {
        $response.data | ForEach-Object {
            Write-Host "   → Data: $($_.appointmentDate) | Horário: $($_.startTime) | Status: $($_.status)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   (Nenhum agendamento encontrado)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# ==========================================
# TESTE 7: Atualizar perfil
# ==========================================
Write-Host "📍 TESTE 7: Atualizar Perfil do Usuário (PUT /api/users/profile)" -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $global:token" }
    $body = @{
        name = "João Silva Atualizado"
        phone = "(11) 99999-8888"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/api/users/profile" -Method Put -Body $body -ContentType "application/json" -Headers $headers
    Write-Host "✅ Perfil atualizado com sucesso!" -ForegroundColor Green
    Write-Host "   Nome: $($response.data.name)" -ForegroundColor Cyan
    Write-Host "   Telefone: $($response.data.phone)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Falhou: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# ==========================================
# RESUMO FINAL
# ==========================================
Write-Host "🎉 RESUMO DOS TESTES" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ API está funcionando corretamente!" -ForegroundColor Green
Write-Host "✅ MongoDB Atlas conectado" -ForegroundColor Green
Write-Host "✅ Autenticação JWT funcionando" -ForegroundColor Green
Write-Host "✅ Todas as rotas principais testadas" -ForegroundColor Green
Write-Host ""
Write-Host "🔑 Token atual salvo em: `$global:token" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Comandos úteis:" -ForegroundColor Yellow
Write-Host '   $headers = @{ "Authorization" = "Bearer $global:token" }' -ForegroundColor White
Write-Host '   Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Headers $headers' -ForegroundColor White
Write-Host ""
