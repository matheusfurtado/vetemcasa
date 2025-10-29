/**
 * admin.js - Controller para a página admin.html
 * Responsável pela lógica do painel administrativo
 */

// Elementos do DOM
let alertContainer;
let noDataMessage;
let tableContainer;
let tableBody;
let exportJsonBtn;
let jsonExportArea;
let jsonOutput;

/**
 * Inicializa a página quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o storage
    initStorage();
    
    // Obtém referências dos elementos
    alertContainer = document.getElementById('alertContainer');
    noDataMessage = document.getElementById('noDataMessage');
    tableContainer = document.getElementById('tableContainer');
    tableBody = document.getElementById('solicitacoesTableBody');
    exportJsonBtn = document.getElementById('exportJsonBtn');
    jsonExportArea = document.getElementById('jsonExportArea');
    jsonOutput = document.getElementById('jsonOutput');
    
    // Registra listeners
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', handleExportJson);
    }
    
    // Carrega e renderiza as solicitações
    renderSolicitacoes();
});

/**
 * Carrega todas as solicitações e renderiza a tabela
 */
function renderSolicitacoes() {
    const solicitacoes = getAllSolicitacoes();
    
    if (solicitacoes.length === 0) {
        // Mostra mensagem de "sem dados"
        noDataMessage.style.display = 'block';
        tableContainer.style.display = 'none';
    } else {
        // Mostra tabela
        noDataMessage.style.display = 'none';
        tableContainer.style.display = 'block';
        
        // Renderiza as linhas da tabela
        renderTableRows(solicitacoes);
    }
}

/**
 * Renderiza as linhas da tabela com as solicitações
 * @param {Array} solicitacoes - Array de solicitações
 */
function renderTableRows(solicitacoes) {
    // Ordena por ID decrescente (mais recentes primeiro)
    const solicitacoesOrdenadas = solicitacoes.sort((a, b) => b.id - a.id);
    
    tableBody.innerHTML = '';
    
    solicitacoesOrdenadas.forEach(solicitacao => {
        const row = createTableRow(solicitacao);
        tableBody.appendChild(row);
    });
}

/**
 * Cria uma linha da tabela para uma solicitação
 * @param {Object} solicitacao - Objeto da solicitação
 * @returns {HTMLElement} Elemento tr da tabela
 */
function createTableRow(solicitacao) {
    const tr = document.createElement('tr');
    
    // Formata a data de criação
    const dataCriacao = new Date(solicitacao.criadoEm);
    const dataFormatada = dataCriacao.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Cria badge do status
    const statusBadge = createStatusBadge(solicitacao.status);
    
    // Cria link do WhatsApp
    const telefoneLink = createWhatsAppLink(solicitacao.telefone);
    
    // Formata informações do pet
    const petInfo = formatPetInfo(solicitacao);
    
    tr.innerHTML = `
        <td>
            <strong>#${solicitacao.id}</strong><br>
            <small class="text-muted">${dataFormatada}</small>
        </td>
        <td>${statusBadge}</td>
        <td>
            <strong>${solicitacao.nomeTutor}</strong><br>
            ${telefoneLink}
        </td>
        <td>
            <small>${solicitacao.endereco}</small>
        </td>
        <td>${petInfo}</td>
        <td>
            <strong>${solicitacao.dataDesejada}</strong>
        </td>
        <td>
            <div class="motivo-cell" title="${solicitacao.motivo}">
                ${truncateText(solicitacao.motivo, 50)}
            </div>
        </td>
        <td>
            ${createActionForm(solicitacao)}
        </td>
    `;
    
    return tr;
}

/**
 * Cria um badge colorido para o status
 * @param {string} status - Status da solicitação
 * @returns {string} HTML do badge
 */
function createStatusBadge(status) {
    const statusConfig = {
        'pendente': { class: 'bg-secondary', text: 'Pendente' },
        'confirmado': { class: 'bg-primary', text: 'Confirmado' },
        'atendido': { class: 'bg-success', text: 'Atendido' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary', text: status };
    return `<span class="badge ${config.class}">${config.text}</span>`;
}

/**
 * Cria link do WhatsApp para o telefone
 * @param {string} telefone - Número de telefone
 * @returns {string} HTML do link
 */
function createWhatsAppLink(telefone) {
    const telefoneNumeros = sanitizeTelefone(telefone);
    const whatsappUrl = `https://wa.me/${telefoneNumeros}`;
    
    return `
        <a href="${whatsappUrl}" target="_blank" class="btn btn-success btn-sm">
            <small>📱 WhatsApp</small>
        </a><br>
        <small class="text-muted">${telefone}</small>
    `;
}

/**
 * Formata as informações do pet
 * @param {Object} solicitacao - Objeto da solicitação
 * @returns {string} HTML com info do pet
 */
function formatPetInfo(solicitacao) {
    const idade = solicitacao.idadeAnos ? `, ${solicitacao.idadeAnos} anos` : '';
    const especieCapitalizada = solicitacao.especie.charAt(0).toUpperCase() + solicitacao.especie.slice(1);
    
    return `
        <strong>${solicitacao.nomePet}</strong><br>
        <small class="text-muted">${especieCapitalizada}${idade}</small>
    `;
}

/**
 * Cria o formulário de ação (select + botão)
 * @param {Object} solicitacao - Objeto da solicitação
 * @returns {string} HTML do formulário
 */
function createActionForm(solicitacao) {
    return `
        <form class="d-flex gap-1" onsubmit="handleStatusUpdate(event, ${solicitacao.id})">
            <select class="form-select form-select-sm" name="novoStatus" required>
                <option value="pendente" ${solicitacao.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                <option value="confirmado" ${solicitacao.status === 'confirmado' ? 'selected' : ''}>Confirmado</option>
                <option value="atendido" ${solicitacao.status === 'atendido' ? 'selected' : ''}>Atendido</option>
            </select>
            <button type="submit" class="btn btn-outline-success btn-sm">
                Salvar
            </button>
        </form>
    `;
}

/**
 * Trunca texto se for muito longo
 * @param {string} text - Texto original
 * @param {number} maxLength - Comprimento máximo
 * @returns {string} Texto truncado
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
}

/**
 * Manipula a atualização de status
 * @param {Event} event - Evento de submit
 * @param {number} id - ID da solicitação
 */
function handleStatusUpdate(event, id) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const novoStatus = formData.get('novoStatus');
    
    try {
        const solicitacaoAtualizada = updateStatus(id, novoStatus);
        
        if (solicitacaoAtualizada) {
            // Atualiza a tabela
            renderSolicitacoes();
            
            // Mostra mensagem de sucesso
            showAlert('success', `✅ Solicitação #${id} atualizada para "${novoStatus}".`);
            
            // Scroll para o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showAlert('danger', `❌ Erro: Solicitação #${id} não encontrada.`);
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        showAlert('danger', '❌ Erro interno ao atualizar status. Tente novamente.');
    }
}

/**
 * Manipula a exportação de JSON
 */
function handleExportJson() {
    try {
        const jsonData = exportJSON();
        jsonOutput.value = jsonData;
        
        // Mostra a área de exportação
        jsonExportArea.style.display = 'block';
        
        // Scroll para a área de exportação
        jsonExportArea.scrollIntoView({ behavior: 'smooth' });
        
        showAlert('info', '📄 Dados exportados com sucesso! Role para baixo para ver o JSON.');
        
    } catch (error) {
        console.error('Erro ao exportar JSON:', error);
        showAlert('danger', '❌ Erro ao exportar dados.');
    }
}

/**
 * Exibe um alerta na tela
 * @param {string} type - Tipo do alerta ('success', 'danger', 'warning', 'info')
 * @param {string} message - Mensagem a ser exibida
 */
function showAlert(type, message) {
    // Remove alertas anteriores
    alertContainer.innerHTML = '';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // Auto-remove após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Torna a função global para ser chamada pelos formulários inline
window.handleStatusUpdate = handleStatusUpdate;
