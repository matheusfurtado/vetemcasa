# 🐾 Vet em Casa - Sistema de Agendamento Veterinário

## 📋 Sobre o Projeto

**Vet em Casa** é um MVP (Minimum Viable Product) para agendamento de atendimento veterinário domiciliar, desenvolvido como projeto acadêmico para a disciplina **Projeto Integrador Transdisciplinar em Sistemas de Informação II**.

O sistema simula um fluxo completo de negócio onde:
- **Tutores** solicitam atendimento veterinário em casa através de um formulário web
- **Veterinária** visualiza todas as solicitações em um painel administrativo
- **Status** das solicitações podem ser atualizados (pendente → confirmado → atendido)
- **Dados** podem ser exportados para laudos e relatórios de qualidade

### 🎯 Objetivos Acadêmicos

Este projeto demonstra conceitos fundamentais da disciplina PIT-II:
- ✅ **Modelagem de sistema** com separação clara de responsabilidades
- ✅ **Padrão MVC** adaptado para frontend estático
- ✅ **Interface Human-Computer (IHC)** intuitiva e responsiva
- ✅ **Validação e verificação** através de testes manuais
- ✅ **Potencial comercial** com proposta de valor clara
- ✅ **Evidências para laudo** através de exportação JSON

---

## 🏗️ Arquitetura do Sistema

### Padrão MVC Adaptado

O projeto segue uma arquitetura **Model-View-Controller** simplificada:

```
📁 vet-em-casa/
├── 📄 index.html          # View - Interface do usuário (formulário)
├── 📄 admin.html          # View - Interface administrativa
├── 📁 js/
│   ├── 📄 storage.js      # Model - Camada de dados (localStorage)
│   ├── 📄 form.js         # Controller - Lógica do formulário
│   └── 📄 admin.js        # Controller - Lógica do painel admin
├── 📁 css/
│   └── 📄 style.css       # Estilos visuais
├── 📁 assets/
│   └── 📄 logo.svg        # Logo da marca
└── 📄 README.md           # Documentação
```

### Responsabilidades por Camada

**🗃️ Model (storage.js)**
- Gerenciamento do localStorage (simula banco de dados)
- Operações CRUD: Create, Read, Update
- Validação de integridade dos dados
- Exportação de dados em formato JSON

**🎮 Controller (form.js & admin.js)**
- Lógica de negócio e validações
- Manipulação de eventos do usuário
- Comunicação entre View e Model
- Feedback visual para o usuário

**🖼️ View (HTML + CSS)**
- Interface visual responsiva
- Formulários e tabelas interativas
- Feedback imediato ao usuário
- Design profissional e acessível

---

## 🗄️ Banco de Dados (Versão Estática)

### Estrutura dos Dados

Para esta versão de demonstração, os dados são armazenados no **localStorage** do navegador. Cada solicitação possui a seguinte estrutura:

```json
{
  "id": 1,
  "nomeTutor": "Maria Silva",
  "telefone": "(11) 99999-9999",
  "endereco": "Rua das Flores, 123 - Jardim Europa, São Paulo",
  "nomePet": "Rex",
  "especie": "cachorro",
  "idadeAnos": 5,
  "dataDesejada": "30/10 às 19h",
  "motivo": "Cachorro apresentando vômitos desde a madrugada",
  "status": "pendente",
  "criadoEm": "2024-10-29T14:30:00.000Z"
}
```

### Possíveis Status

- **🟡 pendente**: Solicitação recém-criada, aguardando confirmação
- **🔵 confirmado**: Atendimento confirmado pela veterinária
- **🟢 atendido**: Consulta realizada com sucesso

### Migração para Produção

Em um ambiente comercial real, esta estrutura seria migrada para um banco relacional:

```sql
-- Tabela de Tutores
CREATE TABLE tutores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco TEXT NOT NULL
);

-- Tabela de Pets
CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    idade_anos INTEGER,
    tutor_id INTEGER REFERENCES tutores(id)
);

-- Tabela de Solicitações
CREATE TABLE solicitacoes (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER REFERENCES pets(id),
    data_desejada VARCHAR(100) NOT NULL,
    motivo TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT NOW()
);
```

---

## 🧪 Testes, Verificação e Validação

### Roteiro de Testes Manuais

Para validar o funcionamento do sistema, siga este roteiro:

#### ✅ Teste 1: Criação de Solicitação
1. Abra `index.html` no navegador
2. Preencha todos os campos obrigatórios
3. Clique em "Solicitar Atendimento"
4. **Resultado esperado**: Mensagem verde de sucesso + formulário limpo

#### ✅ Teste 2: Validação de Campos
1. Tente enviar o formulário com campos em branco
2. **Resultado esperado**: Alerta vermelho listando campos obrigatórios

#### ✅ Teste 3: Visualização no Painel Admin
1. Abra `admin.html` no navegador
2. **Resultado esperado**: Tabela mostrando a solicitação criada no Teste 1

#### ✅ Teste 4: Atualização de Status
1. No painel admin, altere o status para "confirmado"
2. Clique em "Salvar"
3. **Resultado esperado**: Badge azul + mensagem de sucesso

#### ✅ Teste 5: Exportação de Dados
1. Clique em "Exportar JSON"
2. **Resultado esperado**: Textarea com dados em formato JSON válido

#### ✅ Teste 6: Link do WhatsApp
1. Clique no botão "WhatsApp" na tabela
2. **Resultado esperado**: Abre WhatsApp Web com número correto

### Evidências para Laudo de Qualidade

Para documentar os testes realizados:

1. **Capture screenshots** de cada etapa dos testes
2. **Copie o JSON exportado** como evidência dos dados
3. **Anote timestamps** dos testes realizados
4. **Documente qualquer bug** encontrado e sua resolução

### Critérios de Validação

**✅ Verificação (O sistema faz o que prometeu?)**
- Formulário captura dados corretamente
- Validações funcionam adequadamente
- Dados são persistidos no localStorage
- Interface administrativa mostra dados atualizados
- Exportação gera JSON válido

**✅ Validação (Atende necessidade real do usuário?)**
- Interface intuitiva para tutores não-técnicos
- Fluxo simplificado em poucos cliques
- Feedback visual claro em cada ação
- Informações suficientes para tomada de decisão
- Potencial de reduzir ligações telefônicas

---

## 🚀 Publicação no GitHub Pages

### Passo a Passo

1. **Criar repositório no GitHub**:
   ```bash
   # No terminal, dentro da pasta vet-em-casa/
   git init
   git add .
   git commit -m "Initial commit: MVP Vet em Casa"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/vet-em-casa.git
   git push -u origin main
   ```

2. **Ativar GitHub Pages**:
   - Vá em `Settings` → `Pages`
   - Em "Source", selecione `Deploy from a branch`
   - Escolha `main` branch e `/ (root)`
   - Clique em `Save`

3. **Aguardar deploy**:
   - Em alguns minutos, o site estará disponível em:
   - `https://SEU_USUARIO.github.io/vet-em-casa/`

4. **Testar publicação**:
   - Acesse a URL pública
   - Teste todas as funcionalidades
   - Use esta URL na apresentação do vídeo PIT-II

### Vantagens do GitHub Pages

- ✅ **Gratuito** e **ilimitado** para repositórios públicos
- ✅ **Deploy automático** a cada push na branch main
- ✅ **HTTPS nativo** para segurança
- ✅ **CDN global** para carregamento rápido
- ✅ **URL profissional** para apresentações

---

## 📈 Próximos Passos Sugeridos

### Melhorias de Curto Prazo
- 🔐 **Autenticação simples** para proteger admin.html
- ⏰ **Validação de horário** (08h-21h) no frontend
- 📱 **PWA** (Progressive Web App) para instalação no celular
- 🔔 **Notificações** via push ou email

### Evolução para MVP Comercial
- 🌐 **Backend real** com API REST (Flask/Django + PostgreSQL)
- 💳 **Sistema de pagamento** integrado (Stripe/PagSeguro)
- 📋 **Cadastro de veterinários** e agenda dinâmica
- 📊 **Dashboard analítico** com métricas de negócio
- 🗺️ **Integração com mapas** para cálculo de distância
- 💬 **Chat em tempo real** entre tutor e veterinário

### Escalabilidade
- ☁️ **Deploy em nuvem** (AWS/Google Cloud/Azure)
- 📊 **Monitoramento** e logs estruturados
- 🔄 **CI/CD** para deploys automatizados
- 🧪 **Testes automatizados** (unit, integration, e2e)
- 📈 **A/B testing** para otimização de conversão

---

## 🎥 Apresentação do Projeto

### Roteiro para Vídeo (5 minutos)

**⏱️ 0:00-0:30** - Introdução
- Apresentar o problema: dificuldade de agendar consultas vet em casa
- Mostrar a solução: sistema web simples e eficaz

**⏱️ 0:30-2:00** - Demonstração do Usuário Final
- Acessar index.html
- Preencher formulário passo a passo
- Mostrar validações funcionando
- Enviar solicitação com sucesso

**⏱️ 2:00-3:30** - Demonstração do Painel Admin
- Acessar admin.html
- Mostrar solicitação na tabela
- Atualizar status para "confirmado"
- Testar link do WhatsApp
- Exportar JSON e explicar uso para laudos

**⏱️ 3:30-4:30** - Aspectos Técnicos
- Explicar arquitetura MVC
- Mostrar organização do código
- Destacar separação de responsabilidades
- Mencionar potencial de evolução para produto real

**⏱️ 4:30-5:00** - Conclusão
- Resumir benefícios para tutores e veterinários
- Mencionar próximos passos comerciais
- Destacar aplicação dos conceitos PIT-II

---

## 📚 Referências e Créditos

- **Bootstrap 5**: Framework CSS para interface responsiva
- **localStorage API**: Persistência de dados no navegador
- **GitHub Pages**: Hospedagem gratuita de sites estáticos
- **Material PIT-II**: Conceitos de MVC, IHC e validação de software

---

## 📞 Contato

**Projeto acadêmico desenvolvido para PIT-II**  
**Disciplina**: Projeto Integrador Transdisciplinar em Sistemas de Informação II  
**Instituição**: [Nome da Instituição]  
**Aluno(a)**: [Seu Nome]  
**Período**: [Período Letivo]

---

*Este projeto é uma demonstração acadêmica e não deve ser usado em produção sem as devidas adequações de segurança e infraestrutura.*
