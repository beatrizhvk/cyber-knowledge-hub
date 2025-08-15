---
title: Burp Suite
date: 2024-08-15
background: bg-[#ff6633]
tags:
  - burp
  - proxy
  - web-security
  - testing
categories:
  - Tools
intro: |
  Burp Suite é uma plataforma integrada para testes de segurança de aplicações web. É amplamente usado por profissionais de segurança para encontrar vulnerabilidades em aplicações web.
plugins:
  - copyCode
---

## Configuração Inicial

### Configuração do Proxy

1. **Configurar Burp Proxy**
   - Proxy → Options
   - Interface: 127.0.0.1:8080
   - Running: ✓

2. **Configurar Browser**
   - Proxy HTTP: 127.0.0.1:8080
   - Proxy HTTPS: 127.0.0.1:8080

### Certificado SSL

```bash
# Baixar certificado do Burp
# Acesse: http://burp/cert
# Salve como: burp-cert.der

# Instalar no Firefox
# Settings → Privacy & Security → Certificates
# Import → burp-cert.der
```

## Principais Módulos

### Proxy

| Função | Descrição | Atalho |
|--------|-----------|--------|
| **Intercept** | Interceptar requisições/respostas | `Ctrl+F` |
| **HTTP History** | Histórico de requisições | `Ctrl+H` |
| **WebSockets History** | Histórico WebSocket | - |
| **Options** | Configurações do proxy | - |

### Target

```bash
# Site Map - Mapeamento automático
# Scope - Definir escopo do teste
# Issue Definitions - Definições de vulnerabilidades
```

**Configuração de Escopo:**
- Target → Scope → Add
- Include in scope: `https://example.com/*`
- Exclude from scope: `https://example.com/logout`

## Ferramentas Principais

### Repeater

```http
# Exemplo de requisição no Repeater
GET /api/users/1 HTTP/1.1
Host: example.com
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
Content-Type: application/json

# Modificar parâmetros para teste
GET /api/users/2 HTTP/1.1
GET /api/users/../admin HTTP/1.1
```

**Atalhos do Repeater:**
- `Ctrl+R` - Enviar para Repeater
- `Ctrl+Space` - Enviar requisição
- `Ctrl+U` - URL decode
- `Ctrl+Shift+U` - URL encode

### Intruder

**Tipos de Ataque:**

| Tipo | Descrição | Uso |
|------|-----------|-----|
| **Sniper** | Um payload por vez | Brute force simples |
| **Battering Ram** | Mesmo payload em todas posições | Teste de autenticação |
| **Pitchfork** | Payloads paralelos | Teste de credenciais |
| **Cluster Bomb** | Todas combinações | Teste exaustivo |

```bash
# Exemplo de payload para Intruder
# Posições marcadas com §§
POST /login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=§admin§&password=§password§
```

### Scanner (Pro)

```bash
# Tipos de scan
- Passive Scan: Análise sem modificar requisições
- Active Scan: Testes invasivos com payloads

# Configuração de scan
Scanner → Options → Attack Insertion Points
- URL path parameters
- Body parameters  
- Cookies
- Headers
```

## Extensões Úteis

### Extensões Populares

| Extensão | Função | Categoria |
|----------|--------|-----------|
| **Logger++** | Log avançado de requisições | Logging |
| **Autorize** | Teste de autorização | Authorization |
| **JSON Beautifier** | Formatação JSON | Utilities |
| **Turbo Intruder** | Intruder avançado | Testing |
| **Active Scan++** | Scans adicionais | Scanning |
| **Param Miner** | Descoberta de parâmetros | Discovery |
| **Collaborator Everywhere** | Testes out-of-band | Testing |

### Instalação de Extensões

```bash
# Via BApp Store
Extender → BApp Store → Install

# Via arquivo
Extender → Extensions → Add
Type: Python/Java
Extension file: extensao.py
```

## Testes Comuns

### SQL Injection

```sql
-- Payloads comuns para Intruder
' OR '1'='1
' UNION SELECT NULL--
'; DROP TABLE users--
' AND (SELECT SUBSTRING(@@version,1,1))='5'--

-- Teste manual no Repeater
GET /user?id=1' OR '1'='1 HTTP/1.1
```

### XSS Testing

```javascript
// Payloads XSS
<script>alert('XSS')</script>
<img src=x onerror=alert('XSS')>
javascript:alert('XSS')
<svg onload=alert('XSS')>

// Teste no Repeater
POST /comment HTTP/1.1
Content-Type: application/x-www-form-urlencoded

comment=<script>alert('XSS')</script>
```

### Authentication Bypass

```bash
# Teste de bypass de autenticação
# Modificar headers
X-Forwarded-For: 127.0.0.1
X-Real-IP: 127.0.0.1
X-Originating-IP: 127.0.0.1

# Modificar User-Agent
User-Agent: Googlebot/2.1

# Teste de role escalation
# Modificar cookies/tokens
Cookie: role=admin; user_id=1
```

## Metodologia de Teste

### Reconhecimento

1. **Mapeamento da Aplicação**
   - Spider automático
   - Navegação manual
   - Análise do site map

2. **Análise de Tecnologias**
   - Headers de resposta
   - Comentários HTML
   - Arquivos de configuração

### Teste de Vulnerabilidades

```bash
# Checklist básico
□ SQL Injection
□ XSS (Reflected, Stored, DOM)
□ CSRF
□ Authentication Bypass
□ Authorization Issues
□ File Upload Vulnerabilities
□ Directory Traversal
□ Command Injection
□ XXE (XML External Entity)
□ SSRF (Server-Side Request Forgery)
```

## Configurações Avançadas

### Match and Replace

```bash
# Proxy → Options → Match and Replace
# Substituir headers automaticamente

Type: Request Header
Match: User-Agent: .*
Replace: User-Agent: BurpSuite-Scanner
```

### Session Handling Rules

```bash
# Project Options → Sessions → Session Handling Rules
# Automatizar login/logout
# Manter sessões ativas
# Extrair tokens CSRF
```

### Upstream Proxies

```bash
# User Options → Connections → Upstream Proxies
# Configurar proxy chain
# Usar Tor para anonimato
# Configurar proxy corporativo
```

## Colaborator

### Burp Collaborator

```bash
# Detectar vulnerabilidades out-of-band
# SSRF, XXE, DNS exfiltration

# Payload exemplo
http://burpcollaborator.net
https://subdomain.burpcollaborator.net

# Verificar interações
Burp → Collaborator client → Poll now
```

## Dicas e Truques

### Performance
- Desabilitar Proxy → Intercept quando não necessário
- Usar filtros no HTTP History
- Limitar escopo para reduzir ruído

### Workflow
- Usar Target → Scope para focar testes
- Salvar estado do projeto regularmente
- Usar comentários para marcar achados

### Reporting
- Screenshot de vulnerabilidades
- Salvar requisições/respostas relevantes
- Documentar steps to reproduce

## Integração com Outras Ferramentas

### Command Line

```bash
# Exportar requisições
# Save selected items → Copy as curl command

curl -X POST "https://example.com/api" \
  -H "Authorization: Bearer token" \
  -d "param=value"

# Importar de outras ferramentas
# File → Import → Scan results
```

## Referências

- [Burp Suite Documentation](https://portswigger.net/burp/documentation)
- [Web Security Academy](https://portswigger.net/web-security)
- [Burp Extensions](https://github.com/snoopysecurity/awesome-burp-extensions)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
