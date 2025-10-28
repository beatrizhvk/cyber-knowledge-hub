// Markdown Loader and Renderer
class MarkdownLoader {
    constructor() {
        this.contentCache = new Map();
        this.contentIndex = new Map();
        this.init();
    }
    
    async init() {
        await this.loadContentIndex();
    }
    
    async loadContentIndex() {
        // Define the content structure
        this.contentIndex = new Map([
            ['fundamentals', [
                { file: 'cia-triad.md', title: 'CIA Triad', tags: ['fundamentos', 'conceitos'] },
                { file: 'redes-basico.md', title: 'Fundamentos de Redes', tags: ['redes', 'protocolos', 'tcp-ip'] },
                { file: 'protocolos-web.md', title: 'Protocolos Web Essenciais', tags: ['http', 'https', 'web'] }
            ]],
            ['network-security', [
                { file: 'firewalls.md', title: 'Firewalls', tags: ['firewall', 'network'] },
                { file: 'network-analysis-lab.md', title: 'Setup do Lab de Análise de Rede', tags: ['setup', 'lab', 'configuração'] },
                { file: 'traffic-analysis-lab.md', title: 'Lab 1 - Captura e Análise de Tráfego', tags: ['tcpdump', 'wireshark', 'traffic-analysis'] },
                { file: 'reconnaissance-lab.md', title: 'Lab 2 - Network Reconnaissance', tags: ['nmap', 'reconnaissance', 'scanning'] }
            ]],
            ['penetration-testing', [
                { file: 'nmap.md', title: 'Nmap', tags: ['nmap', 'scanning'] }
            ]],
            ['incident-response', [
                { file: 'incident-handling.md', title: 'Tratamento de Incidentes', tags: ['incident-response', 'forensics'] }
            ]],
            ['tools', [
                { file: 'burp-suite.md', title: 'Burp Suite', tags: ['burp', 'proxy'] }
            ]],
            ['resources', []],
            ['glossary', [
                { file: 'index.md', title: 'Glossário de Segurança Cibernética', tags: ['glossário', 'terminologia'] }
            ]]
        ]);
    }
    
    async loadMarkdownFile(section, filename) {
        const cacheKey = `${section}/${filename}`;
        
        if (this.contentCache.has(cacheKey)) {
            return this.contentCache.get(cacheKey);
        }
        
        try {
            const response = await fetch(`content/${section}/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            
            const content = await response.text();
            const parsed = this.parseMarkdown(content);
            
            this.contentCache.set(cacheKey, parsed);
            return parsed;
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return null;
        }
    }
    
    parseMarkdown(content) {
        const lines = content.split('\n');
        let frontMatter = {};
        let markdownContent = '';
        let inFrontMatter = false;
        let frontMatterEnd = false;
        
        // Parse front matter
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line === '---' && !inFrontMatter) {
                inFrontMatter = true;
                continue;
            }
            
            if (line === '---' && inFrontMatter) {
                frontMatterEnd = true;
                markdownContent = lines.slice(i + 1).join('\n');
                break;
            }
            
            if (inFrontMatter && !frontMatterEnd) {
                const colonIndex = line.indexOf(':');
                if (colonIndex > 0) {
                    const key = line.substring(0, colonIndex).trim();
                    let value = line.substring(colonIndex + 1).trim();
                    
                    // Handle arrays
                    if (value.startsWith('[') && value.endsWith(']')) {
                        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
                    }
                    // Handle multiline strings
                    else if (value === '|') {
                        value = '';
                        i++;
                        while (i < lines.length && lines[i].startsWith('  ')) {
                            value += lines[i].substring(2) + '\n';
                            i++;
                        }
                        i--; // Adjust for the extra increment
                        value = value.trim();
                    }
                    
                    frontMatter[key] = value;
                }
            }
        }
        
        return {
            frontMatter,
            content: markdownContent,
            html: this.markdownToHtml(markdownContent)
        };
    }
    
    markdownToHtml(markdown) {
        let html = markdown;
        
        // First, protect code blocks by replacing them with placeholders
        const codeBlocks = [];
        let codeBlockIndex = 0;
        
        // Extract and protect code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'bash';
            const placeholder = `__CODE_BLOCK_${codeBlockIndex}__`;
            codeBlocks[codeBlockIndex] = {
                placeholder,
                html: `<div class="code-block">
                    <div class="code-header">
                        <span class="code-language">${language}</span>
                        <button class="copy-code" onclick="copyCode(this)">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <pre><code class="language-${language}">${this.escapeHtml(code.trim())}</code></pre>
                </div>`
            };
            codeBlockIndex++;
            return placeholder;
        });
        
        // Process tables BEFORE other markdown elements
        html = this.parseMarkdownTables(html);
        
        // Now process other markdown elements (headers, bold, etc.)
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold and italic
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Inline code (but not inside code blocks)
        html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        
        // Lists
        html = this.processLists(html);
        
        // Convert line breaks to paragraphs (but preserve code blocks and tables)
        html = this.processParagraphs(html);
        
        // Finally, restore code blocks
        codeBlocks.forEach(block => {
            html = html.replace(block.placeholder, block.html);
        });
        
        return html;
    }
    
    parseMarkdownTables(html) {
        // Match table patterns: header row, separator row, data rows
        const tableRegex = /^(\|.*\|)\s*\n(\|[\s\-\|:]*\|)\s*\n((?:\|.*\|\s*\n?)*)/gm;
        
        return html.replace(tableRegex, (match, headerRow, separatorRow, dataRows) => {
            // Parse header
            const headers = headerRow.split('|')
                .map(cell => cell.trim())
                .filter(cell => cell.length > 0);
            
            // Parse data rows
            const rows = dataRows.trim().split('\n')
                .map(row => row.split('|')
                    .map(cell => cell.trim())
                    .filter(cell => cell.length > 0))
                .filter(row => row.length > 0);
            
            if (headers.length === 0) return match;
            
            let tableHtml = '<div class="table-container"><table class="markdown-table">';
            
            // Headers
            tableHtml += '<thead><tr>';
            headers.forEach(header => {
                tableHtml += `<th>${header}</th>`;
            });
            tableHtml += '</tr></thead>';
            
            // Body
            if (rows.length > 0) {
                tableHtml += '<tbody>';
                rows.forEach(row => {
                    if (row.length > 0) {
                        tableHtml += '<tr>';
                        // Ensure we don't exceed header count
                        for (let i = 0; i < Math.max(headers.length, row.length); i++) {
                            const cellContent = row[i] || '';
                            tableHtml += `<td>${cellContent}</td>`;
                        }
                        tableHtml += '</tr>';
                    }
                });
                tableHtml += '</tbody>';
            }
            
            tableHtml += '</table></div>';
            
            return tableHtml;
        });
    }
    
    processLists(html) {
        const lines = html.split('\n');
        let result = [];
        let inList = false;
        let listType = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isUnorderedItem = /^\s*[-*+]\s+(.*)/.test(line);
            const isOrderedItem = /^\s*\d+\.\s+(.*)/.test(line);
            
            if (isUnorderedItem || isOrderedItem) {
                const content = line.replace(/^\s*[-*+\d.]\s+/, '');
                
                if (!inList) {
                    listType = isUnorderedItem ? 'ul' : 'ol';
                    result.push(`<${listType}>`);
                    inList = true;
                } else if ((isUnorderedItem && listType === 'ol') || (isOrderedItem && listType === 'ul')) {
                    result.push(`</${listType}>`);
                    listType = isUnorderedItem ? 'ul' : 'ol';
                    result.push(`<${listType}>`);
                }
                
                result.push(`<li>${content}</li>`);
            } else {
                if (inList && line.trim() === '') {
                    // Empty line in list - continue
                    continue;
                } else if (inList) {
                    // End of list
                    result.push(`</${listType}>`);
                    inList = false;
                    listType = '';
                }
                result.push(line);
            }
        }
        
        // Close list if still open
        if (inList) {
            result.push(`</${listType}>`);
        }
        
        return result.join('\n');
    }
    
    processParagraphs(html) {
        const lines = html.split('\n');
        let result = [];
        let currentParagraph = [];
        let inSpecialBlock = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check if we're entering/leaving special blocks
            if (line.includes('<div class="table-container">') || 
                line.includes('<ul>') || line.includes('<ol>') ||
                line.includes('__CODE_BLOCK_') ||
                line.startsWith('<h')) {
                inSpecialBlock = true;
            }
            
            if (line.includes('</div>') || 
                line.includes('</ul>') || line.includes('</ol>') ||
                line.includes('__CODE_BLOCK_') ||
                (line.startsWith('<h') && line.includes('</h'))) {
                inSpecialBlock = false;
            }
            
            if (inSpecialBlock || 
                line.startsWith('<') || 
                line.includes('__CODE_BLOCK_')) {
                // Finish current paragraph
                if (currentParagraph.length > 0) {
                    result.push(`<p>${currentParagraph.join('<br>')}</p>`);
                    currentParagraph = [];
                }
                result.push(line);
            } else if (line.trim() === '') {
                // Empty line - finish paragraph
                if (currentParagraph.length > 0) {
                    result.push(`<p>${currentParagraph.join('<br>')}</p>`);
                    currentParagraph = [];
                }
            } else {
                // Regular line - add to paragraph
                currentParagraph.push(line);
            }
        }
        
        // Finish last paragraph
        if (currentParagraph.length > 0) {
            result.push(`<p>${currentParagraph.join('<br>')}</p>`);
        }
        
        return result.join('\n');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    async renderSection(sectionId) {
        const sectionContent = document.getElementById(sectionId);
        if (!sectionContent) return;
        
        const files = this.contentIndex.get(sectionId) || [];
        
        if (files.length === 0) {
            sectionContent.innerHTML = this.getEmptyState(sectionId);
            return;
        }
        
        let html = `<div class="section-header">
            <h2><i class="section-icon"></i> ${this.getSectionTitle(sectionId)}</h2>
        </div>`;
        
        // Create content grid
        html += '<div class="content-grid">';
        
        for (const fileInfo of files) {
            const content = await this.loadMarkdownFile(sectionId, fileInfo.file);
            if (content) {
                html += this.createContentCard(content, fileInfo);
            }
        }
        
        html += '</div>';
        sectionContent.innerHTML = html;
    }
    
    createContentCard(content, fileInfo) {
        const { frontMatter, html } = content;
        const background = frontMatter.background || 'bg-[#334155]';
        
        return `
            <div class="content-card" style="background: ${background.replace('bg-[', '').replace(']', '')}">
                <div class="content-card-header">
                    <h3>${frontMatter.title || fileInfo.title}</h3>
                    <div class="content-tags">
                        ${(frontMatter.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="content-card-body">
                    <div class="content-intro">
                        ${frontMatter.intro || 'Clique para ver o conteúdo completo.'}
                    </div>
                    <button class="expand-content" onclick="expandContent(this, '${fileInfo.file}')">
                        <i class="fas fa-expand"></i> Ver Conteúdo Completo
                    </button>
                </div>
                <div class="content-full" style="display: none;">
                    ${html}
                </div>
            </div>
        `;
    }
    
    getSectionTitle(sectionId) {
        const titles = {
            'fundamentals': 'Fundamentos de Segurança',
            'network-security': 'Segurança de Rede',
            'penetration-testing': 'Penetration Testing',
            'incident-response': 'Resposta a Incidentes',
            'tools': 'Ferramentas',
            'resources': 'Recursos',
            'glossary': 'Glossário'
        };
        return titles[sectionId] || sectionId;
    }
    
    getEmptyState(sectionId) {
        return `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>Conteúdo em Desenvolvimento</h3>
                <p>Esta seção ainda não possui conteúdo. Contribua adicionando arquivos .md na pasta content/${sectionId}/</p>
                <a href="https://github.com/augusto-cesar-dsr/cyber-knowledge-hub/tree/main/content/${sectionId}" 
                   target="_blank" class="contribute-link">
                    <i class="fab fa-github"></i> Contribuir
                </a>
            </div>
        `;
    }
}

// Global functions
let markdownLoader;

document.addEventListener('DOMContentLoaded', () => {
    markdownLoader = new MarkdownLoader();
    window.markdownLoader = markdownLoader; // Make it globally accessible
});

function expandContent(button, filename) {
    const card = button.closest('.content-card');
    const intro = card.querySelector('.content-card-body');
    const fullContent = card.querySelector('.content-full');
    
    if (fullContent.style.display === 'none') {
        intro.style.display = 'none';
        fullContent.style.display = 'block';
        button.innerHTML = '<i class="fas fa-compress"></i> Ocultar Conteúdo';
    } else {
        intro.style.display = 'block';
        fullContent.style.display = 'none';
        button.innerHTML = '<i class="fas fa-expand"></i> Ver Conteúdo Completo';
    }
}

function copyCode(button) {
    const codeBlock = button.closest('.code-block').querySelector('code');
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.color = '#10b981';
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.color = '';
        }, 2000);
        
        if (window.showNotification) {
            showNotification('Código copiado!', 'success', 1500);
        }
    }).catch(err => {
        console.error('Erro ao copiar código:', err);
        if (window.showNotification) {
            showNotification('Erro ao copiar código', 'error');
        }
    });
}
