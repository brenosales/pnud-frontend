# Guia de Configuração de Ambiente

Este documento explica como configurar o Sistema de Gerenciamento de Usuários para diferentes ambientes.

## Visão Geral

A aplicação usa o sistema de ambiente do Angular para gerenciar configurações para diferentes ambientes de deploy. Isso elimina valores hardcoded e fornece uma forma limpa de gerenciar configurações específicas de ambiente.

## Arquivos de Ambiente

### Ambiente de Desenvolvimento (`src/environments/environment.ts`)
- **URL da API**: `https://jsonplaceholder.typicode.com` (API de demonstração)
- **Delay Simulado**: 500ms (simula latência de rede)
- **Logging**: Habilitado
- **Timeout do Cache**: 5 minutos

### Ambiente de Produção (`src/environments/environment.prod.ts`)
- **URL da API**: `https://api.yourproduction.com` (substitua pela sua API real)
- **Delay Simulado**: 0ms (sem delay artificial)
- **Logging**: Desabilitado
- **Timeout do Cache**: 10 minutos

## Serviço de Configuração

O `ConfigurationService` fornece acesso centralizado a todas as configurações de ambiente:

```typescript
@Injectable()
export class ConfigurationService {
  // Obter URL base da API
  getApiUrl(): string
  
  // Obter URL completa para endpoint específico
  getFullApiUrl(endpoint: keyof ApiEndpoints): string
  
  // Verificar se está rodando em produção
  isProduction(): boolean
  
  // Obter delay simulado para desenvolvimento
  getMockDelay(): number
  
  // Obter configurações de paginação
  getPaginationConfig(): PaginationConfig
  
  // Obter configurações de busca
  getSearchConfig(): SearchConfig
}
```

## Constantes

As constantes da aplicação estão centralizadas em `src/app/core/constants/app.constants.ts`:

```typescript
export const APP_CONSTANTS = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50]
  },
  SEARCH: {
    DEBOUNCE_TIME: 300
  },
  VALIDATION: {
    NAME: { MIN_LENGTH: 2, MAX_LENGTH: 50 }
  }
  // ... mais constantes
};
```

## Exemplos de Uso

### Em Serviços
```typescript
constructor(private configService: ConfigurationService) {
  this.apiUrl = this.configService.getFullApiUrl('users');
  this.mockDelay = this.configService.getMockDelay();
}
```

### Em Componentes
```typescript
constructor(private configService: ConfigurationService) {
  this.pageSize = this.configService.getDefaultPageSize();
  this.pageSizeOptions = this.configService.getPageSizeOptions();
}
```

## Builds Específicos de Ambiente

### Build de Desenvolvimento
```bash
ng build
# Usa src/environments/environment.ts
```

### Build de Produção
```bash
ng build --configuration production
# Usa src/environments/environment.prod.ts
```

## Adicionando Novos Ambientes

1. Crie um novo arquivo de ambiente (ex: `environment.staging.ts`)
2. Adicione a configuração ao `angular.json`:
```json
"staging": {
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.staging.ts"
    }
  ]
}
```

3. Build com: `ng build --configuration staging`
