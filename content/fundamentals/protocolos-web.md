---
title: Protocolos Web Essenciais
date: 2024-12-19
background: bg-[#2563eb]
tags:
  - http
  - https
  - ssl
  - web
  - protocolos
categories:
  - Fundamentos
intro: |
  Entenda como funcionam HTTP, HTTPS, cookies, sessões e outros protocolos que fazem a web funcionar.
plugins:
  - copyCode
---

# Protocolos Web Essenciais 🌐

## HTTP - A Base da Web

### O que é HTTP?
**HTTP (HyperText Transfer Protocol)** é a linguagem que navegadores e servidores usam para conversar.

### Como Funciona uma Requisição Web

1. **Você digita**: `www.google.com`
2. **Navegador faz**: Requisição HTTP
3. **Servidor responde**: Página HTML
4. **Navegador mostra**: Site na tela

```
Cliente (Navegador) ←→ Servidor (Google)
     Requisição HTTP →
     ← Resposta HTTP
```

---

## Métodos HTTP

### GET - Buscar Informações
```http
GET /search?q=cybersecurity HTTP/1.1
Host: google.com
```
- **Uso**: Carregar páginas, buscar dados
- **Seguro**: Não modifica nada no servidor
- **Visível**: Parâmetros aparecem na URL

### POST - Enviar Dados
```http
POST /login HTTP/1.1
Host: facebook.com
Content-Type: application/x-www-form-urlencoded

username=joao&password=123456
```
- **Uso**: Login, formulários, upload
- **Modifica**: Pode alterar dados no servidor
- **Oculto**: Dados no corpo da requisição

### Outros Métodos Importantes

| Método | Função | Exemplo de Uso |
|---|---|---|
| PUT | Atualizar/criar | Editar perfil |
| DELETE | Remover | Deletar post |
| HEAD | Só cabeçalhos | Verificar se arquivo existe |
| OPTIONS | Ver métodos permitidos | Verificar API |

---

## Códigos de Status HTTP

### 2xx - Sucesso ✅
- **200 OK**: Tudo funcionou
- **201 Created**: Recurso criado
- **204 No Content**: Sucesso, mas sem conteúdo

### 3xx - Redirecionamento 🔄
- **301 Moved Permanently**: Mudou para sempre
- **302 Found**: Mudou temporariamente
- **304 Not Modified**: Use versão em cache

### 4xx - Erro do Cliente ❌
- **400 Bad Request**: Requisição malformada
- **401 Unauthorized**: Precisa fazer login
- **403 Forbidden**: Sem permissão
- **404 Not Found**: Página não existe
- **429 Too Many Requests**: Muitas requisições

### 5xx - Erro do Servidor 💥
- **500 Internal Server Error**: Erro interno
- **502 Bad Gateway**: Problema no proxy
- **503 Service Unavailable**: Servidor sobrecarregado

```bash
# Testar códigos de status
curl -I google.com
curl -I httpstat.us/404
```

---

## HTTPS - HTTP Seguro

### Diferença HTTP vs HTTPS

**HTTP** (Porta 80):
- Dados em texto puro
- Qualquer um pode ler
- Não há verificação de identidade

**HTTPS** (Porta 443):
- Dados criptografados
- Impossível ler no meio do caminho
- Certificado verifica identidade

### Como HTTPS Funciona

1. **Handshake SSL/TLS**: Cliente e servidor negociam criptografia
2. **Troca de chaves**: Estabelecem chave secreta compartilhada
3. **Comunicação segura**: Todos os dados são criptografados

```
Cliente                    Servidor
   |                          |
   |--- ClientHello --------->|
   |<-- ServerHello ----------|
   |<-- Certificado ----------|
   |--- Chave do Cliente ---->|
   |                          |
   |<==== Dados Seguros ====>|
```

### Verificar Certificado SSL
```bash
# Ver detalhes do certificado
openssl s_client -connect google.com:443

# Verificar expiração
echo | openssl s_client -connect google.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## Headers HTTP Importantes

### Headers de Requisição
```http
GET / HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)
Accept: text/html,application/xhtml+xml
Accept-Language: pt-BR,pt;q=0.9,en;q=0.8
Cookie: session_id=abc123
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Headers de Resposta
```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1234
Set-Cookie: session_id=xyz789; HttpOnly; Secure
Cache-Control: max-age=3600
X-Frame-Options: DENY
```

### Headers de Segurança

| Header | Função | Exemplo |
|---|---|---|
| X-Frame-Options | Previne clickjacking | `DENY` |
| X-XSS-Protection | Proteção XSS | `1; mode=block` |
| X-Content-Type-Options | Previne MIME sniffing | `nosniff` |
| Strict-Transport-Security | Força HTTPS | `max-age=31536000` |
| Content-Security-Policy | Controla recursos | `default-src 'self'` |

---

## Cookies e Sessões

### O que são Cookies?
**Cookies** são pequenos arquivos que sites salvam no seu navegador para lembrar informações.

### Tipos de Cookies

**Session Cookie** (temporário):
```http
Set-Cookie: session_id=abc123
```

**Persistent Cookie** (permanente):
```http
Set-Cookie: user_pref=dark_mode; Expires=Wed, 09 Jun 2025 10:18:14 GMT
```

**Secure Cookie** (só HTTPS):
```http
Set-Cookie: token=xyz789; Secure; HttpOnly; SameSite=Strict
```

### Atributos de Segurança

- **HttpOnly**: JavaScript não pode acessar
- **Secure**: Só enviado via HTTPS
- **SameSite**: Controla envio entre sites

### Ver Cookies no Navegador
```javascript
// No console do navegador
document.cookie

// Ver todos os cookies
console.log(document.cookie.split(';'));
```

---

## Autenticação Web

### Basic Authentication
```http
Authorization: Basic dXNlcjpwYXNzd29yZA==
```
- Usuário:senha em Base64
- **Inseguro** sem HTTPS
- Simples de implementar

### Bearer Token
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Token JWT ou similar
- Mais seguro que Basic Auth
- Usado em APIs modernas

### Session-based
1. Login → Servidor cria sessão
2. Retorna cookie com ID da sessão
3. Requisições futuras enviam cookie
4. Servidor valida sessão

---

## WebSockets

### HTTP vs WebSocket

**HTTP**: Pergunta → Resposta (uma vez)
**WebSocket**: Conexão permanente (bidirecional)

### Quando Usar WebSockets
- Chat em tempo real
- Jogos online
- Atualizações ao vivo
- Trading/bolsa de valores

```javascript
// Exemplo WebSocket
const ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = function() {
    console.log('Conectado!');
    ws.send('Olá servidor!');
};

ws.onmessage = function(event) {
    console.log('Recebido:', event.data);
};
```

---

## APIs REST

### Princípios REST
- **Stateless**: Cada requisição é independente
- **Cacheable**: Respostas podem ser cacheadas
- **Uniform Interface**: URLs padronizadas

### Exemplo de API REST
```http
GET /api/users          # Listar usuários
GET /api/users/123      # Ver usuário específico
POST /api/users         # Criar usuário
PUT /api/users/123      # Atualizar usuário
DELETE /api/users/123   # Deletar usuário
```

### Testando APIs
```bash
# GET request
curl https://jsonplaceholder.typicode.com/users

# POST request
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com"}'
```

---

## Ferramentas de Desenvolvimento

### Navegador (F12)
- **Network**: Ver todas as requisições
- **Console**: Executar JavaScript
- **Application**: Ver cookies, localStorage
- **Security**: Verificar certificados

### Linha de Comando
```bash
# cURL - Cliente HTTP universal
curl -v https://google.com

# Ver headers de resposta
curl -I https://github.com

# Seguir redirecionamentos
curl -L https://bit.ly/3example

# Salvar resposta em arquivo
curl https://api.github.com/users/octocat > user.json
```

### Ferramentas Gráficas
- **Postman**: Testar APIs
- **Insomnia**: Cliente REST
- **Burp Suite**: Proxy para segurança
- **OWASP ZAP**: Scanner de vulnerabilidades

---

## Problemas Comuns e Soluções

### CORS (Cross-Origin Resource Sharing)
**Problema**: Site A não pode acessar API do Site B
**Solução**: Servidor B deve permitir origem A

```http
Access-Control-Allow-Origin: https://meusite.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Cache Issues
**Problema**: Navegador mostra versão antiga
**Soluções**:
```http
# Forçar revalidação
Cache-Control: no-cache

# Nunca cachear
Cache-Control: no-store

# Cachear por 1 hora
Cache-Control: max-age=3600
```

### Timeout
**Problema**: Requisição demora muito
**Soluções**:
- Aumentar timeout no cliente
- Otimizar servidor
- Usar loading indicators

---

## Exercícios Práticos

### 1. Analisar Requisições
1. Abra F12 no navegador
2. Vá para aba Network
3. Acesse um site qualquer
4. Observe as requisições HTTP

### 2. Testar com cURL
```bash
# Ver headers de resposta
curl -I https://httpbin.org/get

# Enviar dados POST
curl -X POST https://httpbin.org/post -d "nome=João"

# Testar diferentes códigos de status
curl -I https://httpstat.us/404
curl -I https://httpstat.us/500
```

### 3. Verificar Segurança
```bash
# Verificar headers de segurança
curl -I https://github.com | grep -i "x-\|strict\|content-security"

# Testar SSL
curl -I https://badssl.com
```

---

## Resumo

**Conceitos Essenciais:**
- **HTTP**: Protocolo base da web
- **HTTPS**: Versão segura com criptografia
- **Métodos**: GET (buscar), POST (enviar)
- **Status**: 2xx (sucesso), 4xx (erro cliente), 5xx (erro servidor)
- **Cookies**: Armazenam estado entre requisições
- **Headers**: Metadados das requisições/respostas

**Para Segurança:**
- Sempre use HTTPS em produção
- Configure headers de segurança
- Valide entrada do usuário
- Implemente autenticação adequada
- Monitor logs de acesso

Estes fundamentos são essenciais para entender vulnerabilidades web e como proteger aplicações!
