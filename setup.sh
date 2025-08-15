#!/bin/bash

# Cyber Knowledge Hub - Setup Script
# Este script configura o ambiente de desenvolvimento

echo "🛡️  Cyber Knowledge Hub - Setup"
echo "================================"

# Verificar se estamos no diretório correto
if [ ! -f "index.html" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto"
    exit 1
fi

echo "✅ Verificando estrutura do projeto..."

# Criar diretórios se não existirem
mkdir -p content/{fundamentals,network-security,penetration-testing,incident-response,tools,resources}
mkdir -p docs
mkdir -p assets/{icons,images}

echo "✅ Estrutura de diretórios criada"

# Verificar dependências
echo "🔍 Verificando dependências..."

# Verificar Python
if command -v python3 &> /dev/null; then
    echo "✅ Python3 encontrado: $(python3 --version)"
else
    echo "⚠️  Python3 não encontrado. Instale Python3 para usar o servidor de desenvolvimento"
fi

# Verificar Node.js (opcional)
if command -v node &> /dev/null; then
    echo "✅ Node.js encontrado: $(node --version)"
    
    # Verificar se http-server está instalado
    if command -v http-server &> /dev/null; then
        echo "✅ http-server encontrado"
    else
        echo "📦 Instalando http-server..."
        npm install -g http-server
    fi
else
    echo "ℹ️  Node.js não encontrado (opcional)"
fi

# Verificar Git
if command -v git &> /dev/null; then
    echo "✅ Git encontrado: $(git --version)"
    
    # Inicializar repositório se não existir
    if [ ! -d ".git" ]; then
        echo "📦 Inicializando repositório Git..."
        git init
        git add .
        git commit -m "Initial commit: Cyber Knowledge Hub barebone"
    fi
else
    echo "⚠️  Git não encontrado. Instale Git para controle de versão"
fi

echo ""
echo "🚀 Setup concluído!"
echo ""
echo "Para iniciar o servidor de desenvolvimento:"
echo "  Python: python3 -m http.server 8000"
echo "  Node:   npx http-server -p 8000"
echo "  NPM:    npm start"
echo ""
echo "Acesse: http://localhost:8000"
echo ""
echo "📚 Próximos passos:"
echo "  1. Personalize o conteúdo em index.html"
echo "  2. Adicione conteúdo na pasta content/"
echo "  3. Customize os temas em css/"
echo "  4. Leia CONTRIBUTING.md para contribuir"
echo ""
echo "🤝 Para contribuir:"
echo "  - Fork o repositório"
echo "  - Crie uma branch para sua feature"
echo "  - Faça suas mudanças"
echo "  - Abra um Pull Request"
echo ""
echo "Construído com ❤️  pela comunidade de cybersecurity"
