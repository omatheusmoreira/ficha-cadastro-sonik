# Instruções para Integração com Google Sheets

## Passo 1: Criar o Google Apps Script

1. Abra sua planilha do Google Sheets: https://docs.google.com/spreadsheets/d/1QIK4WCXVndXWxkpJ1BC3UngHJfokS1r9Rm7xG3ruC6Q/edit

2. Clique em **Extensões** > **Apps Script**

3. Apague todo o código que aparecer e cole o código abaixo:

```javascript
function doPost(e) {
  try {
    // Parse dos dados recebidos
    const data = JSON.parse(e.postData.contents);
    
    // Definir qual aba usar baseado no tipo de contrato
    const sheetName = data.contractType === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica';
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Aba "' + sheetName + '" não encontrada'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Encontrar a próxima linha vazia
    const lastRow = sheet.getLastRow();
    const nextRow = lastRow + 1;
    
    // Inserir dados DIRETAMENTE nas colunas específicas
    const dateCell = sheet.getRange(nextRow, 5);
    dateCell.setValue(new Date()); // Coluna E - Data/Hora
    dateCell.setNumberFormat('dd/mm/yyyy hh:mm:ss'); // Formato com hora
    sheet.getRange(nextRow, 6).setValue(data.collaborator); // Coluna F - Colaborador
    sheet.getRange(nextRow, 7).setValue(data.access); // Coluna G - Acesso
    
    // Estrutura diferente para PF e PJ
    if (data.contractType === 'pj') {
      // Pessoa Jurídica
      sheet.getRange(nextRow, 8).setValue(data.companyName || ''); // Coluna H - Razão Social
      sheet.getRange(nextRow, 9).setValue(data.cnpj || ''); // Coluna I - CNPJ
      sheet.getRange(nextRow, 10).setValue(data.corporateEmail || ''); // Coluna J - Email Corporativo
      sheet.getRange(nextRow, 11).setValue(data.businessPhone1 || ''); // Coluna K - Telefone 1
      sheet.getRange(nextRow, 12).setValue(data.businessPhone2 || ''); // Coluna L - Telefone 2
      sheet.getRange(nextRow, 13).setValue(data.cep || ''); // Coluna M - CEP
      sheet.getRange(nextRow, 14).setValue(data.street || ''); // Coluna N - Logradouro
      sheet.getRange(nextRow, 15).setValue(data.number || ''); // Coluna O - Número
      sheet.getRange(nextRow, 16).setValue(data.complement || ''); // Coluna P - Complemento
      sheet.getRange(nextRow, 17).setValue(data.neighborhood || ''); // Coluna Q - Bairro
      sheet.getRange(nextRow, 18).setValue(data.city || ''); // Coluna R - Cidade
      sheet.getRange(nextRow, 19).setValue(data.offer || ''); // Coluna S - Oferta Desejada
      sheet.getRange(nextRow, 20).setValue(data.dueDate || ''); // Coluna T - Data de Vencimento
      sheet.getRange(nextRow, 21).setValue(data.fixedPhone || ''); // Coluna U - Telefonia Fixa
      sheet.getRange(nextRow, 22).setValue(data.technicianName || ''); // Coluna V - Nome de quem receberá o técnico
      sheet.getRange(nextRow, 23).setValue(data.technicianPhone || ''); // Coluna W - Telefone de quem receberá o técnico
      sheet.getRange(nextRow, 24).setValue(data.availability || ''); // Coluna X - Disponibilidade
      sheet.getRange(nextRow, 25).setValue(data.observations || ''); // Coluna Y - Observações Adicionais
    } else {
      // Pessoa Física
      sheet.getRange(nextRow, 8).setValue(data.name || ''); // Coluna H - Nome
      sheet.getRange(nextRow, 9).setValue(data.email || ''); // Coluna I - Email
      sheet.getRange(nextRow, 10).setValue(data.phone1 || ''); // Coluna J - Telefone 1
      sheet.getRange(nextRow, 11).setValue(data.phone2 || ''); // Coluna K - Telefone 2
      // Colunas L e M vazias para PF
      sheet.getRange(nextRow, 12).setValue(data.cep || ''); // Coluna L - CEP
      sheet.getRange(nextRow, 13).setValue(data.street || ''); // Coluna M - Logradouro
      sheet.getRange(nextRow, 14).setValue(data.number || ''); // Coluna N - Número
      sheet.getRange(nextRow, 15).setValue(data.complement || ''); // Coluna O - Complemento
      sheet.getRange(nextRow, 16).setValue(data.neighborhood || ''); // Coluna P - Bairro
      sheet.getRange(nextRow, 17).setValue(data.city || ''); // Coluna Q - Cidade
      sheet.getRange(nextRow, 18).setValue(data.offer || ''); // Coluna R - Oferta
      sheet.getRange(nextRow, 19).setValue(data.dueDate || ''); // Coluna S - Vencimento
      sheet.getRange(nextRow, 20).setValue(data.fixedPhone || ''); // Coluna T - Tel Fixa
      sheet.getRange(nextRow, 21).setValue(data.technicianName || ''); // Coluna U - Nome Técnico
      sheet.getRange(nextRow, 22).setValue(data.technicianPhone || ''); // Coluna V - Tel Técnico
      sheet.getRange(nextRow, 23).setValue(data.availability || ''); // Coluna W - Disponibilidade
      sheet.getRange(nextRow, 24).setValue(data.observations || ''); // Coluna X - Observações
      sheet.getRange(nextRow, 25).setValue(data.houseSize || ''); // Coluna Y - Tamanho da Casa
      sheet.getRange(nextRow, 26).setValue(data.cancellationReason || ''); // Coluna Z - Motivo do Cancelamento
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Dados salvos com sucesso!'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Clique em **Salvar** (ícone de disquete)

5. Clique em **Implantar** > **Nova implantação**

6. Clique no ícone de engrenagem ⚙️ ao lado de "Selecionar tipo" e escolha **Aplicativo da Web**

7. Configure:
   - **Descrição**: Ficha de Cadastro Sonik
   - **Executar como**: Eu (seu email)
   - **Quem tem acesso**: Qualquer pessoa

8. Clique em **Implantar**

9. **IMPORTANTE**: Copie a **URL do aplicativo da Web** que aparecerá (algo como: `https://script.google.com/macros/s/ABC123.../exec`)

## Passo 2: Adicionar cabeçalhos nas planilhas

**IMPORTANTE:** Crie duas abas na planilha: "Pessoa Física" e "Pessoa Jurídica"

Em ambas as abas, adicione estes cabeçalhos **começando na coluna E** (colunas A-D ficam vazias):

**Para aba "Pessoa Física":**
| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| (vazio) | (vazio) | (vazio) | (vazio) | Data/Hora | Colaborador | Acesso | Nome | E-mail | Telefone 1 | Telefone 2 | CEP | Logradouro | Número | Complemento | Bairro | Cidade | Oferta Desejada | Data Vencimento | Telefonia Fixa | Nome Técnico | Telefone Técnico | Disponibilidade | Observações |

**Para aba "Pessoa Jurídica":**
| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q | R | S | T | U | V | W | X | Y |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| (vazio) | (vazio) | (vazio) | (vazio) | Data/Hora | Colaborador | Acesso | Razão Social | CNPJ | E-mail Corporativo | Telefone 1 | Telefone 2 | CEP | Logradouro | Número | Complemento | Bairro | Cidade | Oferta Desejada | Data de Vencimento | Telefonia Fixa | Nome de quem receberá o técnico | Telefone de quem receberá o técnico | Disponibilidade | Observações Adicionais |

## Passo 3: Atualizar o código JavaScript

Cole a URL copiada no Passo 1 (etapa 9) no arquivo `script.js`, substituindo onde está:

```javascript
const GOOGLE_SCRIPT_URL = 'COLE_AQUI_A_URL_DO_APPS_SCRIPT';
```

Pronto! Agora quando o formulário for enviado, os dados serão salvos automaticamente no Google Sheets.
