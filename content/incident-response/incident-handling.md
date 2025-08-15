---
title: Tratamento de Incidentes
date: 2024-08-15
background: bg-[#dc2626]
tags:
  - incident-response
  - forensics
  - security
categories:
  - Incident Response
intro: |
  O tratamento de incidentes de segurança é um processo estruturado para identificar, conter, erradicar e recuperar-se de eventos de segurança. Este guia apresenta as melhores práticas e procedimentos.
plugins:
  - copyCode
---

## Fases do Tratamento

### 1. Preparação

**Antes do Incidente:**
- Políticas e procedimentos definidos
- Equipe de resposta treinada
- Ferramentas e recursos disponíveis
- Planos de comunicação estabelecidos

### 2. Identificação e Análise

**Detectar e Classificar:**
- Monitoramento contínuo
- Análise de alertas
- Classificação de severidade
- Documentação inicial

### 3. Contenção

**Contenção Imediata:**
- Isolamento de sistemas afetados
- Preservação de evidências
- Prevenção de propagação

### 4. Erradicação

**Remoção da Ameaça:**
- Identificação da causa raiz
- Remoção de malware
- Correção de vulnerabilidades

### 5. Recuperação

**Restauração dos Serviços:**
- Restauração de sistemas
- Monitoramento intensivo
- Validação da segurança

### 6. Lições Aprendidas

**Melhoria Contínua:**
- Análise pós-incidente
- Atualização de procedimentos
- Treinamento adicional

## Classificação de Incidentes

### Níveis de Severidade

| Nível | Descrição | Tempo de Resposta | Exemplos |
|-------|-----------|-------------------|----------|
| **Crítico** | Impacto severo nos negócios | < 1 hora | Ransomware, vazamento de dados |
| **Alto** | Impacto significativo | < 4 horas | Comprometimento de servidor |
| **Médio** | Impacto moderado | < 24 horas | Malware isolado |
| **Baixo** | Impacto mínimo | < 72 horas | Tentativas de phishing |

## Ferramentas Essenciais

### Análise Forense

```bash
# Volatility - Análise de memória
volatility -f memory.dump --profile=Win7SP1x64 pslist
volatility -f memory.dump --profile=Win7SP1x64 netscan
volatility -f memory.dump --profile=Win7SP1x64 malfind

# Autopsy - Análise de disco
autopsy &

# Sleuth Kit - Ferramentas forenses
fls -r image.dd
icat image.dd 1234 > recovered_file.txt
```

### Coleta de Evidências

```bash
# dd - Criação de imagem forense
dd if=/dev/sda of=/mnt/evidence/disk_image.dd bs=4096 conv=noerror,sync
dd if=/dev/sda of=/mnt/evidence/disk_image.dd bs=4096 status=progress

# dcfldd - Versão melhorada do dd
dcfldd if=/dev/sda of=/mnt/evidence/disk_image.dd hash=md5,sha256 bs=4096

# Verificação de integridade
md5sum disk_image.dd > disk_image.md5
sha256sum disk_image.dd > disk_image.sha256
```

### Análise de Rede

```bash
# tcpdump - Captura de tráfego
tcpdump -i eth0 -w capture.pcap
tcpdump -r capture.pcap host 192.168.1.100

# Wireshark - Análise de protocolos
wireshark capture.pcap

# netstat - Conexões ativas
netstat -tuln
netstat -tupln | grep ESTABLISHED
```

## Procedimentos de Contenção

### Isolamento de Sistemas

```bash
# Desconectar da rede (preservando estado)
# Não desligue o sistema imediatamente!

# 1. Documentar conexões ativas
netstat -tupln > connections_$(date +%Y%m%d_%H%M%S).txt
ps aux > processes_$(date +%Y%m%d_%H%M%S).txt

# 2. Capturar memória (se possível)
# Linux
cat /proc/kcore > memory_dump_$(date +%Y%m%d_%H%M%S).raw
# Ou usar LiME (Linux Memory Extractor)

# 3. Isolar da rede
iptables -A INPUT -j DROP
iptables -A OUTPUT -j DROP
# Ou desconectar cabo de rede
```

### Preservação de Evidências

```bash
# Criar timeline do sistema
find / -type f -printf "%T@ %Tc %p\n" 2>/dev/null | sort -n > timeline.txt

# Coletar logs importantes
cp /var/log/auth.log evidence/
cp /var/log/syslog evidence/
cp /var/log/apache2/access.log evidence/

# Coletar informações do sistema
uname -a > system_info.txt
df -h > disk_usage.txt
mount > mount_points.txt
```

## Análise de Malware

### Análise Estática

```bash
# Informações básicas do arquivo
file malware.exe
strings malware.exe | grep -i "http\|ftp\|\.exe\|\.dll"
hexdump -C malware.exe | head -20

# Hashes
md5sum malware.exe
sha1sum malware.exe
sha256sum malware.exe

# VirusTotal API
curl -X POST 'https://www.virustotal.com/vtapi/v2/file/scan' \
  --form 'apikey=YOUR_API_KEY' \
  --form 'file=@malware.exe'
```

### Análise Dinâmica

```bash
# Sandbox analysis (em ambiente isolado)
# Monitorar comportamento do malware

# Process Monitor
# Wireshark para tráfego de rede
# Regshot para mudanças no registro (Windows)

# Análise de rede
tcpdump -i any -w malware_traffic.pcap &
# Executar malware
# Parar captura após análise
```

## Documentação de Incidentes

### Template de Relatório

```markdown
# Relatório de Incidente - [ID]

## Informações Gerais
- **Data/Hora:** 
- **Analista:** 
- **Severidade:** 
- **Status:** 

## Resumo Executivo
Breve descrição do incidente e impacto.

## Timeline
| Hora | Evento | Ação Tomada |
|------|--------|-------------|
| 10:00 | Alerta detectado | Investigação iniciada |
| 10:15 | Confirmação de compromisso | Contenção iniciada |

## Análise Técnica
### Vetor de Ataque
### Sistemas Afetados
### Evidências Coletadas

## Ações de Resposta
### Contenção
### Erradicação
### Recuperação

## Lições Aprendidas
### O que funcionou bem
### O que pode ser melhorado
### Recomendações

## Anexos
- Logs relevantes
- Screenshots
- Evidências forenses
```

## Comunicação Durante Incidentes

### Stakeholders

**Comunicação Interna:**
- Equipe de TI
- Gerência
- Jurídico
- RH (se necessário)

**Comunicação Externa:**
- Clientes (se aplicável)
- Autoridades (se requerido)
- Fornecedores
- Mídia (se necessário)

### Templates de Comunicação

```text
# Template - Notificação Inicial
Assunto: [URGENTE] Incidente de Segurança - [ID]

Detectamos um incidente de segurança em [sistema/serviço].
Status: Em investigação
Impacto: [Descrever impacto]
Próxima atualização: [Tempo]

Equipe de Resposta a Incidentes
```

## Ferramentas de Automação

### Scripts de Resposta

```bash
#!/bin/bash
# incident_response.sh - Script de resposta rápida

echo "=== Incident Response Script ==="
echo "Timestamp: $(date)"

# Coletar informações básicas
echo "=== System Information ===" > incident_report.txt
uname -a >> incident_report.txt
uptime >> incident_report.txt

# Processos suspeitos
echo "=== Running Processes ===" >> incident_report.txt
ps aux --sort=-%cpu | head -20 >> incident_report.txt

# Conexões de rede
echo "=== Network Connections ===" >> incident_report.txt
netstat -tupln >> incident_report.txt

# Logs recentes
echo "=== Recent Auth Logs ===" >> incident_report.txt
tail -100 /var/log/auth.log >> incident_report.txt

echo "Report saved to incident_report.txt"
```

### SOAR Integration

```python
# Exemplo de integração com SOAR
import requests
import json

def create_incident(title, description, severity):
    payload = {
        "title": title,
        "description": description,
        "severity": severity,
        "status": "open"
    }
    
    response = requests.post(
        "https://soar-platform.com/api/incidents",
        headers={"Authorization": "Bearer TOKEN"},
        json=payload
    )
    
    return response.json()

# Criar incidente automaticamente
incident = create_incident(
    "Malware Detection",
    "Suspicious process detected on server",
    "high"
)
```

## Métricas e KPIs

### Indicadores Importantes

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **MTTD** | Mean Time to Detection | < 24 horas |
| **MTTR** | Mean Time to Response | < 1 hora |
| **MTTC** | Mean Time to Containment | < 4 horas |
| **MTTR** | Mean Time to Recovery | < 24 horas |

## Melhores Práticas

### Preparação
1. **Playbooks atualizados** - Procedimentos documentados
2. **Treinamento regular** - Simulações e exercícios
3. **Ferramentas prontas** - Ambiente de análise preparado
4. **Comunicação clara** - Canais definidos

### Durante o Incidente
1. **Documentar tudo** - Cada ação e descoberta
2. **Preservar evidências** - Não contaminar provas
3. **Comunicar regularmente** - Manter stakeholders informados
4. **Seguir procedimentos** - Não improvisar

### Pós-Incidente
1. **Análise completa** - Entender o que aconteceu
2. **Melhorar processos** - Atualizar procedimentos
3. **Compartilhar conhecimento** - Treinar equipe
4. **Implementar controles** - Prevenir recorrência

## Referências

- [NIST Computer Security Incident Handling Guide](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final)
- [SANS Incident Response Process](https://www.sans.org/white-papers/1901/)
- [ENISA Good Practice Guide](https://www.enisa.europa.eu/publications/good-practice-guide-for-incident-management)
- [ISO/IEC 27035 - Incident Management](https://www.iso.org/standard/44379.html)
