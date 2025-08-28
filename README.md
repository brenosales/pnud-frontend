# 👥 Sistema de Gerenciamento de Usuários

https://pnud-frontend.vercel.app/

Aplicação Angular moderna e responsiva para gerenciar usuários com operações CRUD completas, construída seguindo os princípios de Desenvolvimento Orientado a Testes (TDD) e as melhores práticas do Angular.



![Angular](https://img.shields.io/badge/Angular-18.x-red?style=flat-square&logo=angular)
![Material Design](https://img.shields.io/badge/Material%20Design-3.x-blue?style=flat-square&logo=material-design)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Tests](https://img.shields.io/badge/Tests-118%20passing-green?style=flat-square)
![Test Coverage](https://img.shields.io/badge/Coverage-Alta-green?style=flat-square)

## 🚀 **Funcionalidades**

### 📋 **Funcionalidades Principais**
- **Listagem de Usuários**: Tabela paginada com ordenação, filtros e busca
- **Criação de Usuários**: Formulário reativo com validação em tempo real
- **Edição de Usuários**: Formulário pré-preenchido para atualizar informações
- **Detalhes do Usuário**: Visualização abrangente das informações do usuário
- **Exclusão de Usuários**: Exclusão segura com diálogos de confirmação

### 🎨 **Experiência do Usuário**
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Material Design**: Componentes de UI profissionais e consistentes
- **Busca em Tempo Real**: Filtragem instantânea com resultados destacados
- **Estados de Carregamento**: Feedback claro durante operações assíncronas
- **Tratamento de Erros**: Mensagens de erro amigáveis com opções de tentativa

### 🏗️ **Recursos Técnicos**
- **Componentes Standalone**: Arquitetura Angular moderna
- **Carregamento Lazy**: Performance otimizada com divisão de código baseada em rotas
- **Formulários Reativos**: Formulários type-safe com validação abrangente
- **Pipes Personalizados**: Formatação e transformação de dados
- **Diretivas Personalizadas**: Interações de UI aprimoradas
- **RxJS**: Padrões de programação reativa
- **Testes Abrangentes**: 118 testes unitários com alta cobertura

## 🛠️ **Stack Tecnológica**

| Tecnologia | Versão | Propósito |
|------------|---------|---------|
| **Angular** | 18.x | Framework frontend |
| **Angular Material** | 18.x | Biblioteca de componentes UI |
| **TypeScript** | 5.x | Linguagem de programação |
| **RxJS** | 7.x | Programação reativa |
| **Jasmine/Karma** | Latest | Framework de testes |
| **SCSS** | Latest | Estilização |

## 📦 **Instalação e Configuração**

### **Pré-requisitos**
- Node.js (v18 ou superior)
- npm (v9 ou superior)
- Angular CLI (v18 ou superior)

### **Passos de Instalação**

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd user-management-system
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

4. **Abra seu navegador**
   Navegue para `http://localhost:4200`

## 🧪 **Testes**

Este projeto segue os princípios de **Desenvolvimento Orientado a Testes (TDD)** com cobertura abrangente de testes.

### **Executar Testes**
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

### **Categorias de Testes**
- **Testes Unitários**: 118 testes cobrindo serviços, componentes, pipes e diretivas
- **Testes de Integração**: Testes de interação entre componentes

### **Estatísticas dos Testes**
- ✅ **118 testes passando**
- 🎯 **Alta cobertura de testes**
- 🔄 **Pronto para integração contínua**

## 🏛️ **Arquitetura**

### **Estrutura do Projeto**
```
src/
├── app/
│   ├── core/                    # Funcionalidades principais
│   │   ├── models/             # Interfaces TypeScript
│   │   └── services/           # Serviços de lógica de negócio
│   ├── shared/                 # Componentes reutilizáveis
│   │   ├── pipes/              # Pipes personalizados
│   │   └── directives/         # Diretivas personalizadas
│   ├── users/                  # Funcionalidade de gerenciamento de usuários
│   │   ├── components/         # Componentes da funcionalidade
│   │   └── users.routes.ts     # Roteamento da funcionalidade
│   ├── app.routes.ts           # Roteamento principal
│   └── app.config.ts           # Configuração da aplicação
└── styles.scss                # Estilos globais
```

### **Padrões de Design**
- **Módulos de Funcionalidade**: Organizados por funcionalidade
- **Componentes Standalone**: Arquitetura Angular moderna
- **Programação Reativa**: RxJS para gerenciamento de estado
- **Camada de Serviços**: Separação de responsabilidades
- **Padrão Observer**: Atualizações orientadas a eventos

## 🎯 **Guia de Uso**

### **Visualização da Lista de Usuários**
- **Navegar Usuários**: Visualizar lista paginada de usuários
- **Buscar**: Busca em tempo real por nome ou email
- **Filtrar**: Filtrar por status do usuário (ativo/inativo)
- **Ordenar**: Clicar nos cabeçalhos das colunas para ordenar
- **Ações**: Visualizar, editar ou excluir usuários

### **Formulário de Usuário**
- **Criar Usuário**: Preencher o formulário com detalhes do usuário
- **Editar Usuário**: Modificar informações existentes do usuário
- **Validação**: Validação em tempo real com mensagens úteis
- **Status**: Definir usuário como ativo ou inativo

### **Detalhes do Usuário**
- **Informações do Perfil**: Visualização completa do perfil do usuário
- **Detalhes de Contato**: Telefone, email e website
- **Endereço**: Endereço completo com integração de mapa
- **Empresa**: Informações e detalhes empresariais

## 🔧 **Desenvolvimento**

### **Servidor de Desenvolvimento**
```bash
npm start
```
Navegue para `http://localhost:4200` para recarregamento automático.

### **Build**
```bash
# Build de desenvolvimento
npm run build

# Build de produção
npm run build:prod
```

### **Linting**
```bash
npm run lint
```

### **Formatação de Código**
```bash
npm run format
```

## 📝 **Integração com API**

### **Fonte de Dados**
A aplicação usa [JSONPlaceholder](https://jsonplaceholder.typicode.com/) para dados de demonstração:
- **GET** `/users` - Buscar todos os usuários
- **GET** `/users/{id}` - Buscar usuário por ID
- **POST** `/users` - Criar usuário (simulado)
- **PUT** `/users/{id}` - Atualizar usuário (simulado)
- **DELETE** `/users/{id}` - Excluir usuário (simulado)

### **Camada de Serviços**
O `UserService` fornece:
- **Operações CRUD**: Criar, Ler, Atualizar, Excluir
- **Tratamento de Erros**: Gerenciamento abrangente de erros
- **Estados de Carregamento**: Indicadores de progresso
- **Cache**: Busca de dados otimizada

## 🚀 **Deploy**

### **Build de Produção**
```bash
npm run build:prod
```
### **Configuração de Ambiente**
Configure variáveis de ambiente em:
- `src/environments/environment.ts` (desenvolvimento)
- `src/environments/environment.prod.ts` (produção)
