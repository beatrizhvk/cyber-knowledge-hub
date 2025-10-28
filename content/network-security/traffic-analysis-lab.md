---
title: Lab 1 - Captura e Análise de Tráfego
date: 2024-12-19
background: bg-[#059669]
tags:
  - tcpdump
  - wireshark
  - traffic-analysis
  - lab
categories:
  - Network Security
intro: |
  Aprenda técnicas avançadas de captura e análise de tráfego de rede usando tcpdump e Wireshark para detectar atividades suspeitas.
plugins:
  - copyCode
---

# Lab 1 - Captura e Análise de Tráfego 📊

## Objetivo
Dominar técnicas de captura e análise de tráfego para identificar atividades maliciosas e anomalias de rede.

---

## Cenário: Monitoramento de Rede Suspeita

Uma empresa suspeita de atividade maliciosa em sua rede. Como analista de segurança, você deve capturar e analisar o tráfego para identificar possíveis ameaças.

---

## Passo 1: Captura Básica com tcpdump

### Captura Geral
```bash
# Capturar todo tráfego na interface principal
sudo tcpdump -i any -w capture_geral.pcap

# Capturar com timestamp legível
sudo tcpdump -i any -tttt -w capture_timestamp.pcap

# Capturar limitando tamanho do arquivo (100MB)
sudo tcpdump -i any -C 100 -w capture_rotativo.pcap
```

### Capturas Específicas por Protocolo
```bash
# Apenas tráfego HTTP
sudo tcpdump -i any port 80 -w http_traffic.pcap

# Apenas tráfego HTTPS
sudo tcpdump -i any port 443 -w https_traffic.pcap

# Tráfego DNS
sudo tcpdump -i any port 53 -w dns_queries.pcap

# Tráfego SSH
sudo tcpdump -i any port 22 -w ssh_connections.pcap
```

### Filtros Avançados
```bash
# Tráfego de/para host específico
sudo tcpdump -i any host 192.168.1.100 -w host_specific.pcap

# Múltiplos hosts
sudo tcpdump -i any 'host 192.168.1.100 or host 192.168.1.200' -w multi_hosts.pcap

# Tráfego entre duas redes
sudo tcpdump -i any 'net 192.168.1.0/24 and net 10.0.0.0/8' -w inter_network.pcap

# Excluir tráfego local
sudo tcpdump -i any 'not host 127.0.0.1' -w no_localhost.pcap
```

---

## Passo 2: Análise com Wireshark CLI (tshark)

### Estatísticas Gerais
```bash
# Conversações IP (quem fala com quem)
tshark -r capture_geral.pcap -q -z conv,ip

# Estatísticas de protocolos
tshark -r capture_geral.pcap -q -z prot,colinfo

# Hierarquia de protocolos
tshark -r capture_geral.pcap -q -z io,phs

# Endpoints mais ativos
tshark -r capture_geral.pcap -q -z endpoints,ip
```

### Extração de Dados Sensíveis
```bash
# Credenciais HTTP (formulários POST)
tshark -r http_traffic.pcap -Y "http.request.method==POST" \
       -T fields -e http.host -e http.request.uri -e http.file_data

# Cookies de sessão
tshark -r http_traffic.pcap -Y "http.cookie" \
       -T fields -e ip.src -e http.host -e http.cookie

# Downloads de arquivos
tshark -r http_traffic.pcap -Y "http.response" \
       -T fields -e http.host -e http.content_type -e http.content_length

# User-Agents suspeitos
tshark -r http_traffic.pcap -Y "http.user_agent" \
       -T fields -e http.user_agent | sort | uniq -c | sort -nr
```

### Análise de Conexões SSH
```bash
# Tentativas de login SSH
tshark -r ssh_connections.pcap -Y "ssh" \
       -T fields -e ip.src -e ip.dst -e ssh.message_code

# Versões SSH utilizadas
tshark -r ssh_connections.pcap -Y "ssh.protocol" \
       -T fields -e ip.src -e ssh.protocol
```

---

## Passo 3: Detecção de Anomalias

### Detectar Port Scans
```bash
# Identificar múltiplas tentativas de conexão
tshark -r capture_geral.pcap -Y "tcp.flags.syn==1 and tcp.flags.ack==0" \
       -T fields -e ip.src -e ip.dst -e tcp.dstport | \
       sort | uniq -c | sort -nr | head -20

# Script para detectar port scan automaticamente
#!/bin/bash
echo "=== Port Scan Detection ==="
tshark -r capture_geral.pcap -Y "tcp.flags.syn==1 and tcp.flags.ack==0" \
       -T fields -e ip.src -e ip.dst -e tcp.dstport | \
awk '{
    src_dst = $1 " -> " $2
    ports[src_dst]++
    port_list[src_dst] = port_list[src_dst] " " $3
}
END {
    for (conn in ports) {
        if (ports[conn] > 10) {
            print "POSSIBLE PORT SCAN:"
            print "Connection:", conn
            print "Ports attempted:", ports[conn]
            print "Ports:", port_list[conn]
            print "---"
        }
    }
}'
```

### Identificar Beaconing (Comunicação C2)
```bash
# Detectar comunicação regular (possível C2)
tshark -r capture_geral.pcap -T fields \
       -e ip.src -e ip.dst -e frame.time_relative -e tcp.len | \
awk '{
    conn = $1 " -> " $2
    times[conn] = times[conn] " " $3
    sizes[conn] = sizes[conn] " " $4
    count[conn]++
}
END {
    for (c in count) {
        if (count[c] > 20) {
            print "POSSIBLE BEACONING:"
            print "Connection:", c
            print "Packets:", count[c]
            print "---"
        }
    }
}'
```

### Detectar DNS Tunneling
```bash
# Queries DNS suspeitas (muito longas)
tshark -r dns_queries.pcap -Y "dns.qry.name" \
       -T fields -e dns.qry.name | \
       awk 'length($0) > 50 {print "Long DNS query:", $0}'

# Análise de entropia em queries DNS
tshark -r dns_queries.pcap -Y "dns.qry.name" \
       -T fields -e dns.qry.name | \
while read domain; do
    if [ ${#domain} -gt 20 ]; then
        echo "Suspicious domain: $domain (length: ${#domain})"
    fi
done
```

---

## Exercícios Práticos

### Exercício 1: Captura de Tráfego Web
```bash
# 1. Iniciar captura HTTP
sudo tcpdump -i any port 80 -w web_exercise.pcap &

# 2. Gerar tráfego de teste
curl -H "User-Agent: MaliciousBot/1.0" http://httpbin.org/get
curl -X POST http://httpbin.org/post -d "username=admin&password=123456"
curl http://httpbin.org/status/404

# 3. Parar captura
sudo pkill tcpdump

# 4. Analisar resultados
tshark -r web_exercise.pcap -Y "http" -T fields -e http.request.method -e http.host -e http.request.uri
```

### Exercício 2: Simulação de Port Scan
```bash
# 1. Iniciar captura
sudo tcpdump -i lo -w portscan_exercise.pcap &

# 2. Simular port scan
nmap -sS -T4 127.0.0.1

# 3. Parar captura e analisar
sudo pkill tcpdump
tshark -r portscan_exercise.pcap -Y "tcp.flags.syn==1 and tcp.flags.ack==0" \
       -T fields -e tcp.dstport | sort -n | uniq
```

### Exercício 3: Análise de DNS
```bash
# 1. Capturar DNS por 30 segundos
timeout 30 sudo tcpdump -i any port 53 -w dns_exercise.pcap

# 2. Gerar queries de teste
nslookup google.com
nslookup facebook.com
nslookup $(python3 -c "print('a'*60 + '.com')")  # Query suspeita

# 3. Analisar queries
tshark -r dns_exercise.pcap -Y "dns.qry.name" -T fields -e dns.qry.name | sort | uniq
```

---

## Scripts de Automação

### Monitor de Tráfego em Tempo Real
```bash
#!/bin/bash
# real_time_monitor.sh

interface="any"
alert_threshold=1000  # packets per minute

echo "Iniciando monitoramento de tráfego..."
echo "Interface: $interface"
echo "Threshold: $alert_threshold packets/min"
echo "---"

while true; do
    # Capturar por 60 segundos
    timeout 60 tcpdump -i $interface -c $alert_threshold -w temp_monitor.pcap 2>/dev/null
    
    if [ -f temp_monitor.pcap ]; then
        packet_count=$(tshark -r temp_monitor.pcap | wc -l)
        
        if [ $packet_count -ge $alert_threshold ]; then
            echo "[$(date)] ALERT: High traffic detected - $packet_count packets"
            
            # Top talkers
            echo "Top source IPs:"
            tshark -r temp_monitor.pcap -T fields -e ip.src | sort | uniq -c | sort -nr | head -5
            
            echo "Top protocols:"
            tshark -r temp_monitor.pcap -T fields -e _ws.col.Protocol | sort | uniq -c | sort -nr | head -5
            echo "---"
        else
            echo "[$(date)] Normal traffic: $packet_count packets"
        fi
        
        rm -f temp_monitor.pcap
    fi
    
    sleep 10
done
```

### Detector de Anomalias Automatizado
```bash
#!/bin/bash
# anomaly_detector.sh

pcap_file="$1"

if [ -z "$pcap_file" ]; then
    echo "Uso: $0 <arquivo.pcap>"
    exit 1
fi

echo "=== Análise de Anomalias: $pcap_file ==="
echo

# 1. Detectar port scans
echo "1. Detectando Port Scans..."
tshark -r "$pcap_file" -Y "tcp.flags.syn==1 and tcp.flags.ack==0" \
       -T fields -e ip.src -e tcp.dstport | \
awk '{count[$1]++} END {for (ip in count) if (count[ip] > 20) print "Port scan from:", ip, "(" count[ip] " ports)"}' | head -5

# 2. Detectar brute force
echo "2. Detectando Brute Force..."
tshark -r "$pcap_file" -Y "tcp.flags.reset==1" \
       -T fields -e ip.src -e ip.dst | \
awk '{count[$1 " -> " $2]++} END {for (conn in count) if (count[conn] > 10) print "Possible brute force:", conn, "(" count[conn] " resets)"}' | head -5

# 3. Detectar beaconing
echo "3. Detectando Beaconing..."
tshark -r "$pcap_file" -T fields -e ip.src -e ip.dst | \
awk '{count[$1 " -> " $2]++} END {for (conn in count) if (count[conn] > 50) print "Possible beaconing:", conn, "(" count[conn] " connections)"}' | head -5

# 4. Análise de protocolos
echo "4. Distribuição de Protocolos:"
tshark -r "$pcap_file" -T fields -e _ws.col.Protocol | sort | uniq -c | sort -nr | head -10

echo
echo "=== Análise Concluída ==="
```

---

## Filtros Úteis do Wireshark

### Filtros por Protocolo
```
# HTTP
http
http.request.method == "POST"
http.response.code == 404

# HTTPS/TLS
tls
tls.handshake.type == 1

# DNS
dns
dns.qry.name contains "malware"
dns.flags.response == 0

# SSH
ssh
ssh.protocol contains "2.0"

# FTP
ftp
ftp-data
```

### Filtros por Rede
```
# IP específico
ip.addr == 192.168.1.100
ip.src == 192.168.1.100
ip.dst == 192.168.1.100

# Rede específica
ip.addr == 192.168.1.0/24

# Múltiplos IPs
ip.addr == 192.168.1.100 or ip.addr == 192.168.1.200

# Excluir IP
not ip.addr == 192.168.1.1
```

### Filtros por Conteúdo
```
# Contém texto
tcp contains "password"
http contains "login"

# Tamanho do frame
frame.len > 1000
tcp.len == 0

# Flags TCP
tcp.flags.syn == 1
tcp.flags.reset == 1
tcp.flags.fin == 1
```

---

## Próximos Passos

Após dominar este lab, prossiga para:
- **Lab 2**: Network Reconnaissance
- **Lab 3**: Análise de Protocolos
- **Lab 4**: Detecção de Ataques
- **Lab 5**: Análise Forense

**Dicas importantes:**
- Sempre trabalhe com dados anonimizados
- Documente suas descobertas
- Pratique com diferentes tipos de tráfego
- Mantenha-se atualizado com novas técnicas
