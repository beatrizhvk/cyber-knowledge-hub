---
title: CIA Triad
date: 2024-08-15
background: bg-[#1e293b]
tags:
  - fundamentos
  - conceitos
  - segurança
categories:
  - Fundamentos
intro: |
  A Tríade CIA (Confidencialidade, Integridade e Disponibilidade) é o modelo fundamental da segurança da informação que define os três pilares essenciais para proteger dados e sistemas.
plugins:
  - copyCode
---

## Conceitos Fundamentais

### Confidencialidade

A **Confidencialidade** garante que as informações sejam acessíveis apenas por pessoas autorizadas.

```bash
# Exemplo: Criptografia de arquivo
gpg --symmetric --cipher-algo AES256 arquivo.txt
```

**Principais técnicas:**
- Criptografia
- Controle de acesso
- Autenticação
- Autorização

### Integridade

A **Integridade** assegura que os dados não foram alterados de forma não autorizada.

```bash
# Exemplo: Verificação de hash
sha256sum arquivo.txt > arquivo.txt.sha256
sha256sum -c arquivo.txt.sha256
```

**Principais técnicas:**
- Hashing (SHA-256, MD5)
- Assinaturas digitais
- Checksums
- Controle de versão

### Disponibilidade

A **Disponibilidade** garante que os sistemas e dados estejam acessíveis quando necessário.

```bash
# Exemplo: Monitoramento de serviço
systemctl status nginx
ping -c 4 servidor.com
```

**Principais técnicas:**
- Redundância
- Backup
- Balanceamento de carga
- Monitoramento

## Implementação Prática

### Confidencialidade na Prática

| Técnica | Descrição | Exemplo |
|---------|-----------|---------|
| **Criptografia Simétrica** | Mesma chave para criptografar e descriptografar | AES-256 |
| **Criptografia Assimétrica** | Par de chaves pública/privada | RSA, ECC |
| **Controle de Acesso** | Permissões baseadas em usuário/grupo | chmod, ACL |
| **VPN** | Túnel criptografado para comunicação | OpenVPN, WireGuard |

### Integridade na Prática

| Técnica | Descrição | Comando |
|---------|-----------|---------|
| **SHA-256** | Hash criptográfico seguro | `sha256sum arquivo.txt` |
| **Assinatura Digital** | Verificação de autenticidade | `gpg --sign arquivo.txt` |
| **HMAC** | Hash com chave secreta | `openssl dgst -sha256 -hmac "chave"` |
| **Controle de Versão** | Rastreamento de mudanças | `git log --oneline` |

### Disponibilidade na Prática

| Técnica | Descrição | Implementação |
|---------|-----------|---------------|
| **Backup** | Cópia de segurança dos dados | `rsync -av /dados/ /backup/` |
| **Clustering** | Múltiplos servidores | HAProxy, Nginx |
| **Monitoramento** | Verificação contínua | Nagios, Zabbix |
| **Recuperação** | Plano de contingência | RTO, RPO |

## Ameaças Comuns

### Contra Confidencialidade
- **Interceptação**: Escuta de comunicações
- **Acesso não autorizado**: Invasão de sistemas
- **Vazamento de dados**: Exposição acidental
- **Engenharia social**: Manipulação humana

### Contra Integridade
- **Modificação maliciosa**: Alteração de dados
- **Corrupção**: Falha de hardware/software
- **Injeção**: SQL injection, XSS
- **Man-in-the-middle**: Interceptação e modificação

### Contra Disponibilidade
- **DDoS**: Ataques de negação de serviço
- **Ransomware**: Sequestro de dados
- **Falhas de hardware**: Quebra de equipamentos
- **Desastres naturais**: Incêndios, enchentes

## Ferramentas Essenciais

### Confidencialidade

```bash
# OpenSSL - Criptografia
openssl enc -aes-256-cbc -salt -in arquivo.txt -out arquivo.enc

# GnuPG - Criptografia de chave pública
gpg --gen-key
gpg --encrypt --recipient usuario@email.com arquivo.txt

# SSH - Acesso seguro
ssh-keygen -t rsa -b 4096
ssh user@servidor.com
```

### Integridade

```bash
# Verificação de integridade
md5sum arquivo.txt
sha1sum arquivo.txt
sha256sum arquivo.txt

# Assinatura digital
gpg --detach-sign arquivo.txt
gpg --verify arquivo.txt.sig arquivo.txt

# AIDE - Detecção de intrusão
aide --init
aide --check
```

### Disponibilidade

```bash
# Monitoramento de sistema
uptime
df -h
free -m
iostat

# Backup automatizado
tar -czf backup-$(date +%Y%m%d).tar.gz /dados/
rsync -av --delete /dados/ backup@servidor:/backup/

# Teste de conectividade
ping -c 4 8.8.8.8
nmap -p 80,443 servidor.com
```

## Melhores Práticas

### Princípios Gerais
1. **Defesa em profundidade**: Múltiplas camadas de segurança
2. **Menor privilégio**: Acesso mínimo necessário
3. **Segregação de funções**: Separação de responsabilidades
4. **Auditoria contínua**: Monitoramento e logs

### Implementação
- Políticas de segurança claras
- Treinamento regular da equipe
- Testes de segurança periódicos
- Planos de resposta a incidentes

## Referências

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [ISO 27001](https://www.iso.org/isoiec-27001-information-security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SANS Security Fundamentals](https://www.sans.org/)
