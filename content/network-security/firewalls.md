---
title: Firewalls
date: 2024-08-15
background: bg-[#dc2626]
tags:
  - firewall
  - network
  - security
  - iptables
categories:
  - Network Security
intro: |
  Firewalls são sistemas de segurança que monitoram e controlam o tráfego de rede baseado em regras de segurança predefinidas. Eles formam uma barreira entre redes confiáveis e não confiáveis.
plugins:
  - copyCode
---

## Tipos de Firewall

### Por Arquitetura

**Packet Filtering**
- Analisa cabeçalhos de pacotes
- Decisões baseadas em IP, porta, protocolo
- Rápido mas limitado

**Stateful Inspection**
- Mantém estado das conexões
- Analisa contexto da comunicação
- Mais seguro que packet filtering

**Application Layer**
- Inspeção profunda de pacotes (DPI)
- Análise de conteúdo da aplicação
- Maior overhead mas mais seguro

### Por Implementação

**Network Firewall**
- Protege perímetro da rede
- Hardware dedicado ou software
- Controla tráfego entre redes

**Host-based Firewall**
- Instalado em cada host
- Protege sistema individual
- Controle granular por aplicação

## iptables (Linux)

### Comandos Básicos

```bash
# Listar regras
iptables -L -n -v

# Limpar todas as regras
iptables -F

# Definir política padrão
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT
```

### Regras Comuns

```bash
# Permitir loopback
iptables -A INPUT -i lo -j ACCEPT

# Permitir conexões estabelecidas
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Permitir SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Permitir HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Bloquear IP específico
iptables -A INPUT -s 192.168.1.100 -j DROP
```

## UFW (Ubuntu)

### Configuração Básica

```bash
# Habilitar UFW
sudo ufw enable

# Status
sudo ufw status verbose

# Política padrão
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### Regras UFW

```bash
# Permitir porta
sudo ufw allow 22
sudo ufw allow ssh
sudo ufw allow 80/tcp

# Permitir de IP específico
sudo ufw allow from 192.168.1.100

# Permitir range de portas
sudo ufw allow 6000:6007/tcp

# Negar conexão
sudo ufw deny 23

# Deletar regra
sudo ufw delete allow 80
```

## Windows Firewall

### PowerShell Commands

```powershell
# Status do firewall
Get-NetFirewallProfile

# Listar regras
Get-NetFirewallRule | Where-Object {$_.Enabled -eq 'True'}

# Criar regra de entrada
New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow

# Criar regra de saída
New-NetFirewallRule -DisplayName "Block Telnet" -Direction Outbound -Protocol TCP -RemotePort 23 -Action Block

# Habilitar/Desabilitar firewall
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

### Netsh Commands

```cmd
# Status do firewall
netsh advfirewall show allprofiles

# Habilitar firewall
netsh advfirewall set allprofiles state on

# Adicionar regra
netsh advfirewall firewall add rule name="Allow HTTP" dir=in action=allow protocol=TCP localport=80

# Remover regra
netsh advfirewall firewall delete rule name="Allow HTTP"
```

## pfSense

### Configuração Web

**Interface Web:** https://firewall-ip

**Configurações Básicas:**
1. **Interfaces** - Configurar WAN/LAN
2. **Rules** - Criar regras de firewall
3. **NAT** - Configurar redirecionamento
4. **VPN** - Configurar OpenVPN/IPSec

### Regras Comuns

```bash
# Bloquear acesso a redes privadas (WAN)
Action: Block
Interface: WAN
Source: RFC1918 networks
Destination: Any

# Permitir acesso web (LAN)
Action: Pass
Interface: LAN
Protocol: TCP
Source: LAN net
Destination: Any
Destination Port: 80, 443
```

## Configurações Avançadas

### Rate Limiting

```bash
# iptables - Limitar conexões SSH
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -m recent --set
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW -m recent --update --seconds 60 --hitcount 4 -j DROP

# UFW - Rate limiting
sudo ufw limit ssh
sudo ufw limit 22/tcp
```

### Port Knocking

```bash
# Configuração knockd
[options]
    UseSyslog

[openSSH]
    sequence    = 7000,8000,9000
    seq_timeout = 5
    command     = /sbin/iptables -A INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn

[closeSSH]
    sequence    = 9000,8000,7000
    seq_timeout = 5
    command     = /sbin/iptables -D INPUT -s %IP% -p tcp --dport 22 -j ACCEPT
    tcpflags    = syn
```

## Monitoramento e Logs

### Log Analysis

```bash
# iptables logs
tail -f /var/log/kern.log | grep iptables

# UFW logs
tail -f /var/log/ufw.log

# Analisar tentativas de conexão
grep "DPT=22" /var/log/ufw.log | awk '{print $12}' | sort | uniq -c | sort -nr

# Top IPs bloqueados
grep "BLOCK" /var/log/ufw.log | awk '{print $12}' | cut -d'=' -f2 | sort | uniq -c | sort -nr | head -10
```

### Ferramentas de Monitoramento

```bash
# netstat - Conexões ativas
netstat -tuln

# ss - Substituição moderna do netstat
ss -tuln

# lsof - Arquivos/portas abertas
lsof -i :80
lsof -i TCP:22

# nmap - Scan de portas próprias
nmap -sS localhost
```

## Bypass e Evasão

### Técnicas Comuns

**Fragmentação de Pacotes**
```bash
# nmap com fragmentação
nmap -f target

# hping3 com fragmentação
hping3 -f target -p 80
```

**Source Port Spoofing**
```bash
# nmap com source port específica
nmap --source-port 53 target

# hping3 com source port
hping3 -s 53 target -p 80
```

**Tunneling**
```bash
# SSH Tunnel
ssh -L 8080:target:80 user@proxy

# HTTP Tunnel
httptunnel -F 8080 target:80
```

## Melhores Práticas

### Configuração Segura
1. **Princípio do Menor Privilégio**
   - Negar tudo por padrão
   - Permitir apenas o necessário

2. **Defesa em Profundidade**
   - Múltiplas camadas de firewall
   - Combinação com IDS/IPS

3. **Monitoramento Contínuo**
   - Logs centralizados
   - Alertas automatizados

### Regras de Ouro
- Documentar todas as regras
- Revisar regras periodicamente
- Testar mudanças em ambiente controlado
- Manter backup das configurações

## Troubleshooting

### Comandos de Diagnóstico

```bash
# Testar conectividade
telnet target 80
nc -zv target 80

# Trace de pacotes
tcpdump -i eth0 host target
wireshark

# Debug iptables
iptables -A INPUT -j LOG --log-prefix "IPTABLES-DEBUG: "
tail -f /var/log/kern.log

# Verificar se porta está aberta
nmap -p 80 localhost
netstat -tuln | grep :80
```

### Problemas Comuns

1. **Regras Conflitantes**
   - Verificar ordem das regras
   - Usar `-L --line-numbers`

2. **Bloqueio Acidental**
   - Sempre manter acesso de emergência
   - Usar `at` para reverter mudanças

3. **Performance**
   - Otimizar ordem das regras
   - Usar connection tracking

## Referências

- [iptables Tutorial](https://www.netfilter.org/documentation/)
- [UFW Documentation](https://help.ubuntu.com/community/UFW)
- [pfSense Documentation](https://docs.netgate.com/pfsense/)
- [NIST Firewall Guidelines](https://csrc.nist.gov/publications/detail/sp/800-41/rev-1/final)
