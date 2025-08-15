# Guia de Contribuição 🤝

Obrigado por considerar contribuir para o Cyber Knowledge Hub! Este documento fornece diretrizes e informações para ajudar você a contribuir de forma efetiva.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Tipos de Contribuição](#tipos-de-contribuição)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Padrões de Conteúdo](#padrões-de-conteúdo)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Melhorias](#sugerir-melhorias)

## 📜 Código de Conduta

Este projeto adere a um código de conduta. Ao participar, você deve manter um ambiente respeitoso e inclusivo para todos.

### Comportamentos Esperados:
- Usar linguagem acolhedora e inclusiva
- Respeitar diferentes pontos de vista e experiências
- Aceitar críticas construtivas graciosamente
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros da comunidade

## 🚀 Como Contribuir

### 1. Fork e Clone
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/augusto-cesar-dsr/cyber-knowledge-hub.git
cd cyber-knowledge-hub
```

### 2. Configurar Ambiente
```bash
# Instalar dependências (se houver)
# Atualmente o projeto usa apenas HTML/CSS/JS vanilla

# Executar servidor local para desenvolvimento
python3 -m http.server 8000
# ou
npx http-server
```

### 3. Criar Branch
```bash
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
# ou
git checkout -b content/nome-do-conteudo
```

### 4. Fazer Mudanças
- Implemente suas mudanças
- Teste localmente
- Siga os padrões estabelecidos

### 5. Commit e Push
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
git push origin feature/nome-da-feature
```

### 6. Pull Request
- Abra um PR no GitHub
- Descreva suas mudanças claramente
- Referencie issues relacionadas

## 🎯 Tipos de Contribuição

### 1. 📝 Conteúdo
- **Artigos técnicos**: Tutoriais, guias, explicações
- **Exemplos práticos**: Código, configurações, scripts
- **Traduções**: Traduzir conteúdo existente
- **Revisões**: Melhorar conteúdo existente

#### Estrutura de Conteúdo:
```
content/
├── fundamentals/
│   ├── cia-triad.md
│   ├── threat-modeling.md
│   └── cryptography-basics.md
├── network-security/
├── penetration-testing/
├── incident-response/
├── tools/
└── resources/
```

### 2. 💻 Código
- **Frontend**: Melhorias na interface
- **Funcionalidades**: Novas features
- **Performance**: Otimizações
- **Acessibilidade**: Melhorias de a11y
- **Responsividade**: Mobile-first improvements

### 3. 🎨 Design
- **UI/UX**: Melhorias visuais
- **Ícones**: Novos ícones e assets
- **Temas**: Customizações do tema escuro
- **Animações**: Micro-interações

### 4. 📚 Documentação
- **README**: Melhorias na documentação
- **Comentários**: Documentação do código
- **Tutoriais**: Guias de uso
- **API Docs**: Documentação técnica

## 🔧 Processo de Desenvolvimento

### Estrutura do Projeto
```
cyber-knowledge-hub/
├── index.html              # Página principal
├── css/                    # Estilos
│   ├── dark.css           # Tema escuro
│   ├── responsive.css     # Responsividade
│   └── notifications.css  # Sistema de notificações
├── js/                     # JavaScript
│   ├── main.js            # Controlador principal
│   ├── navigation.js      # Navegação
│   └── components.js      # Componentes dinâmicos
├── assets/                 # Assets estáticos
│   ├── icons/             # Ícones
│   └── images/            # Imagens
├── content/               # Conteúdo (futuro)
└── docs/                  # Documentação
```

### Fluxo de Trabalho
1. **Issue First**: Crie ou comente em uma issue antes de começar
2. **Branch**: Use branches descritivas
3. **Commits**: Commits pequenos e descritivos
4. **Tests**: Teste suas mudanças localmente
5. **PR**: Pull request com descrição clara

## 📏 Padrões de Código

### HTML
- Use HTML5 semântico
- Mantenha acessibilidade (ARIA labels, alt texts)
- Indentação: 4 espaços
- Use classes descritivas

### CSS
- Use CSS Variables para temas
- Mobile-first approach
- BEM methodology para classes
- Organize por componentes

```css
/* Exemplo de estrutura */
.component-name {
    /* Layout properties */
    display: flex;
    
    /* Visual properties */
    background: var(--card-bg);
    border-radius: 8px;
    
    /* Typography */
    font-size: 16px;
    
    /* Transitions */
    transition: all 0.3s ease;
}

.component-name__element {
    /* Element styles */
}

.component-name--modifier {
    /* Modifier styles */
}
```

### JavaScript
- Use ES6+ features
- Modular architecture
- Comentários JSDoc
- Error handling

```javascript
/**
 * Descrição da função
 * @param {string} param - Descrição do parâmetro
 * @returns {boolean} Descrição do retorno
 */
function exemploFuncao(param) {
    try {
        // Implementação
        return true;
    } catch (error) {
        console.error('Erro:', error);
        return false;
    }
}
```

## 📖 Padrões de Conteúdo

### Estrutura de Artigos
```markdown
# Título do Artigo

## Introdução
Breve introdução ao tópico.

## Pré-requisitos
- Conhecimento necessário
- Ferramentas requeridas

## Conteúdo Principal
### Subtópico 1
Explicação detalhada.

### Subtópico 2
Mais conteúdo.

## Exemplos Práticos
```bash
# Comandos de exemplo
comando --opcao
```

## Conclusão
Resumo e próximos passos.

## Referências
- [Link 1](url)
- [Link 2](url)
```

### Diretrizes de Escrita
- **Clareza**: Linguagem simples e direta
- **Precisão**: Informações técnicas corretas
- **Exemplos**: Sempre incluir exemplos práticos
- **Atualização**: Manter conteúdo atualizado
- **Fontes**: Citar referências confiáveis

### Formatação
- Use markdown padrão
- Código em blocos apropriados
- Imagens com alt text
- Links descritivos

## 🐛 Reportar Bugs

### Template de Bug Report
```markdown
**Descrição do Bug**
Descrição clara e concisa do bug.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '....'
3. Role para baixo até '....'
4. Veja o erro

**Comportamento Esperado**
Descrição do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Informações do Sistema:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]

**Contexto Adicional**
Qualquer outra informação relevante.
```

## 💡 Sugerir Melhorias

### Template de Feature Request
```markdown
**A sua solicitação está relacionada a um problema?**
Descrição clara do problema.

**Descreva a solução que você gostaria**
Descrição clara da solução desejada.

**Descreva alternativas consideradas**
Outras soluções ou features consideradas.

**Contexto Adicional**
Screenshots, mockups, ou contexto adicional.
```

## 🏷️ Convenções de Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação, ponto e vírgula, etc
- `refactor:` Refatoração de código
- `test:` Adição de testes
- `chore:` Manutenção

Exemplos:
```
feat: adiciona sistema de busca
fix: corrige navegação mobile
docs: atualiza README com instruções
style: melhora formatação do CSS
```

## 🎉 Reconhecimento

Todos os contribuidores serão reconhecidos:
- Lista de contribuidores no README
- Seção de colaboradores no site
- Créditos em releases

## 📞 Dúvidas?

- Abra uma [issue](https://github.com/augusto-cesar-dsr/cyber-knowledge-hub/issues)
- Use [GitHub Discussions](https://github.com/augusto-cesar-dsr/cyber-knowledge-hub/discussions)
- Entre em contato via email (se disponível)

---

**Obrigado por contribuir! 🙏**
