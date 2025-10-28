---
title: Setup do Lab de Análise de Rede
date: 2024-12-19
background: bg-[#dc2626]
tags:
  - network-analysis
  - setup
  - lab
  - intermediario
categories:
  - Network Security
intro: |
  Configuração completa do ambiente de laboratório para análise de rede avançada com ferramentas essenciais.
plugins:
  - copyCode
---

# Setup do Lab de Análise de Rede 🔧

## Pré-requisitos

- **Sistema**: Linux (Ubuntu/Kali/CentOS)
- **Conhecimento**: TCP/IP, protocolos básicos
- **Hardware**: 4GB RAM, 20GB espaço livre
- **Ambiente**: Máquina virtual recomendada

---

## Instalação de Ferramentas

### Ferramentas Essenciais
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar ferramentas de análise
sudo apt install -y wireshark tcpdump nmap netcat-openbsd \
                    iptables-persistent net-tools dnsutils \
                    curl wget python3-scapy hping3

# Adicionar usuário ao grupo wireshark
sudo usermod -a -G wireshark $USER
```

### Ferramentas Avançadas
```bash
# Zeek (Bro) - Network Security Monitor
sudo apt install zeek

# Suricata - IDS/IPS
sudo apt install suricata

# NetworkMiner (alternativa)
wget https://www.netresec.com/?download=NetworkMiner -O networkminer.zip
```

---

## Configuração de Rede Virtual

### Criar Ambiente Isolado
```bash
# Criar namespaces de rede
sudo ip netns add lab-net
sudo ip netns add target-net

# Criar bridge virtual
sudo ip link add lab-br type bridge
sudo ip link set lab-br up

# Criar interfaces virtuais
sudo ip link add veth-lab type veth peer name veth-target
sudo ip link set veth-lab netns lab-net
sudo ip link set veth-target netns target-net
```

### Configurar IPs
```bash
# Configurar endereçamento
sudo ip netns exec lab-net ip addr add 192.168.100.10/24 dev veth-lab
sudo ip netns exec target-net ip addr add 192.168.100.20/24 dev veth-target

# Ativar interfaces
sudo ip netns exec lab-net ip link set veth-lab up
sudo ip netns exec target-net ip link set veth-target up
sudo ip netns exec lab-net ip link set lo up
sudo ip netns exec target-net ip link set lo up
```

---

## Verificação do Setup

### Testar Conectividade
```bash
# Ping entre namespaces
sudo ip netns exec lab-net ping -c 3 192.168.100.20

# Verificar interfaces
sudo ip netns exec lab-net ip addr show
sudo ip netns exec target-net ip addr show
```

### Testar Captura
```bash
# Capturar tráfego entre namespaces
sudo tcpdump -i veth-lab -w test_capture.pcap &

# Gerar tráfego de teste
sudo ip netns exec lab-net ping -c 5 192.168.100.20

# Parar captura e analisar
sudo pkill tcpdump
tshark -r test_capture.pcap
```

---

## Scripts de Configuração

### Script de Setup Automático
```bash
#!/bin/bash
# setup_lab.sh

echo "Configurando laboratório de análise de rede..."

# Instalar dependências
sudo apt update
sudo apt install -y wireshark tcpdump nmap netcat-openbsd net-tools

# Configurar namespaces
sudo ip netns add lab-net 2>/dev/null
sudo ip netns add target-net 2>/dev/null

# Configurar rede virtual
sudo ip link add veth-lab type veth peer name veth-target 2>/dev/null
sudo ip link set veth-lab netns lab-net
sudo ip link set veth-target netns target-net

# Configurar IPs
sudo ip netns exec lab-net ip addr add 192.168.100.10/24 dev veth-lab
sudo ip netns exec target-net ip addr add 192.168.100.20/24 dev veth-target
sudo ip netns exec lab-net ip link set veth-lab up
sudo ip netns exec target-net ip link set veth-target up

echo "Setup concluído! Use os próximos labs para praticar."
```

### Script de Limpeza
```bash
#!/bin/bash
# cleanup_lab.sh

echo "Limpando ambiente de laboratório..."

# Remover namespaces
sudo ip netns del lab-net 2>/dev/null
sudo ip netns del target-net 2>/dev/null

# Remover arquivos temporários
rm -f *.pcap *.log

echo "Limpeza concluída!"
```

---

## Próximos Passos

Agora que o ambiente está configurado, você pode prosseguir com os labs específicos:

1. **Lab 1**: Captura e Análise de Tráfego
2. **Lab 2**: Network Reconnaissance  
3. **Lab 3**: Análise de Protocolos
4. **Lab 4**: Detecção de Ataques
5. **Lab 5**: Análise Forense

Cada lab será um arquivo separado com exercícios práticos específicos.
