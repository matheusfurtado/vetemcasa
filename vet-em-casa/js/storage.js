/**
 * storage.js - Camada Model do padrão MVC
 * Responsável por gerenciar os dados no localStorage (simula banco de dados)
 */

// Chave para armazenar dados no localStorage
const STORAGE_KEY = 'vetemcasa_solicitacoes';

/**
 * Inicializa o storage garantindo que a chave existe
 */
function initStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
}

/**
 * Retorna todas as solicitações armazenadas
 * @returns {Array} Array de objetos representando as solicitações
 */
function getAllSolicitacoes() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return JSON.parse(data) || [];
    } catch (error) {
        console.error('Erro ao carregar solicitações:', error);
        return [];
    }
}

/**
 * Gera o próximo ID sequencial para uma nova solicitação
 * @returns {number} Próximo ID disponível
 */
function getNextId() {
    const solicitacoes = getAllSolicitacoes();
    if (solicitacoes.length === 0) {
        return 1;
    }
    const maxId = Math.max(...solicitacoes.map(s => s.id));
    return maxId + 1;
}

/**
 * Cria uma nova solicitação
 * @param {Object} data - Dados da solicitação vindos do formulário
 * @returns {Object} Objeto da solicitação criada
 */
function createSolicitacao(data) {
    try {
        const solicitacoes = getAllSolicitacoes();
        
        const novaSolicitacao = {
            id: getNextId(),
            nomeTutor: data.nomeTutor,
            telefone: data.telefone,
            endereco: data.endereco,
            nomePet: data.nomePet,
            especie: data.especie,
            idadeAnos: data.idadeAnos || null,
            dataDesejada: data.dataDesejada,
            motivo: data.motivo,
            status: 'pendente',
            criadoEm: new Date().toISOString()
        };

        solicitacoes.push(novaSolicitacao);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitacoes));
        
        return novaSolicitacao;
    } catch (error) {
        console.error('Erro ao criar solicitação:', error);
        throw new Error('Não foi possível salvar a solicitação');
    }
}

/**
 * Atualiza o status de uma solicitação específica
 * @param {number} id - ID da solicitação
 * @param {string} novoStatus - Novo status ('pendente', 'confirmado', 'atendido')
 * @returns {Object|null} Objeto atualizado ou null se não encontrado
 */
function updateStatus(id, novoStatus) {
    try {
        const solicitacoes = getAllSolicitacoes();
        const solicitacao = solicitacoes.find(s => s.id === parseInt(id));
        
        if (!solicitacao) {
            return null;
        }

        solicitacao.status = novoStatus;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(solicitacoes));
        
        return solicitacao;
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw new Error('Não foi possível atualizar o status');
    }
}

/**
 * Exporta todas as solicitações como JSON formatado
 * @returns {string} JSON string formatada com todas as solicitações
 */
function exportJSON() {
    try {
        const solicitacoes = getAllSolicitacoes();
        const exportData = {
            exportadoEm: new Date().toISOString(),
            totalSolicitacoes: solicitacoes.length,
            solicitacoes: solicitacoes
        };
        
        return JSON.stringify(exportData, null, 2);
    } catch (error) {
        console.error('Erro ao exportar JSON:', error);
        return JSON.stringify({ erro: 'Falha na exportação' }, null, 2);
    }
}

/**
 * Sanitiza um número de telefone para uso em links do WhatsApp
 * @param {string} telefone - Número de telefone original
 * @returns {string} Telefone sanitizado (apenas números)
 */
function sanitizeTelefone(telefone) {
    if (!telefone) return '';
    
    // Remove tudo que não é número
    const apenasNumeros = telefone.replace(/\D/g, '');
    
    // Se não começar com 55 (código do Brasil), adiciona
    if (apenasNumeros.length === 11 && !apenasNumeros.startsWith('55')) {
        return '55' + apenasNumeros;
    }
    
    return apenasNumeros;
}

// Disponibiliza as funções globalmente para outros scripts
window.initStorage = initStorage;
window.getAllSolicitacoes = getAllSolicitacoes;
window.createSolicitacao = createSolicitacao;
window.updateStatus = updateStatus;
window.exportJSON = exportJSON;
window.sanitizeTelefone = sanitizeTelefone;
