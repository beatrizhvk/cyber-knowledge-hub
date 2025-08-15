# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-08-15

### Adicionado
- **Interface responsiva** com tema escuro cyber security
- **Sistema de navegação** por seções organizadas
- **Sistema de arquivos Markdown** (.md) para conteúdo
- **Renderização dinâmica** de conteúdo markdown
- **Parser de markdown** robusto com suporte a:
  - Front matter YAML
  - Code blocks com syntax highlighting
  - Tabelas responsivas
  - Headers, listas, links, formatação
  - Proteção de code blocks durante parsing
- **Cards interativos** para visualização de conteúdo
- **Sistema de notificações** para feedback do usuário
- **Atalhos de teclado** para navegação rápida
- **Sistema de cache** para performance
- **Botão de copiar código** nos code blocks

### Estrutura de Conteúdo
- **Fundamentos**: CIA Triad completo
- **Network Security**: Guia de Firewalls
- **Penetration Testing**: Referência completa do Nmap
- **Incident Response**: Tratamento de incidentes
- **Tools**: Guia do Burp Suite
- **Resources**: Seção para recursos futuros

### Funcionalidades Técnicas
- **Carregamento assíncrono** de arquivos markdown
- **Parsing de front matter** YAML
- **Renderização HTML** segura
- **Sistema de tags** e categorização
- **Backgrounds personalizáveis** por card
- **Design mobile-first** responsivo
- **Acessibilidade** seguindo diretrizes WCAG

### Arquivos Principais
- `index.html` - Página principal
- `js/markdown-loader.js` - Sistema de carregamento de markdown
- `js/navigation.js` - Gerenciamento de navegação
- `js/components.js` - Componentes dinâmicos
- `js/main.js` - Controlador principal da aplicação
- `css/dark.css` - Tema escuro principal
- `css/markdown.css` - Estilos para conteúdo markdown
- `css/responsive.css` - Design responsivo
- `css/notifications.css` - Sistema de notificações

### Correções Implementadas
- **Headers em code blocks**: Proteção contra processamento incorreto
- **Tabelas markdown**: Parser robusto para formato `|---|---|---|`
- **Listas**: Processamento correto de listas ordenadas/não-ordenadas
- **Parágrafos**: Preservação de blocos especiais durante formatação

### Documentação
- README.md completo com instruções
- CONTRIBUTING.md com diretrizes de contribuição
- Estrutura de pastas documentada
- Exemplos de uso e configuração
