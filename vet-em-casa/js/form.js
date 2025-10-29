/**
 * form.js - Controller para a página index.html
 * Responsável pela lógica do formulário de solicitação
 */

// Elementos do DOM
let form;
let alertContainer;

/**
 * Inicializa a página quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o storage
    initStorage();
    
    // Obtém referências dos elementos
    form = document.getElementById('solicitacaoForm');
    alertContainer = document.getElementById('alertContainer');
    
    // Registra o listener do formulário
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

/**
 * Manipula o envio do formulário
 * @param {Event} event - Evento de submit
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Remove alertas anteriores
    clearAlerts();
    
    // Coleta os dados do formulário
    const formData = new FormData(form);
    const data = {
        nomeTutor: formData.get('nomeTutor')?.trim(),
        telefone: formData.get('telefone')?.trim(),
        endereco: formData.get('endereco')?.trim(),
        nomePet: formData.get('nomePet')?.trim(),
        especie: formData.get('especie'),
        idadeAnos: formData.get('idadeAnos') || null,
        dataDesejada: formData.get('dataDesejada')?.trim(),
        motivo: formData.get('motivo')?.trim()
    };
    
    // Validação dos campos obrigatórios
    const camposObrigatorios = [
        { campo: 'nomeTutor', nome: 'Nome do Tutor' },
        { campo: 'telefone', nome: 'Telefone' },
        { campo: 'endereco', nome: 'Endereço' },
        { campo: 'nomePet', nome: 'Nome do Pet' },
        { campo: 'especie', nome: 'Espécie' },
        { campo: 'dataDesejada', nome: 'Data Desejada' },
        { campo: 'motivo', nome: 'Motivo' }
    ];
    
    const camposFaltando = camposObrigatorios.filter(item => !data[item.campo]);
    
    if (camposFaltando.length > 0) {
        const nomesCampos = camposFaltando.map(item => item.nome).join(', ');
        showAlert('danger', `Por favor, preencha os seguintes campos obrigatórios: ${nomesCampos}`);
        return;
    }
    
    // Validação adicional de telefone (mínimo de números)
    const telefoneNumeros = data.telefone.replace(/\D/g, '');
    if (telefoneNumeros.length < 10) {
        showAlert('danger', 'Por favor, insira um telefone válido com pelo menos 10 dígitos.');
        return;
    }
    
    try {
        // Salva a solicitação
        const solicitacaoSalva = createSolicitacao(data);
        
        // Mostra mensagem de sucesso
        showAlert('success', '✅ Solicitação registrada com sucesso! Vamos confirmar o horário via WhatsApp.');
        
        // Limpa o formulário
        form.reset();
        
        // Scroll para o topo para ver a mensagem
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Erro ao salvar solicitação:', error);
        showAlert('danger', 'Erro interno. Tente novamente em alguns instantes.');
    }
}

/**
 * Exibe um alerta na tela
 * @param {string} type - Tipo do alerta ('success', 'danger', 'warning', 'info')
 * @param {string} message - Mensagem a ser exibida
 */
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertContainer.appendChild(alertDiv);
    
    // Auto-remove o alerta após 8 segundos (apenas para alertas de sucesso)
    if (type === 'success') {
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 8000);
    }
}

/**
 * Remove todos os alertas da tela
 */
function clearAlerts() {
    alertContainer.innerHTML = '';
}

/**
 * Formata o telefone enquanto o usuário digita
 * Adiciona máscara (11) 99999-9999
 */
document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.getElementById('telefone');
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length > 6) {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                } else if (value.length > 2) {
                    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
                } else if (value.length > 0) {
                    value = value.replace(/(\d{0,2})/, '($1');
                }
            }
            
            e.target.value = value;
        });
    }
});
