---
title: Criptografia e Hashing - O Escudo da Confidencialidade e Integridade
date: 2025-10-31
background: '#2563eb'
tags:
  - criptografia
  - hashing
  - aes
  - rsa
  - pki
  - confidencialidade
categories:
  - Fundamentos
  - Seguranca
intro: Entenda como a Criptografia (Simétrica e Assimétrica) garante o sigilo dos seus dados e como o Hashing protege a integridade e a autenticidade.
plugins:
  - copyCode
---

# Criptografia e Hashing: O Escudo da Confidencialidade e Integridade 🔒

## Introdução

<p>A segurança de dados repousa em bases matemáticas. A Criptografia e o Hashing são as ferramentas primárias utilizadas para proteger dois pilares da Tríade CIA: a Confidencialidade (sigilo) e a Integridade (autenticidade). Adotar e implementar corretamente esses mecanismos é fundamental para qualquer postura defensiva.</p>

### O que é Criptografia?

<p>Criptografia é o processo de transformar dados legíveis (texto claro) em dados ilegíveis (texto cifrado) usando uma chave. O objetivo é garantir que apenas a pessoa que possui a chave correta possa ler a informação.</p>

### O que é Hashing?

<p>Hashing é uma função matemática unidirecional (não pode ser revertida) que cria uma string de tamanho fixo (hash) a partir de qualquer dado. Sua função principal é provar que o dado não foi alterado (integridade).</p>

> A Criptografia protege contra a leitura não autorizada. O Hashing protege contra a alteração não autorizada.

---

## Ciclo de Vida da Proteção Criptográfica

<p>A proteção de dados é implementada em duas abordagens distintas, dependendo da necessidade de velocidade e do volume de dados.</p>

### 1. Criptografia Simétrica (Chave Única)

<p>É o método mais rápido, ideal para cifrar grandes volumes de dados (dados em repouso ou grandes transferências). A mesma chave secreta é usada para cifrar e decifrar.</p>

* **Algoritmos Comuns:** **AES (Advanced Encryption Standard)**, utilizado globalmente em VPNs e criptografia de disco.
* **Desafio:** O ponto fraco é a **Distribuição da Chave**. As partes precisam combinar a chave secretamente antes de se comunicar, o que é um risco de interceptação.

### 2. Criptografia Assimétrica (Par de Chaves)

<p>Utiliza um par de chaves: uma Pública (compartilhada) e uma Privada (secreta). Resolve o problema da distribuição da chave secreta.</p>

| Chave | Uso Principal | Objetivo |
| :---: | :---: | :---: |
| **Pública** | Cifrar a mensagem | Garantir que só o dono da chave privada possa ler. |
| **Privada** | Decifrar / Assinar | Provar a identidade e decifrar mensagens. |

* **Algoritmos Comuns:** **RSA** e **ECC (Elliptic Curve Cryptography)**.
* **Aplicações:** É a base do **TLS/SSL** e da **PKI (Public Key Infrastructure)**, utilizados para validar a identidade de *websites* e sistemas.

### 3. O Handshake Híbrido (Exemplo TLS)

<p>A segurança moderna combina os dois métodos:</p>
<p>1. A Criptografia Assimétrica é usada no início para trocar de forma segura uma Chave de Sessão Simétrica.</p>
<p>2. A Criptografia Simétrica assume a comunicação em massa, usando a chave trocada, aproveitando sua alta velocidade.</p>

---

## Hashing e a Proteção de Credenciais

<p>O Hashing é essencial para a integridade de arquivos e, principalmente, para o armazenamento seguro de senhas.</p>

### 4. Proteção de Senhas com Salt

<p>Senhas nunca devem ser armazenadas em texto claro. Apenas o hash da senha é armazenado. Para evitar ataques de dicionário (Rainbow Tables), é crucial o uso do Salt.</p>

* **O que é Salt?** É uma *string* aleatória, única para cada usuário, que é adicionada à senha antes do *hash*.
* **Por que Usar?** Ele impede ataques de **Rainbow Tables**, garantindo que *hashes* sejam únicos, mesmo para senhas idênticas.

### 5. Algoritmos de Hashing

<p>Os algoritmos de hash devem ser resistentes à colisão (impossível gerar o mesmo output a partir de inputs diferentes).</p>

| Algoritmo | Status | Uso Recomendado |
| :---: | :---: | :---: |
| **SHA-256 / SHA-3** | **Forte** | Padrão da indústria para senhas e verificação de arquivos. |
| **MD5 / SHA-1** | **Quebrado** | Evitar o uso em ambientes de segurança, pois são suscetíveis a colisões. |

---

## Conclusão

<p>Criptografia e Hashing são ferramentas essenciais que, quando implementadas corretamente, garantem o sigilo e a autenticidade dos dados. Dominar o uso do método correto para cada situação é a base para uma defesa eficaz.</p>

---
