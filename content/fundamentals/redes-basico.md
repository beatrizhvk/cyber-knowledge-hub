---
title: Fundamentos de Redes
date: 2024-12-19
background: bg-[#1e293b]
tags:
  - redes
  - protocolos
  - tcp-ip
  - fundamentos
categories:
  - Fundamentos
intro: |
  Aprenda como a internet funciona desde o básico: protocolos, endereçamento IP, DNS e como os dados viajam pela rede.
plugins:
  - copyCode
---

# Fundamentos de Redes 🌐

## O que é uma Rede?

Uma **rede** é um conjunto de dispositivos conectados que podem trocar informações. Imagine como uma cidade com ruas (cabos) e casas (dispositivos) que se comunicam através de cartas (dados).

### Tipos de Redes

- **LAN** (Local Area Network): Rede local (sua casa, escritório)
- **WAN** (Wide Area Network): Rede ampla (internet)
- **WiFi**: Rede sem fio

---

## Como os Dados Viajam

### 1. Pacotes de Dados
Os dados não viajam inteiros pela internet. São divididos em pequenos pedaços chamados **pacotes**.

```
Exemplo: Enviar uma foto
Foto original → Dividida em 100 pacotes → Enviada → Remontada no destino
```

### 2. Roteamento
Os pacotes podem tomar caminhos diferentes para chegar ao destino, como carros escolhendo rotas diferentes no trânsito.

---

## Endereços IP

### O que é um IP?
**IP (Internet Protocol)** é como o endereço da sua casa na internet. Cada dispositivo tem um número único.

### Tipos de IP

**IPv4** (mais comum):
```
Exemplo: 192.168.1.1
Formato: XXX.XXX.XXX.XXX (0-255)
```

**IPv6** (mais novo):
```
Exemplo: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
Formato: Hexadecimal com ":"
```

### IPs Especiais

| IP | Significado |
|---|---|
| 127.0.0.1 | Localhost (seu próprio computador) |
| 192.168.x.x | Rede local (casa/escritório) |
| 10.x.x.x | Rede privada |
| 0.0.0.0 | Qualquer endereço |

---

## Protocolos Essenciais

### TCP (Transmission Control Protocol)
- **Confiável**: Garante que todos os dados chegem
- **Ordenado**: Dados chegam na ordem correta
- **Usado em**: Navegação web, email, download de arquivos

```bash
# Exemplo de conexão TCP
telnet google.com 80
```

### UDP (User Datagram Protocol)
- **Rápido**: Não verifica se dados chegaram
- **Sem garantias**: Pode perder pacotes
- **Usado em**: Jogos online, streaming de vídeo, DNS

### ICMP (Internet Control Message Protocol)
- **Diagnóstico**: Testa conectividade
- **Comando ping**: Usa ICMP

```bash
# Testar conectividade
ping google.com
```

---

## Modelo OSI Simplificado

O **Modelo OSI** explica como a comunicação em rede funciona em camadas:

| Camada | Nome | O que faz | Exemplo |
|---|---|---|---|
| 7 | Aplicação | Programas que você usa | Navegador, WhatsApp |
| 6 | Apresentação | Criptografia, compressão | HTTPS, ZIP |
| 5 | Sessão | Controla conversas | Login em sites |
| 4 | Transporte | Entrega confiável | TCP, UDP |
| 3 | Rede | Roteamento entre redes | IP, roteadores |
| 2 | Enlace | Comunicação local | WiFi, Ethernet |
| 1 | Física | Cabos e sinais | Cabos, ondas de rádio |

### Analogia: Enviando uma Carta
1. **Física**: O carteiro e as ruas
2. **Enlace**: Regras do correio local
3. **Rede**: Endereço na carta
4. **Transporte**: Carta registrada (TCP) ou comum (UDP)
5. **Sessão**: Conversa por cartas
6. **Apresentação**: Idioma da carta
7. **Aplicação**: O conteúdo da carta

---

## DNS - Sistema de Nomes

### O que é DNS?
**DNS (Domain Name System)** traduz nomes em endereços IP. É como uma agenda telefônica da internet.

```
google.com → 142.250.191.14
facebook.com → 157.240.241.35
```

### Como Funciona

1. Você digita: `www.google.com`
2. Seu computador pergunta ao DNS: "Qual o IP do google.com?"
3. DNS responde: "142.250.191.14"
4. Seu computador conecta no IP

```bash
# Ver o IP de um site
nslookup google.com

# Ver informações DNS detalhadas
dig google.com
```

### Tipos de Registros DNS

| Tipo | Função | Exemplo |
|---|---|---|
| A | IP do site | google.com → 142.250.191.14 |
| AAAA | IPv6 do site | google.com → 2001:4860:4860::8888 |
| CNAME | Apelido | www.google.com → google.com |
| MX | Servidor de email | gmail.com → mx.google.com |
| TXT | Informações extras | Verificações, SPF |

---

## Portas de Rede

### O que são Portas?
**Portas** são como apartamentos em um prédio. O IP é o endereço do prédio, a porta é o apartamento específico.

### Portas Importantes

| Porta | Serviço | Uso |
|---|---|---|
| 80 | HTTP | Sites normais |
| 443 | HTTPS | Sites seguros |
| 22 | SSH | Acesso remoto seguro |
| 21 | FTP | Transferência de arquivos |
| 25 | SMTP | Envio de email |
| 53 | DNS | Resolução de nomes |
| 3389 | RDP | Área de trabalho remota |

```bash
# Ver portas abertas no seu computador
netstat -an

# Testar se uma porta está aberta
telnet google.com 80
```

---

## DHCP - Configuração Automática

### O que é DHCP?
**DHCP (Dynamic Host Configuration Protocol)** distribui automaticamente configurações de rede.

### Como Funciona
1. Dispositivo conecta na rede
2. Pergunta: "Alguém pode me dar um IP?"
3. Servidor DHCP responde: "Use o IP 192.168.1.100"
4. Também fornece: Gateway, DNS, máscara de rede

### Configuração Típica
```
IP: 192.168.1.100
Máscara: 255.255.255.0
Gateway: 192.168.1.1
DNS: 8.8.8.8
```

---

## Comandos Úteis para Diagnóstico

### Windows
```cmd
# Ver configuração de rede
ipconfig /all

# Renovar IP do DHCP
ipconfig /release
ipconfig /renew

# Limpar cache DNS
ipconfig /flushdns

# Testar conectividade
ping 8.8.8.8

# Rastrear rota até destino
tracert google.com
```

### Linux/Mac
```bash
# Ver configuração de rede
ifconfig
# ou
ip addr show

# Testar conectividade
ping 8.8.8.8

# Rastrear rota
traceroute google.com

# Ver tabela de roteamento
route -n
# ou
ip route show
```

---

## Segurança Básica de Rede

### Conceitos Importantes

**Firewall**: Porteiro da rede que decide quem entra e sai
**NAT**: Traduz IPs privados para públicos
**VPN**: Túnel seguro pela internet
**Proxy**: Intermediário entre você e a internet

### Boas Práticas
- Use senhas fortes no WiFi (WPA3/WPA2)
- Mantenha firmware do roteador atualizado
- Desabilite serviços desnecessários
- Monitor tráfego suspeito

---

## Exercícios Práticos

### 1. Descobrir seu IP
```bash
# IP público (como o mundo te vê)
curl ifconfig.me

# IP local (na sua rede)
ipconfig  # Windows
ifconfig  # Linux/Mac
```

### 2. Testar Conectividade
```bash
# Testar se o Google está acessível
ping google.com

# Ver o caminho até o Google
tracert google.com  # Windows
traceroute google.com  # Linux/Mac
```

### 3. Explorar DNS
```bash
# Descobrir IP de um site
nslookup facebook.com

# Ver todos os registros DNS
dig google.com ANY
```

---

## Resumo

**Conceitos Chave:**
- **IP**: Endereço único na internet
- **TCP/UDP**: Protocolos de transporte
- **DNS**: Traduz nomes em IPs
- **Portas**: Identificam serviços específicos
- **DHCP**: Configura rede automaticamente

**Lembre-se:**
- Internet = rede de redes conectadas
- Dados viajam em pacotes
- Cada dispositivo tem endereço único (IP)
- Protocolos definem regras de comunicação
- DNS torna a internet mais fácil de usar

Este é o fundamento para entender segurança de rede, ataques e defesas!
