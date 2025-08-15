---
title: Nmap - Network Mapper
date: 2024-08-15
background: bg-[#2a0d45]
tags:
  - nmap
  - scanning
  - reconnaissance
  - network
categories:
  - Penetration Testing
intro: |
  O Nmap (Network Mapper) é uma ferramenta de código aberto para descoberta de rede e auditoria de segurança. É amplamente usado para mapear redes, descobrir hosts e serviços.
plugins:
  - copyCode
---

## Comandos Básicos

### Scan Básico

```bash
# Scan simples de um host
nmap 192.168.1.1

# Scan de uma rede
nmap 192.168.1.0/24

# Scan de múltiplos hosts
nmap 192.168.1.1-10
```

### Descoberta de Hosts

```bash
# Ping scan (descobrir hosts ativos)
nmap -sn 192.168.1.0/24

# Scan sem ping (útil quando ICMP está bloqueado)
nmap -Pn 192.168.1.1

# Descoberta usando ARP (rede local)
nmap -PR 192.168.1.0/24
```

## Tipos de Scan

### TCP Scans

| Comando | Tipo | Descrição |
|---------|------|-----------|
| `nmap -sS target` | **SYN Scan** | Scan stealth, não completa conexão TCP |
| `nmap -sT target` | **TCP Connect** | Scan completo de conexão TCP |
| `nmap -sA target` | **ACK Scan** | Detecta firewalls e regras de filtragem |
| `nmap -sW target` | **Window Scan** | Detecta portas abertas/fechadas via TCP Window |

### UDP e Outros Scans

| Comando | Tipo | Descrição |
|---------|------|-----------|
| `nmap -sU target` | **UDP Scan** | Scan de portas UDP |
| `nmap -sN target` | **NULL Scan** | Scan sem flags TCP |
| `nmap -sF target` | **FIN Scan** | Scan com flag FIN |
| `nmap -sX target` | **Xmas Scan** | Scan com flags FIN, PSH, URG |

## Especificação de Portas

### Seleção de Portas

```bash
# Scan de porta específica
nmap -p 80 192.168.1.1

# Scan de múltiplas portas
nmap -p 80,443,22 192.168.1.1

# Scan de range de portas
nmap -p 1-1000 192.168.1.1

# Scan de todas as portas
nmap -p- 192.168.1.1

# Top 1000 portas (padrão)
nmap --top-ports 1000 192.168.1.1
```

### Portas por Protocolo

```bash
# Portas TCP específicas
nmap -p T:80,443 192.168.1.1

# Portas UDP específicas
nmap -p U:53,161 192.168.1.1

# Combinação TCP e UDP
nmap -p T:80,U:53 192.168.1.1
```

## Detecção de Serviços

### Service Detection

```bash
# Detecção de versão de serviços
nmap -sV 192.168.1.1

# Detecção agressiva de versão
nmap -sV --version-intensity 9 192.168.1.1

# Detecção leve de versão
nmap -sV --version-intensity 0 192.168.1.1

# Detecção de SO
nmap -O 192.168.1.1

# Detecção agressiva (SO + Serviços + Scripts)
nmap -A 192.168.1.1
```

## Scripts NSE

### Scripts Básicos

```bash
# Executar scripts padrão
nmap -sC 192.168.1.1

# Script específico
nmap --script http-title 192.168.1.1

# Múltiplos scripts
nmap --script "http-*" 192.168.1.1

# Scripts por categoria
nmap --script vuln 192.168.1.1
```

### Categorias de Scripts

| Categoria | Descrição | Exemplo |
|-----------|-----------|---------|
| `auth` | Autenticação | `--script auth` |
| `broadcast` | Descoberta via broadcast | `--script broadcast` |
| `brute` | Ataques de força bruta | `--script brute` |
| `default` | Scripts padrão | `--script default` |
| `discovery` | Descoberta de rede | `--script discovery` |
| `dos` | Denial of Service | `--script dos` |
| `exploit` | Exploração de vulnerabilidades | `--script exploit` |
| `fuzzer` | Fuzzing | `--script fuzzer` |
| `intrusive` | Scripts intrusivos | `--script intrusive` |
| `malware` | Detecção de malware | `--script malware` |
| `safe` | Scripts seguros | `--script safe` |
| `version` | Detecção de versão | `--script version` |
| `vuln` | Detecção de vulnerabilidades | `--script vuln` |

## Controle de Timing

### Timing Templates

```bash
# T0 - Paranoid (muito lento)
nmap -T0 192.168.1.1

# T1 - Sneaky (lento)
nmap -T1 192.168.1.1

# T2 - Polite (lento)
nmap -T2 192.168.1.1

# T3 - Normal (padrão)
nmap -T3 192.168.1.1

# T4 - Aggressive (rápido)
nmap -T4 192.168.1.1

# T5 - Insane (muito rápido)
nmap -T5 192.168.1.1
```

### Controle Manual

```bash
# Controle de taxa de pacotes
nmap --max-rate 100 192.168.1.1
nmap --min-rate 50 192.168.1.1

# Controle de paralelismo
nmap --max-parallelism 10 192.168.1.1
nmap --min-parallelism 1 192.168.1.1

# Timeout personalizado
nmap --host-timeout 300s 192.168.1.1
```

## Evasão de Firewall

### Técnicas de Evasão

```bash
# Fragmentação de pacotes
nmap -f 192.168.1.1

# MTU personalizado
nmap --mtu 24 192.168.1.1

# Decoy (hosts falsos)
nmap -D RND:10 192.168.1.1

# Source port específica
nmap --source-port 53 192.168.1.1

# Spoof de endereço MAC
nmap --spoof-mac Apple 192.168.1.1
```

## Output e Relatórios

### Formatos de Saída

```bash
# Saída normal
nmap -oN scan.txt 192.168.1.1

# Saída XML
nmap -oX scan.xml 192.168.1.1

# Saída grepable
nmap -oG scan.gnmap 192.168.1.1

# Todos os formatos
nmap -oA scan 192.168.1.1

# Saída verbosa
nmap -v 192.168.1.1
nmap -vv 192.168.1.1
```

## Exemplos Práticos

### Reconhecimento Completo

```bash
# Scan completo de rede
nmap -sS -sU -T4 -A -v -PE -PP -PS80,443 -PA3389 -PU40125 -PY -g 53 --script "default or (discovery and safe)" 192.168.1.0/24

# Scan rápido de portas comuns
nmap -T4 -F 192.168.1.0/24

# Scan stealth completo
nmap -sS -O -sV -T2 192.168.1.1

# Detecção de vulnerabilidades
nmap --script vuln 192.168.1.1
```

### Web Application Scanning

```bash
# Scan de aplicações web
nmap -p 80,443 --script http-enum 192.168.1.1

# Detecção de CMS
nmap -p 80,443 --script http-wordpress-enum 192.168.1.1

# Scan de diretórios
nmap -p 80 --script http-brute 192.168.1.1

# Headers HTTP
nmap -p 80,443 --script http-headers 192.168.1.1
```

### Database Scanning

```bash
# MySQL
nmap -p 3306 --script mysql-info 192.168.1.1

# PostgreSQL
nmap -p 5432 --script pgsql-brute 192.168.1.1

# MSSQL
nmap -p 1433 --script ms-sql-info 192.168.1.1

# MongoDB
nmap -p 27017 --script mongodb-info 192.168.1.1
```

## Dicas e Truques

### Performance
- Use `-T4` para scans mais rápidos
- `--min-rate` para controlar velocidade mínima
- `--max-retries` para reduzir tentativas

### Stealth
- Use `-sS` para SYN scan
- `-T2` ou `-T1` para timing lento
- `--randomize-hosts` para ordem aleatória

### Troubleshooting
- `-d` para debug
- `--packet-trace` para ver pacotes
- `--reason` para ver motivo dos resultados

## Referências

- [Nmap Official Documentation](https://nmap.org/docs.html)
- [NSE Script Database](https://nmap.org/nsedoc/)
- [Nmap Network Scanning Book](https://nmap.org/book/)
- [SANS Nmap Cheat Sheet](https://www.sans.org/)
