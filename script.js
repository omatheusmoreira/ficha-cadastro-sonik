// Detecta ambiente local ou produção
const isLocal = location.hostname === "localhost" || location.protocol === "file:";

/**
 * Função central para upload de arquivos (Drive)
 * @param {object} payload - Objeto com clientName, contractType, files[]
 */
async function uploadFiles(payload) {
    if (isLocal) {
        // Modo simulação local
        console.log("🧪 MODO LOCAL");
        console.log("Cliente:", payload.clientName);
        console.log("Arquivos:", payload.files.map(f => f.fileName));
        return {
            status: "success",
            folderUrl: "LOCAL_SIMULATION"
        };
    } else {
        // Modo produção (GitHub Pages)
        console.log("🌐 MODO PRODUÇÃO (upload real)");
        try {
            const response = await fetch(APPS_SCRIPT_UPLOAD_URL, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (result.status === "success") {
                console.log("Arquivos enviados para o Drive com sucesso:", result.folderUrl);
                return result;
            } else {
                console.error("Erro ao enviar arquivos para o Drive:", result.message);
                return result;
            }
        } catch (error) {
            console.error("Erro na integração com o Google Drive:", error);
            return { status: "error", message: error.toString() };
        }
    }
}
// Form Data
let formData = {
    contractType: 'pf',
    page2Data: {},
    page3Data: {},
    page4Data: {},
    page5Data: {},
    page6Data: {}
};

// Theme Management
let currentTheme = {
    primary: '#018dd7',
    secondary: '#0175b3',
    name: 'blue'
};

const themes = {
    pf: {
        primary: '#018dd7',
        secondary: '#0175b3',
        name: 'blue',
        title: 'Pessoa Física'
    },
    pj: {
        primary: '#2E7D32',
        secondary: '#1B5E20',
        name: 'green',
        title: 'Pessoa Jurídica'
    }
};

// Planos por tipo de contrato
const offers = {
    pf: [
        '━━━━━ OFERTAS COM 1 ROTEADOR ━━━━━',
        '800 MEGA - R$89,90',
        '1 GIGA + DEEZER - R$99,90',
        '1 GIGA + DEEZER + GLOBOPLAY - R$109,90',
        '1 GIGA + DEEZER + DISNEY+ - R$119,90',
        '1 GIGA + DEEZER + HBO MAX - R$119,90',
        '1 GIGA (ALL IN: GLOBOPLAY + DISNEY+ + HBO MAX) - R$145,90',
        '1 GIGA + DEEZER + IP FIXO - R$149,90',
        '2 GIGA (ALL IN: GLOBOPLAY + DISNEY+ + HBO MAX) - R$149,90',
        '',
        '━━━━━ OFERTAS COM 2 ROTEADORES ━━━━━',
        '1 GIGA + DEEZER - R$129,90',
        '1.6 GIGA + DEEZER + DISNEY+ R$139,80',
        '1.6 GIGA + DEEZER + GLOBOPLAY - R$139,80',
        '1.6 GIGA + DEEZER + HBO MAX - R$139,80',
        '1 GIGA (ALL IN + REDE MESH) - R$175,80',
        '',
        '━━━━━ OFERTA RURAL ━━━━━',
        '600 MEGA - R$119,90'
    ],
    pj: [
        '━━━━━ PLANOS BÁSICOS ━━━━━',
        '600 MEGA + DRIVE 500GB (SEM WI-FI) – R$119,90',
        '600 MEGA + WI-FI + DRIVE 500GB – R$119,90',
        '600 MEGA + IP FIXO + DRIVE 500GB – R$149,90',
        '600 MEGA + WI-FI + IP FIXO + DRIVE 500GB – R$149,90',
        '600 MEGA + WI-FI + FIXO NACIONAL ILIMITADO + DRIVE 500GB – R$159,90',
        '1 GIGA + WI-FI + IP FIXO – R$269,80',
        '',
        '━━━━━ PLANOS COM TELEFONIA EMPRESARIAL ━━━━━',
        'FXS 2 CANAIS + 600 MEGA + IP FIXO + WI-FI (MÁX. 2 NÚMEROS) – R$299,90',
        'NACIONAL 4 CANAIS + 600 MEGA + IP FIXO + WI-FI (MÁX. 4 NÚMEROS) – R$399,90',
        'SIP 5 CANAIS + 600 MEGA + IP FIXO + WI-FI (MÁX. 5 NÚMEROS) – R$499,90',
        'SIP 10 CANAIS + 600 MEGA + IP FIXO (MÁX. 50 NÚMEROS) – R$799,90',
        'SIP 15 CANAIS (MÁX. 50 NÚMEROS) – R$999,90',
        'SIP 20 CANAIS (MÁX. 50 NÚMEROS) – R$1.199,90',
        'SIP 30 CANAIS (MÁX. 50 NÚMEROS) – R$1.399,90',
        '',
        '━━━━━ TRANSPORTE / LINK DEDICADO ━━━━━',
        'TRANSPORTE 100 MEGA GPON (POR PONTA) – R$200,00',
        'TRANSPORTE 100 MEGA ENTRE ONU (AMBOS OS PONTOS JÁ COM INTERNET) – R$160,00',
        '100 MEGA DEDICADO GPON /30 – R$400,00',
        '200 MEGA DEDICADO GPON /30 – R$600,00'
    ]
};

// Page Management
// =============================
// Função para upload de arquivos no Google Drive via Apps Script
// =============================
// Cole a URL do seu Apps Script Web App abaixo:
const APPS_SCRIPT_UPLOAD_URL = 'https://script.google.com/macros/s/AKfycbzsBsCPhbq7OLlaEAt8PG6rxIuHSoNlXTtjlwmhAK7rYJP9Ylit9fbMbGgYnd4kDUk/exec';

/**
 * Envia todos os arquivos do formulário para o Google Drive via Apps Script, incluindo o PDF da ficha
 * @param {FormData} formData FormData completo do formulário
 * @param {Blob} pdfBlob Blob do PDF gerado
 * @returns {Promise<string|null>} URL da pasta no Drive ou null em caso de erro
 */
async function uploadFilesToDrive(formData, pdfBlob) {
    // Identifica o nome do cliente corretamente
    let contractType = formData.get('contractType');
    let clientName = '';
    if (contractType === 'pf') {
        clientName = formData.get('name') || '';
    } else if (contractType === 'pj') {
        clientName = formData.get('companyName') || '';
    }
    // Prepara arquivos em base64
    let files = [];
    let fileReadPromises = [];
    // Adiciona o PDF da ficha de cadastro
    const pdfPromise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            files.push({
                fileName: 'Ficha de Cadastro.pdf',
                mimeType: 'application/pdf',
                base64: base64
            });
            resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(pdfBlob);
    });
    fileReadPromises.push(pdfPromise);
    // Adiciona os demais arquivos do formulário
    for (const [key, value] of formData.entries()) {
        if (value instanceof File && value.size > 0) {
            const promise = new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result.split(',')[1];
                    files.push({
                        fileName: value.name,
                        mimeType: value.type,
                        base64: base64
                    });
                    resolve();
                };
                reader.onerror = reject;
                reader.readAsDataURL(value);
            });
            fileReadPromises.push(promise);
        }
    }
    await Promise.all(fileReadPromises);
    // Monta o payload
    const payload = {
        clientName: clientName,
        contractType: contractType,
        files: files
    };
    // Chama função central de upload
    return await uploadFiles(payload);
}
let currentPage = 1;
const totalPages = 6;

// DOM Elements
const form = document.getElementById('multiStepForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const contractTypeSelect = document.getElementById('contractType');
const accessSelect = document.getElementById('access');
const fixedPhoneSelect = document.getElementById('fixedPhone');
const offerSelect = document.getElementById('offer');
const cepInput = document.getElementById('cep');
const searchCepBtn = document.getElementById('searchCep');
const clearAddressBtn = document.getElementById('clearAddress');
const availabilitySelect = document.getElementById('availability');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeTabButtons();
    updatePageDisplay();
    // Apply PF theme by default
    applyTheme('pf');
    updateOfferOptions();
    updatePageRequirements();
    initializeDragAndDrop();
});

function initializeEventListeners() {
    // Navigation buttons
    prevBtn.addEventListener('click', () => previousPage());
    nextBtn.addEventListener('click', () => nextPage());
    submitBtn.addEventListener('click', (e) => submitForm(e));

    // Contract type change
    contractTypeSelect.addEventListener('change', handleContractTypeChange);

    // Access change
    accessSelect.addEventListener('change', updatePageRequirements);

    // CEP search
    searchCepBtn.addEventListener('click', searchAddress);
    cepInput.addEventListener('blur', searchAddress);

    // Clear address
    clearAddressBtn.addEventListener('click', clearAddress);

    // Fixed phone change
    fixedPhoneSelect.addEventListener('change', updatePhoneFileUpload);

    // Availability change
    availabilitySelect.addEventListener('change', updateAvailabilityOptions);

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm(e);
    });

    // Email validation
    document.getElementById('email')?.addEventListener('blur', validateEmail);
    document.getElementById('corporateEmail')?.addEventListener('blur', validateEmail);
    
    // Force lowercase on email fields
    document.getElementById('email')?.addEventListener('input', forceEmailLowercase);
    document.getElementById('corporateEmail')?.addEventListener('input', forceEmailLowercase);
    
    // Force uppercase on specific fields
    document.getElementById('name')?.addEventListener('input', forceUppercase);
    document.getElementById('companyName')?.addEventListener('input', forceUppercase);
    document.getElementById('street')?.addEventListener('input', forceUppercase);
    document.getElementById('complement')?.addEventListener('input', forceUppercase);
    document.getElementById('neighborhood')?.addEventListener('input', forceUppercase);
    document.getElementById('technicianName')?.addEventListener('input', forceUppercase);
    document.getElementById('observations')?.addEventListener('input', forceUppercase);
    document.getElementById('houseSize')?.addEventListener('input', forceUppercase);
    document.getElementById('cancellationReason')?.addEventListener('input', forceUppercase);

    // Phone number limits (11 digits: (00) 00000-0000)
    document.getElementById('phone1')?.addEventListener('input', limitPhoneInput);
    document.getElementById('phone2')?.addEventListener('input', limitPhoneInput);
    document.getElementById('businessPhone1')?.addEventListener('input', limitPhoneInput);
    document.getElementById('businessPhone2')?.addEventListener('input', limitPhoneInput);
    document.getElementById('technicianPhone')?.addEventListener('input', limitPhoneInput);

    // CEP limit (8 digits: 00000-000)
    cepInput.addEventListener('input', limitCepInput);

    // Inscrição Estadual mask
    document.getElementById('inscriptionState')?.addEventListener('input', handleInscriptionState);

    // Reset form button
    document.getElementById('resetFormBtn')?.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar todo o formulário? Todos os dados serão perdidos.')) {
            resetForm();
        }
    });


}

// Initialize Tab Buttons
function initializeTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageNum = parseInt(button.getAttribute('data-page'));
            goToPage(pageNum);
        });
    });
}

// Contract Type Change Handler
function handleContractTypeChange() {
    formData.contractType = contractTypeSelect.value;
    updateOfferOptions();
    updatePageRequirements();
    
    // Apply theme based on contract type
    applyTheme(formData.contractType);
}

// Apply Theme
function applyTheme(contractType) {
    const theme = themes[contractType] || themes.pf;
    currentTheme = theme;
    
    // Update CSS variables for dynamic theming
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    
    // Update all theme-dependent elements
    updateThemeElements();
}

// Update Offer Options
function updateOfferOptions() {
    const offers_list = offers[formData.contractType] || [];
    offerSelect.innerHTML = '<option value="">Selecione...</option>';
    
    offers_list.forEach(offer => {
        const option = document.createElement('option');
        
        // Check if it's a separator/header (contains ━)
        if (offer.includes('━')) {
            option.value = '';
            option.textContent = offer;
            option.disabled = true;
            option.style.fontWeight = 'bold';
            option.style.textAlign = 'center';
        }
        // Check if it's an empty spacer
        else if (offer === '') {
            option.value = '';
            option.textContent = '';
            option.disabled = true;
        }
        // Regular option
        else {
            option.value = offer;
            option.textContent = offer;
        }
        
        offerSelect.appendChild(option);
    });
}

// Update Page Requirements (Show/Hide fields based on contract type)
function updatePageRequirements() {
    if (currentPage === 2) {
        const pfFields = document.getElementById('pfFields');
        const pjFields = document.getElementById('pjFields');
        
        if (formData.contractType === 'pf') {
            pfFields.style.display = 'block';
            pjFields.style.display = 'none';
            // Definir required apenas nos campos PF obrigatórios
            document.getElementById('name').required = true;
            document.getElementById('email').required = true;
            document.getElementById('phone1').required = true;
            document.getElementById('phone2').required = false;
            // Remover required dos campos PJ
            document.querySelectorAll('#pjFields input, #pjFields select').forEach(el => {
                el.required = false;
            });
        } else if (formData.contractType === 'pj') {
            pfFields.style.display = 'none';
            pjFields.style.display = 'block';
            // Definir required apenas nos campos PJ obrigatórios
            document.getElementById('companyName').required = true;
            document.getElementById('cnpj').required = true;
            document.getElementById('inscriptionState').required = true;
            document.getElementById('corporateEmail').required = true;
            document.getElementById('businessPhone1').required = true;
            document.getElementById('businessPhone2').required = false;
            // Remover required dos campos PF
            document.querySelectorAll('#pfFields input, #pfFields select').forEach(el => {
                el.required = false;
            });
        }
    }

    // Torna obrigatórios os campos de endereço
    if (currentPage === 3) {
        document.getElementById('cep').required = true;
        document.getElementById('street').required = true;
        document.getElementById('number').required = true;
        document.getElementById('complement').required = true;
        document.getElementById('neighborhood').required = true;
        document.getElementById('city').required = true;

        // Exibe o campo 'Tamanho da Casa do Cliente' apenas para PF
        const houseSizeGroup = document.getElementById('houseSizeGroup');
        if (formData.contractType === 'pf') {
            houseSizeGroup.style.display = 'block';
            document.getElementById('houseSize').required = true;
        } else {
            houseSizeGroup.style.display = 'none';
            document.getElementById('houseSize').required = false;
        }
    } else {
        // Garante que o campo fique oculto nas outras páginas
        const houseSizeGroup = document.getElementById('houseSizeGroup');
        if (houseSizeGroup) houseSizeGroup.style.display = 'none';
    }

    if (currentPage === 4) {
        // Exibe o campo 'Motivo do Cancelamento com o Provedor Anterior' apenas para PF
        const cancellationReasonGroup = document.getElementById('cancellationReasonGroup');
        if (formData.contractType === 'pf') {
            cancellationReasonGroup.style.display = 'block';
            document.getElementById('cancellationReason').required = true;
        } else {
            cancellationReasonGroup.style.display = 'none';
            document.getElementById('cancellationReason').required = false;
        }
    } else {
        // Garante que o campo fique oculto nas outras páginas
        const cancellationReasonGroup = document.getElementById('cancellationReasonGroup');
        if (cancellationReasonGroup) cancellationReasonGroup.style.display = 'none';
    }

    if (currentPage === 5) {
        const pfAttachments = document.getElementById('pfAttachments');
        const pjAttachments = document.getElementById('pjAttachments');
        
        if (formData.contractType === 'pf') {
            pfAttachments.style.display = 'block';
            pjAttachments.style.display = 'none';
            document.querySelectorAll('#pfAttachments input').forEach(el => {
                el.required = true;
            });
            document.querySelectorAll('#pjAttachments input').forEach(el => {
                el.required = false;
            });
        } else if (formData.contractType === 'pj') {
            pfAttachments.style.display = 'none';
            pjAttachments.style.display = 'block';
            document.querySelectorAll('#pjAttachments input').forEach(el => {
                el.required = true;
            });
            document.querySelectorAll('#pfAttachments input').forEach(el => {
                el.required = false;
            });
        }
    }

    // Update availability options for PJ
    if (currentPage === 6 && formData.contractType === 'pj') {
        const option = document.querySelector('#availability option[value="businessHours"]');
        if (option) option.style.display = 'block';
    } else if (currentPage === 6) {
        const option = document.querySelector('#availability option[value="businessHours"]');
        if (option) option.style.display = 'none';
    }
}

// Update Phone File Upload Visibility
function updatePhoneFileUpload() {
    const phoneFileGroup = document.getElementById('phoneFileGroup');
    const phoneFileInput = document.getElementById('phoneFile');
    
    // Mostrar o campo de anexo APENAS se for "Sim, Portabilidade"
    if (fixedPhoneSelect.value === 'portability') {
        phoneFileGroup.style.display = 'block';
        phoneFileInput.setAttribute('required', 'required');
    } else {
        phoneFileGroup.style.display = 'none';
        phoneFileInput.removeAttribute('required');
        phoneFileInput.value = ''; // Limpa o arquivo se mudar a opção
    }
}

// Search Address by CEP
async function searchAddress(e) {
    if (e.target.id === 'cep' && e.type === 'blur' && !cepInput.value) return;
    
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('CEP deve conter 8 dígitos');
        return;
    }

    try {
        // Using ViaCEP API (free Brazilian CEP service)
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert('CEP não encontrado');
            return;
        }

        // Populate address fields
        document.getElementById('street').value = data.logradouro || '';
        document.getElementById('neighborhood').value = data.bairro || '';
        document.getElementById('city').value = data.localidade || '';
        
        // Format CEP for display
        cepInput.value = `${cep.substring(0, 5)}-${cep.substring(5)}`;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Tente novamente.');
    }
}

// Clear Address
function clearAddress() {
    document.getElementById('cep').value = '';
    document.getElementById('street').value = '';
    document.getElementById('number').value = '';
    document.getElementById('complement').value = '';
    document.getElementById('neighborhood').value = '';
    document.getElementById('city').value = '';
}

// Update Availability Options
function updateAvailabilityOptions() {
    // This is called to enable/disable business hours option based on contract type
    updatePageRequirements();
}

// Navigation Functions
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updatePageDisplay();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePageDisplay();
    }
}

// Validate Current Page (não bloqueia navegação, apenas indica)
function validateCurrentPage() {
    const currentPageElement = document.querySelector(`.form-page[data-page="${currentPage}"]`);
    const inputs = currentPageElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        // Verificar se o campo está dentro de um container oculto
        const parentContainer = input.closest('#pfFields, #pjFields, #pfAttachments, #pjAttachments, #phoneFileGroup');
        if (parentContainer) {
            const displayValue = window.getComputedStyle(parentContainer).display;
            if (displayValue === 'none') {
                return; // Skip hidden containers
            }
        }
        
        // Verificar se o campo está vazio (funciona para texto, select e file)
        let isEmpty = false;
        if (input.type === 'file') {
            isEmpty = !input.files || input.files.length === 0;
        } else {
            isEmpty = !input.value || input.value.trim() === '';
        }
        
        if (isEmpty) {
            isValid = false;
        }
    });

    return isValid;
}

// Validate All Required Fields (bloqueia envio)
function validateAllRequiredFields() {
    const allPages = document.querySelectorAll('.form-page');
    const emptyFields = [];
    
    allPages.forEach((page, index) => {
        const pageNum = index + 1;
        const inputs = page.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            // Verificar se o campo está dentro de um container oculto (pfFields/pjFields)
            const parentContainer = input.closest('#pfFields, #pjFields, #pfAttachments, #pjAttachments, #phoneFileGroup');
            
            // Se está em container oculto, pular (usando getComputedStyle para pegar o valor real)
            if (parentContainer) {
                const displayValue = window.getComputedStyle(parentContainer).display;
                if (displayValue === 'none') {
                    return;
                }
            }
            
            // Verificar se o campo está vazio (funciona para texto, select e file)
            let isEmpty = false;
            if (input.type === 'file') {
                isEmpty = !input.files || input.files.length === 0;
            } else {
                isEmpty = !input.value || input.value.trim() === '';
            }
            
            if (isEmpty) {
                const label = input.closest('.form-group')?.querySelector('label')?.textContent || input.name || 'Campo sem nome';
                emptyFields.push({
                    page: pageNum,
                    field: label.replace('*', '').trim()
                });
            }
        });
    });
    
    if (emptyFields.length > 0) {
        let message = 'Os seguintes campos obrigatórios não foram preenchidos:\n\n';
        emptyFields.forEach(item => {
            message += `• Página ${item.page}: ${item.field}\n`;
        });
        alert(message);
        return false;
    }
    
    return true;
}

// Update Page Display
function updatePageDisplay() {
    // Hide all pages
    document.querySelectorAll('.form-page').forEach(page => {
        page.classList.remove('active');
    });

    // Show current page
    const currentPageElement = document.querySelector(`.form-page[data-page="${currentPage}"]`);
    currentPageElement.classList.add('active');

    // Update progress bar
    const progress = (currentPage / totalPages) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('currentPage').textContent = currentPage;

    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        const pageNum = parseInt(button.getAttribute('data-page'));
        if (pageNum === currentPage) {
            button.classList.add('active');
            // Apply theme colors immediately
            const gradient = currentTheme.name === 'blue' 
                ? 'linear-gradient(135deg, #018dd7 0%, #0277bd 100%)'
                : 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)';
            button.style.background = gradient;
            button.style.borderColor = currentTheme.primary;
            button.style.color = 'white';
        } else {
            button.classList.remove('active');
            button.style.background = '#f5f5f5';
            button.style.borderColor = '#e0e0e0';
            button.style.color = '#666';
        }
    });

    // Update buttons
    prevBtn.style.display = currentPage === 1 ? 'none' : 'block';
    nextBtn.style.display = currentPage === totalPages ? 'none' : 'block';
    submitBtn.style.display = currentPage === totalPages ? 'block' : 'none';

    // Update page content based on contract type
    updatePageRequirements();
    
    // Reapply theme styles to ensure buttons are updated
    updateDynamicStyles();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'auto' });
}

// Go to specific page
function goToPage(pageNum) {
    if (pageNum >= 1 && pageNum <= totalPages) {
        currentPage = pageNum;
        updatePageDisplay();
    }
}

// Submit Form
async function submitForm(e) {
    e.preventDefault();

    // Validate all required fields before submitting
    if (!validateAllRequiredFields()) {
        return;
    }

    try {
        // Show loading modal
        showLoadingModal();

        // Collect all form data
        const formDataObj = new FormData(form);
        const data = Object.fromEntries(formDataObj);

        // Ajustar dados antes de enviar para Google Sheets
        const sheetsData = {
            ...data,
            contractType: formData.contractType,
            collaborator: document.getElementById('collaborator').selectedOptions[0].text,
            access: document.getElementById('access').selectedOptions[0].text,
            availability: document.getElementById('availability').value ? document.getElementById('availability').selectedOptions[0].text : '',
            offer: document.getElementById('offer').value ? document.getElementById('offer').selectedOptions[0].text : '',
            fixedPhone: document.getElementById('fixedPhone').selectedOptions[0].text
        };
        
        // Adicionar campos específicos de PF
        if (formData.contractType === 'pf') {
            sheetsData.houseSize = data.houseSize || '';
            sheetsData.cancellationReason = data.cancellationReason || '';
        }
        
        // Debug: verificar dados sendo enviados
        console.log('Dados enviados para Google Sheets:', sheetsData);

        // Get client name for PDF filename
        const clientName = formData.contractType === 'pf' 
            ? document.getElementById('name').value 
            : document.getElementById('companyName').value;

        // Generate PDF
        const pdf = await generatePDF(data);

        // Mark PDF as completed (após gerar)
        updateLoadingStatus('statusPdf', true);

        // Send data to Google Sheets
        const sheetsResult = await sendToGoogleSheets(sheetsData);

        // =============================
        // Upload dos arquivos (incluindo PDF) para o Google Drive
        // =============================
        try {
            const folderUrl = await uploadFilesToDrive(formDataObj, pdf);
            if (folderUrl) {
                console.log('Arquivos enviados para o Drive com sucesso:', folderUrl);
            } else {
                console.warn('Falha ao enviar arquivos para o Drive. Veja o log acima.');
            }
        } catch (err) {
            console.error('Erro ao tentar enviar arquivos para o Drive:', err);
        }

        // Altera mensagem para sucesso
        const statusText = document.querySelector('#statusPdf .status-text');
        if (statusText) statusText.textContent = 'Enviado com sucesso ✅';

        // Espera 2 segundos para o usuário ver a mensagem de sucesso
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Hide loading modal
        hideLoadingModal();

        // Reset form and go to first page
        resetForm();
        
    } catch (error) {
        console.error('Erro ao gerar arquivo:', error);
        hideLoadingModal();
        alert('Erro ao gerar arquivo. Verifique o console para mais detalhes.');
    }
}

// Update Theme Elements
function updateThemeElements() {
    // Update progress bar background
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.background = `linear-gradient(90deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`;
    }
    
    // Update primary buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.style.backgroundColor = currentTheme.primary;
        btn.style.borderColor = currentTheme.primary;
    });
    
    // Update tab buttons
    document.querySelectorAll('.tab-button.active').forEach(btn => {
        btn.style.backgroundColor = currentTheme.primary;
        btn.style.borderColor = currentTheme.primary;
    });
    
    // Update background gradient
    document.body.style.background = `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`;
    
    // Update focus states in CSS (we'll use a style tag)
    updateDynamicStyles();
}

// Update Dynamic Styles
function updateDynamicStyles() {
    let styleId = 'dynamic-theme-styles';
    let styleTag = document.getElementById(styleId);
    
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    
    styleTag.innerHTML = `
        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="file"]:focus,
        select:focus,
        textarea:focus {
            border-color: ${currentTheme.primary} !important;
            box-shadow: 0 0 0 3px rgba(${hexToRgb(currentTheme.primary).join(',')}, 0.1) !important;
        }
        
        input[type="text"]:hover,
        input[type="email"]:hover,
        input[type="file"]:hover,
        select:hover,
        textarea:hover {
            border-color: ${currentTheme.secondary} !important;
            background-color: ${currentTheme.name === 'blue' ? '#f9fcfd' : '#f1f8f4'} !important;
        }
        
        .btn-primary:hover {
            background-color: ${currentTheme.secondary} !important;
            border-color: ${currentTheme.secondary} !important;
        }
        
        .btn-search {
            background-color: ${currentTheme.primary} !important;
        }
        
        .btn-search:hover {
            background-color: ${currentTheme.secondary} !important;
        }
        
        .tab-button:hover:not(.active) {
            border-color: ${currentTheme.primary} !important;
            color: ${currentTheme.primary} !important;
        }
        
        .tab-button:hover:not(.active) .tab-icon {
            filter: brightness(0) saturate(100%) ${currentTheme.name === 'blue' ? 'invert(44%) sepia(99%) saturate(2223%) hue-rotate(185deg) brightness(93%) contrast(101%)' : 'invert(32%) sepia(53%) saturate(1271%) hue-rotate(94deg) brightness(96%) contrast(90%)'} !important;
            opacity: 1 !important;
        }
        
        input[type="file"]::file-selector-button {
            background-color: ${currentTheme.primary} !important;
        }
        
        input[type="file"]::file-selector-button:hover {
            background-color: ${currentTheme.secondary} !important;
        }
        
        .btn-secondary {
            background-color: ${currentTheme.primary} !important;
            color: white !important;
        }
        
        .btn-secondary:hover {
            background-color: ${currentTheme.secondary} !important;
        }
        
        .btn-success:hover {
            box-shadow: 0 5px 15px rgba(${hexToRgb(currentTheme.primary).join(',')}, 0.3) !important;
        }
    `;
    
    // Update tab button styles inline
    document.querySelectorAll('.tab-button').forEach(button => {
        if (button.classList.contains('active')) {
            const gradient = currentTheme.name === 'blue' 
                ? 'linear-gradient(135deg, #018dd7 0%, #0277bd 100%)'
                : 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)';
            button.style.background = gradient;
            button.style.borderColor = currentTheme.primary;
            button.style.color = 'white';
        } else {
            button.style.background = '#f5f5f5';
            button.style.borderColor = '#e0e0e0';
            button.style.color = '#666';
        }
    });
    
    // Update navigation buttons with gradient
    const gradient = currentTheme.name === 'blue' 
        ? 'linear-gradient(135deg, #018dd7 0%, #0277bd 100%)'
        : 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)';
    
    document.querySelectorAll('.btn-primary, #nextBtn').forEach(btn => {
        btn.style.background = gradient;
        btn.style.borderColor = currentTheme.primary;
    });
    
    // Submit button stays gray with gradient and theme-colored icon
    document.querySelectorAll('.btn-success, #submitBtn').forEach(btn => {
        btn.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)';
        btn.style.borderColor = '#e0e0e0';
        btn.style.color = currentTheme.primary;
        
        // Apply theme color to the icon
        const icon = btn.querySelector('.nav-icon');
        if (icon) {
            if (currentTheme.name === 'blue') {
                icon.style.filter = 'brightness(0) saturate(100%) invert(44%) sepia(99%) saturate(2223%) hue-rotate(185deg) brightness(93%) contrast(101%)';
            } else {
                icon.style.filter = 'brightness(0) saturate(100%) invert(32%) sepia(53%) saturate(1271%) hue-rotate(94deg) brightness(96%) contrast(90%)';
            }
        }
    });
    
    document.querySelectorAll('.btn-secondary, #prevBtn').forEach(btn => {
        btn.style.background = gradient;
        btn.style.borderColor = currentTheme.primary;
    });
    
    // Update search buttons
    document.querySelectorAll('.btn-search').forEach(btn => {
        btn.style.backgroundColor = currentTheme.primary;
    });
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

// Helper function to format phone numbers
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    }
    return phone;
}

// Helper function to format CNPJ
function formatCNPJ(cnpj) {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length === 14) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cnpj;
}

// Handle Inscrição Estadual input
function handleInscriptionState(e) {
    let value = e.target.value;
    
    // Remove tudo que não é número ou letra
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '');
    
    // Limita a 13 caracteres
    e.target.value = cleaned.slice(0, 13);
}

// Add input formatting
document.addEventListener('input', (e) => {
    if (e.target.id === 'phone1' || e.target.id === 'phone2' || 
        e.target.id === 'businessPhone1' || e.target.id === 'businessPhone2' ||
        e.target.id === 'technicianPhone') {
        e.target.value = formatPhone(e.target.value);
    }

    if (e.target.id === 'cnpj') {
        e.target.value = formatCNPJ(e.target.value);
    }

    if (e.target.id === 'cep') {
        const cleaned = e.target.value.replace(/\D/g, '');
        if (cleaned.length <= 8) {
            e.target.value = cleaned.replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9);
        }
    }
});

// Force lowercase on email fields
function forceEmailLowercase(e) {
    e.target.value = e.target.value.toLowerCase();
}

// Force uppercase on specific fields
function forceUppercase(e) {
    e.target.value = e.target.value.toUpperCase();
}

// Email validation function
function validateEmail(e) {
    const email = e.target.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido');
        e.target.value = '';
        e.target.focus();
    }
}

// Limit phone input to 15 characters ((00) 0 0000-0000)
function limitPhoneInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    
    if (value.length >= 11) {
        e.target.value = value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    } else if (value.length > 7) {
        e.target.value = value.replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4');
    } else if (value.length > 3) {
        e.target.value = value.replace(/(\d{2})(\d{1})(\d{0,4})/, '($1) $2 $3');
    } else if (value.length > 2) {
        e.target.value = value.replace(/(\d{2})(\d{0,1})/, '($1) $2');
    } else {
        e.target.value = value;
    }
}

// Limit CEP input to 8 digits (00000-000)
function limitCepInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 8) {
        value = value.slice(0, 8);
    }
    
    if (value.length > 5) {
        e.target.value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    } else {
        e.target.value = value;
    }
}

// ============================================
// GOOGLE SHEETS INTEGRATION
// ============================================

// Cole aqui a URL do Google Apps Script após seguir as instruções em INSTRUCOES_GOOGLE_SHEETS.md
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdfaJ0r9mk5QCrRdAWrw7uNBxunVRCsgRteuWhov4Ng9guC02OH7QwTdJ8b2-pFzOiaA/exec';

async function sendToGoogleSheets(formData) {
    // Se a URL não foi configurada, não tenta enviar
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'COLE_AQUI_A_URL_DO_APPS_SCRIPT') {
        console.warn('Google Sheets não configurado. Siga as instruções em INSTRUCOES_GOOGLE_SHEETS.md');
        return { status: 'not_configured' };
    }

    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            await response.text();
            return { status: 'success' };
        } else {
            console.error('Erro na resposta:', response.status, response.statusText);
            return { status: 'error', error: response.statusText };
        }
    } catch (error) {
        console.error('Erro ao enviar para Google Sheets:', error);
        return { status: 'error', error: error.message };
    }
}

// Initialize Drag and Drop for all file inputs
function initializeDragAndDrop() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        // Add drag and drop styling
        input.style.position = 'relative';
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            input.addEventListener(eventName, preventDefaults, false);
        });
        
        // Highlight drop zone when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            input.addEventListener(eventName, () => {
                input.style.backgroundColor = 'rgba(1, 141, 215, 0.08)';
                input.style.border = '1px dashed ' + currentTheme.primary;
                input.style.transition = 'all 0.2s ease';
                input.style.borderRadius = '4px';
                input.style.padding = '8px';
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            input.addEventListener(eventName, () => {
                input.style.backgroundColor = '';
                input.style.border = '';
                input.style.borderRadius = '';
                input.style.padding = '';
            }, false);
        });
        
        // Handle dropped files
        input.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            // Get accepted file types from input
            const acceptedTypes = input.getAttribute('accept');
            
            // Create a new FileList-like object
            const dataTransfer = new DataTransfer();
            
            // Add existing files (if any)
            if (input.files) {
                Array.from(input.files).forEach(file => dataTransfer.items.add(file));
            }
            
            // Filter and add new files based on accept attribute
            const invalidFiles = [];
            Array.from(files).forEach(file => {
                if (isFileTypeAccepted(file, acceptedTypes)) {
                    dataTransfer.items.add(file);
                } else {
                    invalidFiles.push(file.name);
                }
            });
            
            // Show error if there are invalid files
            if (invalidFiles.length > 0) {
                const acceptMsg = acceptedTypes || 'todos os tipos';
                alert(`Os seguintes arquivos não são aceitos:\n${invalidFiles.join('\n')}\n\nTipos aceitos: ${acceptMsg}`);
            }
            
            // Update input
            input.files = dataTransfer.files;
            
            // Show feedback
            updateFileInputLabel(input);
        }, false);
        
        // Handle file selection via click (dialog)
        input.addEventListener('change', () => {
            updateFileInputLabel(input);
        });
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function isFileTypeAccepted(file, acceptAttribute) {
    // Se não tem restrição, aceita tudo
    if (!acceptAttribute || acceptAttribute === '') {
        return true;
    }
    
    const acceptedTypes = acceptAttribute.split(',').map(type => type.trim());
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    
    return acceptedTypes.some(acceptedType => {
        // Se for extensão (.pdf, .jpg, etc)
        if (acceptedType.startsWith('.')) {
            return fileName.endsWith(acceptedType.toLowerCase());
        }
        
        // Se for MIME type genérico (image/*, video/*, etc)
        if (acceptedType.endsWith('/*')) {
            const category = acceptedType.split('/')[0];
            return fileType.startsWith(category + '/');
        }
        
        // Se for MIME type específico (application/pdf, image/jpeg, etc)
        return fileType === acceptedType;
    });
}

function updateFileInputLabel(input) {
    // Função mantida para compatibilidade, mas não altera mais o label
    // O label permanece com seu texto original sempre
}

// Generate PDF with form data
async function generatePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    let y = 20;
    const lineHeight = 7;
    const margin = 20;
    
    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('FICHA DE CADASTRO', 105, y, { align: 'center' });
    y += lineHeight * 2;
    
    // PAGE 1: TIPO DE CONTRATO
    doc.setFontSize(14);
    doc.text('1. TIPO DE CONTRATO', margin, y);
    y += lineHeight;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Tipo de Contrato: ${document.getElementById('contractType').selectedOptions[0].text}`, margin, y);
    y += lineHeight;
    doc.text(`Colaborador: ${document.getElementById('collaborator').selectedOptions[0].text}`, margin, y);
    y += lineHeight * 2;
    
    // PAGE 2: INFORMAÇÕES
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('2. INFORMAÇÕES', margin, y);
    y += lineHeight;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Acesso: ${document.getElementById('access').selectedOptions[0].text}`, margin, y);
    y += lineHeight;
    
    if (formData.contractType === 'pf') {
        doc.text(`Nome: ${document.getElementById('name').value}`, margin, y);
        y += lineHeight;
        doc.text(`E-mail: ${document.getElementById('email').value}`, margin, y);
        y += lineHeight;
        doc.text(`Telefone 1: ${document.getElementById('phone1').value}`, margin, y);
        y += lineHeight;
        doc.text(`Telefone 2: ${document.getElementById('phone2').value}`, margin, y);
        y += lineHeight;
        const houseSize = document.getElementById('houseSize').value;
        if (houseSize) {
            doc.text(`Tamanho da Casa: ${houseSize}`, margin, y);
            y += lineHeight;
        }
        // const cancellationReason = document.getElementById('cancellationReason').value;
        // if (cancellationReason) {
        //     doc.text(`Motivo do Cancelamento: ${cancellationReason}`, margin, y);
        //     y += lineHeight;
        // }
    } else {
        doc.text(`Razão Social: ${document.getElementById('companyName').value}`, margin, y);
        y += lineHeight;
        doc.text(`CNPJ: ${document.getElementById('cnpj').value}`, margin, y);
        y += lineHeight;
        doc.text(`Inscrição Estadual: ${document.getElementById('inscriptionState').value}`, margin, y);
        y += lineHeight;
        doc.text(`E-mail Corporativo: ${document.getElementById('corporateEmail').value}`, margin, y);
        y += lineHeight;
        doc.text(`Telefone Comercial 1: ${document.getElementById('businessPhone1').value}`, margin, y);
        y += lineHeight;
        doc.text(`Telefone Comercial 2: ${document.getElementById('businessPhone2').value}`, margin, y);
        y += lineHeight;
    }
    y += lineHeight;
    
    // PAGE 3: ENDEREÇO
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('3. ENDEREÇO', margin, y);
    y += lineHeight;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`CEP: ${document.getElementById('cep').value}`, margin, y);
    y += lineHeight;
    doc.text(`Logradouro: ${document.getElementById('street').value}`, margin, y);
    y += lineHeight;
    doc.text(`Número: ${document.getElementById('number').value}`, margin, y);
    y += lineHeight;
    doc.text(`Complemento: ${document.getElementById('complement').value}`, margin, y);
    y += lineHeight;
    doc.text(`Bairro: ${document.getElementById('neighborhood').value}`, margin, y);
    y += lineHeight;
    doc.text(`Cidade: ${document.getElementById('city').value}`, margin, y);
    y += lineHeight * 2;
    
    // Check if need new page
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    
    // PAGE 4: NEGOCIAÇÃO
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('4. NEGOCIAÇÃO', margin, y);
    y += lineHeight;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Oferta Desejada: ${document.getElementById('offer').value}`, margin, y);
    y += lineHeight;
    doc.text(`Data de Vencimento: ${document.getElementById('dueDate').value}`, margin, y);
    y += lineHeight;
    // Destacar Telefonia Fixa se for 'Sim'
    const fixedPhoneSelect = document.getElementById('fixedPhone');
    const fixedPhoneText = fixedPhoneSelect.selectedOptions[0].text;
    const fixedPhoneValue = fixedPhoneSelect.value;
    if (fixedPhoneValue === 'newNumber' || fixedPhoneValue === 'portability') {
        // Marca-texto amarelo ajustado ao texto
        const highlightText = `Telefonia Fixa: ${fixedPhoneText}`;
        const textWidth = doc.getTextWidth(highlightText);
        const paddingX = 2;
        const paddingY = 2;
        doc.setFillColor(255, 255, 0); // amarelo
        doc.rect(margin - paddingX, y - lineHeight + 1 - paddingY, textWidth + 2 * paddingX, lineHeight + 2 * paddingY, 'F');
        doc.text(highlightText, margin, y);
    } else {
        doc.text(`Telefonia Fixa: ${fixedPhoneText}`, margin, y);
    }
    y += lineHeight * 2;
    
    // PAGE 6: AGENDAMENTO
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('5. AGENDAMENTO', margin, y);
    y += lineHeight;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Nome do Responsável: ${document.getElementById('technicianName').value}`, margin, y);
    y += lineHeight;
    doc.text(`Telefone: ${document.getElementById('technicianPhone').value}`, margin, y);
    y += lineHeight;
    doc.text(`Disponibilidade: ${document.getElementById('availability').selectedOptions[0].text}`, margin, y);
    y += lineHeight;
    const obs = document.getElementById('observations').value;
    if (obs) {
        // Quebra automática de linha para observações
        const maxWidth = 170; // Largura máxima do texto (210mm - margens)
        const lines = doc.splitTextToSize(`Observações: ${obs}`, maxWidth);
        doc.text(lines, margin, y);
        y += lineHeight * lines.length;
    }
    
    // Return blob with proper MIME type
    return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
}

// (Removido: função de download do ZIP não é mais necessária)

// Loading Modal Functions
function showLoadingModal() {
    const modal = document.getElementById('loadingModal');
    modal.classList.add('active');
    
    // Reset status icon
    document.getElementById('statusPdf').classList.remove('completed');
    // Garante que a mensagem volte para o padrão ao abrir
    const statusText = document.querySelector('#statusPdf .status-text');
    if (statusText) statusText.textContent = 'Enviando dados...';
    
    // Apply theme color to spinner
    const spinner = document.querySelector('.loading-spinner');
    if (formData.contractType === 'pj') {
        spinner.style.borderTopColor = '#2E7D32';
    } else {
        spinner.style.borderTopColor = '#018dd7';
    }
}

function hideLoadingModal() {
    const modal = document.getElementById('loadingModal');
    modal.classList.remove('active');
}

function updateLoadingStatus(elementId, success) {
    const element = document.getElementById(elementId);
    if (!element) return;
    // Não há mais .status-icon, só altera classe se quiser efeito visual
    if (success) {
        element.classList.add('completed');
    } else {
        element.classList.remove('completed');
    }
}

function resetForm() {
    // Reset form fields
    document.getElementById('multiStepForm').reset();
    
    // Remove all red borders from validation
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '';
    });
    
    // Go to first page
    currentPage = 1;
    
    // Reset contract type to default (PF)
    document.getElementById('contractType').value = 'pf';
    formData.contractType = 'pf';
    handleContractTypeChange();
    
    // Update page display
    updatePageDisplay();
}





