---
title: Lab 2 - Network Reconnaissance
date: 2024-12-19
background: bg-[#7c3aed]
tags:
  - nmap
  - reconnaissance
  - scanning
  - enumeration
categories:
  - Network Security
intro: |
  Técnicas avançadas de reconnaissance de rede: descoberta de hosts, port scanning, banner grabbing e enumeração de serviços.
plugins:
  - copyCode
---

# Lab 2 - Network Reconnaissance 🔍

## Objetivo
Dominar técnicas de reconnaissance para mapear redes, descobrir hosts ativos e enumerar serviços de forma eficiente e sigilosa.

---

## Cenário: Mapeamento de Rede Corporativa

Você foi contratado para realizar um pentest em uma rede corporativa. Sua primeira tarefa é mapear a infraestrutura de rede e identificar possíveis pontos de entrada.

---

## Fase 1: Descoberta de Hosts

### Ping Sweep Básico
```bash
# Descoberta simples com nmap
nmap -sn 192.168.1.0/24

# Ping sweep mais agressivo
nmap -sn -PE -PP -PM 192.168.1.0/24

# Descoberta ARP (mais silenciosa em LAN)
nmap -PR 192.168.1.0/24

# Descoberta TCP SYN (quando ICMP está bloqueado)
nmap -PS22,80,443 192.168.1.0/24
```

### Técnicas Alternativas
```bash
# Usando fping para descoberta rápida
fping -g 192.168.1.0/24 2>/dev/null | grep "alive"

# Usando netdiscover (passivo)
sudo netdiscover -r 192.168.1.0/24 -P

# Descoberta via ARP scan
arp-scan -l
sudo arp-scan 192.168.1.0/24
```

### Script Personalizado de Descoberta
```bash
#!/bin/bash
# host_discovery.sh

network="192.168.1"
active_hosts=()

echo "Descobrindo hosts ativos na rede $network.0/24..."

for i in {1..254}; do
    ip="$network.$i"
    
    # Ping com timeout de 1 segundo
    if ping -c 1 -W 1 "$ip" &>/dev/null; then
        echo "[+] Host ativo: $ip"
        active_hosts+=("$ip")
    fi &
    
    # Limitar processos paralelos
    if (( $(jobs -r | wc -l) >= 50 )); then
        wait
    fi
done

wait

echo
echo "=== Resumo ==="
echo "Hosts ativos encontrados: ${#active_hosts[@]}"
for host in "${active_hosts[@]}"; do
    echo "  - $host"
done
```

---

## Fase 2: Port Scanning Avançado

### Técnicas de Scanning
```bash
# TCP SYN scan (stealth)
nmap -sS -T4 192.168.1.100

# TCP Connect scan (quando não há privilégios root)
nmap -sT 192.168.1.100

# UDP scan (serviços críticos)
nmap -sU --top-ports 100 192.168.1.100

# Scan completo (TCP + UDP)
nmap -sS -sU -T4 192.168.1.100
```

### Evasão de Firewall
```bash
# Fragmentação de pacotes
nmap -f 192.168.1.100

# Decoy scan (usar IPs falsos)
nmap -D 192.168.1.5,192.168.1.6,ME 192.168.1.100

# Source port spoofing
nmap --source-port 53 192.168.1.100

# Timing mais lento (evitar detecção)
nmap -T1 192.168.1.100

# Randomizar ordem das portas
nmap --randomize-hosts 192.168.1.0/24
```

### Scanning Específico por Serviço
```bash
# Web servers
nmap -p 80,443,8080,8443 192.168.1.0/24

# Mail servers
nmap -p 25,110,143,993,995 192.168.1.0/24

# Database servers
nmap -p 1433,3306,5432,1521 192.168.1.0/24

# Remote access
nmap -p 22,23,3389,5900 192.168.1.0/24

# Top 1000 portas mais comuns
nmap --top-ports 1000 192.168.1.100
```

---

## Fase 3: Enumeração de Serviços

### Detecção de Versões
```bash
# Detectar versões de serviços
nmap -sV 192.168.1.100

# Detecção de OS
nmap -O 192.168.1.100

# Combinado (versão + OS)
nmap -sV -O 192.168.1.100

# Detecção agressiva
nmap -A 192.168.1.100
```

### Scripts NSE (Nmap Scripting Engine)
```bash
# Scripts de vulnerabilidades
nmap --script vuln 192.168.1.100

# Scripts por categoria
nmap --script discovery 192.168.1.100
nmap --script auth 192.168.1.100
nmap --script brute 192.168.1.100

# Scripts específicos
nmap --script http-enum 192.168.1.100
nmap --script smb-enum-shares 192.168.1.100
nmap --script dns-brute example.com

# Listar scripts disponíveis
nmap --script-help vuln
```

### Banner Grabbing Manual
```bash
# HTTP banner
echo -e "HEAD / HTTP/1.0\r\n\r\n" | nc 192.168.1.100 80

# HTTPS banner (com OpenSSL)
echo -e "HEAD / HTTP/1.0\r\n\r\n" | openssl s_client -connect 192.168.1.100:443 -quiet

# SSH banner
nc 192.168.1.100 22

# SMTP banner
nc 192.168.1.100 25

# FTP banner
nc 192.168.1.100 21

# Telnet banner
nc 192.168.1.100 23
```

---

## Fase 4: Enumeração Web

### Descoberta de Diretórios
```bash
# Usando nmap
nmap --script http-enum 192.168.1.100

# Usando dirb
dirb http://192.168.1.100

# Usando gobuster
gobuster dir -u http://192.168.1.100 -w /usr/share/wordlists/dirb/common.txt

# Usando ffuf
ffuf -w /usr/share/wordlists/dirb/common.txt -u http://192.168.1.100/FUZZ
```

### Análise de Aplicações Web
```bash
# Detectar tecnologias web
nmap --script http-waf-detect 192.168.1.100
nmap --script http-waf-fingerprint 192.168.1.100

# Detectar CMS
nmap --script http-wordpress-enum 192.168.1.100
nmap --script http-drupal-enum 192.168.1.100

# Verificar métodos HTTP permitidos
nmap --script http-methods 192.168.1.100

# Detectar arquivos de backup
nmap --script http-backup-finder 192.168.1.100
```

---

## Exercícios Práticos

### Exercício 1: Descoberta Completa de Rede
```bash
#!/bin/bash
# complete_discovery.sh

target_network="192.168.1.0/24"

echo "=== Descoberta Completa de Rede ==="
echo "Alvo: $target_network"
echo

# 1. Descoberta de hosts
echo "1. Descobrindo hosts ativos..."
nmap -sn $target_network | grep "Nmap scan report" | awk '{print $5}' > active_hosts.txt
echo "Hosts encontrados: $(wc -l < active_hosts.txt)"

# 2. Port scan nos hosts ativos
echo "2. Realizando port scan..."
while read host; do
    echo "Scanning $host..."
    nmap -sS -T4 --top-ports 100 $host -oN "scan_$host.txt"
done < active_hosts.txt

# 3. Resumo
echo "3. Gerando resumo..."
echo "=== RESUMO DA DESCOBERTA ===" > discovery_summary.txt
echo "Data: $(date)" >> discovery_summary.txt
echo "Rede: $target_network" >> discovery_summary.txt
echo "Hosts ativos: $(wc -l < active_hosts.txt)" >> discovery_summary.txt
echo >> discovery_summary.txt

cat active_hosts.txt >> discovery_summary.txt

echo "Descoberta concluída! Verifique os arquivos gerados."
```

### Exercício 2: Enumeração de Serviços Web
```bash
#!/bin/bash
# web_enum.sh

target="$1"

if [ -z "$target" ]; then
    echo "Uso: $0 <IP_ou_dominio>"
    exit 1
fi

echo "=== Enumeração Web: $target ==="

# 1. Descobrir portas web
echo "1. Descobrindo portas web..."
web_ports=$(nmap -p 80,443,8080,8443,8000,8888 --open $target | grep "open" | awk -F/ '{print $1}' | tr '\n' ',')
echo "Portas web abertas: $web_ports"

# 2. Banner grabbing
echo "2. Coletando banners..."
for port in 80 443 8080 8443; do
    if nc -z $target $port 2>/dev/null; then
        echo "=== Porta $port ===" >> banners_$target.txt
        if [ $port -eq 443 ]; then
            echo -e "HEAD / HTTP/1.0\r\n\r\n" | openssl s_client -connect $target:$port -quiet 2>/dev/null >> banners_$target.txt
        else
            echo -e "HEAD / HTTP/1.0\r\n\r\n" | nc $target $port >> banners_$target.txt
        fi
        echo >> banners_$target.txt
    fi
done

# 3. Descoberta de diretórios
echo "3. Descobrindo diretórios..."
nmap --script http-enum $target > web_enum_$target.txt

echo "Enumeração web concluída!"
```

### Exercício 3: Scanning Sigiloso
```bash
#!/bin/bash
# stealth_scan.sh

target="$1"

if [ -z "$target" ]; then
    echo "Uso: $0 <IP_alvo>"
    exit 1
fi

echo "=== Scanning Sigiloso: $target ==="

# 1. Descoberta passiva (sem enviar pacotes)
echo "1. Verificando DNS reverso..."
dig -x $target

# 2. Scanning muito lento
echo "2. Port scan sigiloso (pode demorar)..."
nmap -sS -T1 -f --randomize-hosts --data-length 25 $target

# 3. Usando decoys
echo "3. Scanning com decoys..."
nmap -sS -D 8.8.8.8,8.8.4.4,ME -T2 $target

# 4. Source port spoofing
echo "4. Spoofing source port..."
nmap -sS --source-port 53 $target

echo "Scanning sigiloso concluído!"
```

---

## Scripts de Automação

### Scanner Automatizado
```bash
#!/bin/bash
# auto_scanner.sh

# Configurações
network="192.168.1.0/24"
output_dir="scan_results_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$output_dir"

echo "=== Scanner Automatizado ==="
echo "Rede: $network"
echo "Resultados em: $output_dir"
echo

# Fase 1: Descoberta de hosts
echo "[1/4] Descobrindo hosts..."
nmap -sn $network | grep "Nmap scan report" | awk '{print $5}' > "$output_dir/hosts.txt"
host_count=$(wc -l < "$output_dir/hosts.txt")
echo "Hosts encontrados: $host_count"

if [ $host_count -eq 0 ]; then
    echo "Nenhum host encontrado. Encerrando."
    exit 1
fi

# Fase 2: Port scanning
echo "[2/4] Port scanning..."
nmap -sS -T4 -iL "$output_dir/hosts.txt" -oA "$output_dir/portscan"

# Fase 3: Detecção de serviços
echo "[3/4] Detectando serviços..."
nmap -sV -T4 -iL "$output_dir/hosts.txt" -oA "$output_dir/services"

# Fase 4: Scripts de vulnerabilidades
echo "[4/4] Verificando vulnerabilidades..."
nmap --script vuln -T4 -iL "$output_dir/hosts.txt" -oA "$output_dir/vulns"

# Gerar relatório
echo "=== RELATÓRIO DE SCANNING ===" > "$output_dir/report.txt"
echo "Data: $(date)" >> "$output_dir/report.txt"
echo "Rede: $network" >> "$output_dir/report.txt"
echo "Hosts descobertos: $host_count" >> "$output_dir/report.txt"
echo >> "$output_dir/report.txt"
echo "HOSTS ATIVOS:" >> "$output_dir/report.txt"
cat "$output_dir/hosts.txt" >> "$output_dir/report.txt"

echo
echo "Scanning concluído! Resultados em: $output_dir"
```

### Monitor de Novos Hosts
```bash
#!/bin/bash
# host_monitor.sh

network="192.168.1.0/24"
baseline_file="baseline_hosts.txt"
current_file="current_hosts.txt"

# Criar baseline se não existir
if [ ! -f "$baseline_file" ]; then
    echo "Criando baseline de hosts..."
    nmap -sn $network | grep "Nmap scan report" | awk '{print $5}' | sort > "$baseline_file"
    echo "Baseline criado com $(wc -l < $baseline_file) hosts"
    exit 0
fi

echo "Monitorando novos hosts na rede $network..."

while true; do
    # Descobrir hosts atuais
    nmap -sn $network | grep "Nmap scan report" | awk '{print $5}' | sort > "$current_file"
    
    # Comparar com baseline
    new_hosts=$(comm -13 "$baseline_file" "$current_file")
    
    if [ -n "$new_hosts" ]; then
        echo "[$(date)] ALERTA: Novos hosts detectados!"
        echo "$new_hosts"
        
        # Fazer scan rápido dos novos hosts
        echo "$new_hosts" | while read host; do
            echo "Scanning novo host: $host"
            nmap -sS -T4 --top-ports 100 "$host"
        done
        
        # Atualizar baseline
        cp "$current_file" "$baseline_file"
    else
        echo "[$(date)] Nenhum novo host detectado"
    fi
    
    sleep 300  # Verificar a cada 5 minutos
done
```

---

## Técnicas Avançadas

### IPv6 Reconnaissance
```bash
# Descoberta IPv6
nmap -6 -sn fe80::/64

# Port scan IPv6
nmap -6 -sS fe80::1

# Descoberta de vizinhos IPv6
ping6 -c 3 ff02::1%eth0
```

### Scanning através de Proxies
```bash
# Usando proxychains
proxychains nmap -sT 192.168.1.100

# Configurar proxychains
echo "socks5 127.0.0.1 9050" >> /etc/proxychains.conf
```

### Evasão de IDS/IPS
```bash
# Timing muito lento
nmap -T0 192.168.1.100

# Fragmentação máxima
nmap -f -f 192.168.1.100

# MTU personalizado
nmap --mtu 24 192.168.1.100

# Dados aleatórios
nmap --data-length 200 192.168.1.100
```

---

## Cheat Sheet de Nmap

### Descoberta de Hosts
```bash
nmap -sn 192.168.1.0/24          # Ping scan
nmap -PS22,80,443 192.168.1.0/24 # TCP SYN discovery
nmap -PA22,80,443 192.168.1.0/24 # TCP ACK discovery
nmap -PU53,67,68 192.168.1.0/24  # UDP discovery
```

### Port Scanning
```bash
nmap -sS target    # SYN scan
nmap -sT target    # Connect scan
nmap -sU target    # UDP scan
nmap -sN target    # Null scan
nmap -sF target    # FIN scan
nmap -sX target    # Xmas scan
```

### Timing e Performance
```bash
nmap -T0 target    # Paranoid (muito lento)
nmap -T1 target    # Sneaky (lento)
nmap -T2 target    # Polite (lento)
nmap -T3 target    # Normal (padrão)
nmap -T4 target    # Aggressive (rápido)
nmap -T5 target    # Insane (muito rápido)
```

### Output
```bash
nmap -oN file.txt target    # Normal output
nmap -oX file.xml target    # XML output
nmap -oG file.gnmap target  # Grepable output
nmap -oA basename target    # Todos os formatos
```

---

## Próximos Passos

Após dominar este lab, prossiga para:
- **Lab 3**: Análise de Protocolos
- **Lab 4**: Detecção de Ataques
- **Lab 5**: Análise Forense

**Lembre-se:**
- Sempre obtenha autorização antes de fazer scanning
- Use técnicas sigilosas em ambientes sensíveis
- Documente todos os achados
- Mantenha-se dentro do escopo autorizado
