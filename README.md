# Ficha de Cadastro de Clientes

Sistema completo de cadastro de clientes com geração automática de PDF e integração com Google Sheets.

## Funcionalidades

- 📋 Formulário multi-página (6 etapas)
- 🎨 Temas dinâmicos (Azul para PF, Verde para PJ)
- 📄 Geração automática de PDF com todos os dados
- 📦 Download em ZIP com PDF + anexos
- 📊 Envio automático para Google Sheets
- 📱 Design responsivo
- ✨ Interface moderna com animações

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- jsPDF 2.5.1
- JSZip 3.10.1
- Google Apps Script
- ViaCEP API

## Como Usar

1. Acesse o formulário
2. Selecione o tipo de contrato (Pessoa Física ou Pessoa Jurídica)
3. Preencha todas as etapas
4. Anexe os documentos necessários
5. Clique em "Enviar Cadastro"
6. O sistema irá:
   - Gerar um PDF com todos os dados
   - Criar um ZIP com o PDF e anexos
   - Enviar os dados para o Google Sheets
   - Fazer download automático do ZIP

## Estrutura de Arquivos

```
├── index.html              # Estrutura do formulário
├── script.js               # Lógica da aplicação
├── styles.css              # Estilos e tema
├── INSTRUCOES_GOOGLE_SHEETS.md  # Configuração do Google Sheets
├── assets/                 # Imagens e ícones
│   ├── *.svg              # Ícones das páginas
│   ├── *.png              # Logos e backgrounds
```

## Configuração do Google Sheets

Siga as instruções detalhadas em `INSTRUCOES_GOOGLE_SHEETS.md` para configurar a integração com Google Sheets.

## Páginas do Formulário

1. **Tipo de Contrato**: Seleção entre PF ou PJ
2. **Informações**: Dados pessoais/empresariais
3. **Endereço**: Localização com busca automática por CEP
4. **Negociação**: Plano contratado e detalhes
5. **Anexos**: Upload de documentos
6. **Agendamento**: Informações de instalação

## Autor

Matheus Moreira, operador de BackOffice Sonik Internet®

## Licença

Todos os direitos reservados © 2025

