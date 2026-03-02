// INTEGRAÇÃO COM GOOGLE APPS SCRIPT PARA CRIAÇÃO DE DOCUMENTOS NO DRIVE
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_vkW7wTuiFwzWKzgtiZ-ky5ltSshn0-uJMapnbm9zue6BdROXmEGLklI2bSGQs5sA/exec';

// Função para enviar dados para o Apps Script
function sendToGoogleDrive(formDataObj, osType) {
  showLoadingModal();

  try {
    // Preparar dados como FormData (evita CORS)
    const formData = new FormData();
    formData.append('osType', osType);
    formData.append('clienteNome', formDataObj.clienteNome || 'Sem nome');
    
    // Adicionar todos os outros campos
    for (const [key, value] of Object.entries(formDataObj)) {
      if (key !== 'clienteNome') {
        formData.append(key, value);
      }
    }

    // Fazer requisição com FormData
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(responseText => {
      try {
        const result = JSON.parse(responseText);
        if (result.success) {
          updateLoadingStatus('statusPdf', true);
          const statusText = document.querySelector('#statusPdf .status-text');
          if (statusText) statusText.textContent = 'Enviado com sucesso ✅';
          console.log('Documento criado:', result.fileName);

          // Limpar formulário após sucesso
          setTimeout(() => {
            hideLoadingModal();
            resetForm();
            goToPage(1);
          }, 2000);
        } else {
          hideLoadingModal();
          showErrorMessage('Erro: ' + result.message);
        }
      } catch (e) {
        hideLoadingModal();
        showErrorMessage('Erro ao processar resposta: ' + responseText);
      }
    })
    .catch(error => {
      hideLoadingModal();
      showErrorMessage('Erro ao enviar dados: ' + error.message);
      console.error('Erro:', error);
    });

  } catch (error) {
    hideLoadingModal();
    showErrorMessage('Erro: ' + error.message);
    console.error('Erro na submissão:', error);
  }
}

// Função para coletar dados do formulário
function collectFormData(pageNumber) {
  const formData = {};

  if (pageNumber === 1) {
    // PAGE 1: Alteração de Endereço
    formData.clienteNome = document.getElementById('osClienteNome')?.value || '';
    formData.osCollaborator = document.getElementById('osCollaborator')?.value || '';
    formData.osEnderecoAntigo = document.getElementById('osEnderecoAntigo')?.value || '';
    formData.osNovoCep = document.getElementById('osNovoCep')?.value || '';
    formData.osNovoLogradouro = document.getElementById('osNovoLogradouro')?.value || '';
    formData.osNovoNumero = document.getElementById('osNovoNumero')?.value || '';
    formData.osNovoComplemento = document.getElementById('osNovoComplemento')?.value || '';
    formData.osNovoBairro = document.getElementById('osNovoBairro')?.value || '';
    formData.osNovoCidade = document.getElementById('osNovoCidade')?.value || '';
    formData.osTelefone = document.getElementById('osTelefone')?.value || '';
    formData.osResponsavel = document.getElementById('osResponsavel')?.value || '';
    formData.osDisponibilidade = document.getElementById('osDisponibilidade')?.value || '';
    formData.osTaxa = document.getElementById('osTaxa')?.value || '';
    formData.osObservacoes = document.getElementById('osObservacoes')?.value || '';

  } else if (pageNumber === 2) {
    // PAGE 2: Mudança de Ponto Interno
    formData.clienteNome = document.getElementById('osPontoClienteNome')?.value || '';
    formData.osPontoCollaborator = document.getElementById('osPontoCollaborator')?.value || '';
    formData.osPontoRoteadorAtual = document.getElementById('osPontoRoteadorAtual')?.value || '';
    formData.osPontoNovoPonto = document.getElementById('osPontoNovoPonto')?.value || '';
    formData.osPontoTelefone = document.getElementById('osPontoTelefone')?.value || '';
    formData.osPontoResponsavel = document.getElementById('osPontoResponsavel')?.value || '';
    formData.osPontoDisponibilidade = document.getElementById('osPontoDisponibilidade')?.value || '';
    formData.osPontoTaxa = document.getElementById('osPontoTaxa')?.value || '';
    formData.osPontoObservacoes = document.getElementById('osPontoObservacoes')?.value || '';

  } else if (pageNumber === 3) {
    // PAGE 3: Troca de Equipamento
    formData.clienteNome = document.getElementById('osEquipClienteNome')?.value || '';
    formData.osEquipCollaborator = document.getElementById('osEquipCollaborator')?.value || '';
    formData.osEquipMotivo = document.getElementById('osEquipMotivo')?.value || '';
    formData.osEquipAtual = document.getElementById('osEquipAtual')?.value || '';
    formData.osEquipNovo = document.getElementById('osEquipNovo')?.value || '';
    formData.osEquipTelefone = document.getElementById('osEquipTelefone')?.value || '';
    formData.osEquipResponsavel = document.getElementById('osEquipResponsavel')?.value || '';
    formData.osEquipDisponibilidade = document.getElementById('osEquipDisponibilidade')?.value || '';
    formData.osEquipObservacoes = document.getElementById('osEquipObservacoes')?.value || '';
  }

  return formData;
}

// Funções de notificação
function showSuccessMessage(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-success';
  alertDiv.textContent = message;
  
  const firstForm = document.querySelector('.form-page.active');
  if (firstForm) {
    firstForm.parentNode.insertBefore(alertDiv, firstForm);
    setTimeout(() => alertDiv.remove(), 3000);
  }
}

function showErrorMessage(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-error';
  alertDiv.textContent = message;
  
  const firstForm = document.querySelector('.form-page.active');
  if (firstForm) {
    firstForm.parentNode.insertBefore(alertDiv, firstForm);
    setTimeout(() => alertDiv.remove(), 5000);
  }
}



