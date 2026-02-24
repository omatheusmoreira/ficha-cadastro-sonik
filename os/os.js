// Gerenciamento de tabs da página de OS
let currentPage = 1;

// Previne o navegador de restaurar a posição de scroll
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Força scroll para o topo imediatamente
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    initializeTabs();
    updateTabDisplay();
    initializeCepSearch();
    initializeUppercaseInputs();
    initializePhoneMask();
    applyTabHoverStyles();
    initializeFormButtons();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageNum = parseInt(button.getAttribute('data-page'));
            goToPage(pageNum);
        });
    });
}

function goToPage(pageNum) {
    currentPage = pageNum;
    updateTabDisplay();
}

function updateTabDisplay() {
    // Hide all pages
    document.querySelectorAll('.form-page').forEach(page => {
        page.classList.remove('active');
    });

    // Show current page
    const currentPageElement = document.querySelector(`.form-page[data-page="${currentPage}"]`);
    if (currentPageElement) {
        currentPageElement.classList.add('active');
    }

    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        const pageNum = parseInt(button.getAttribute('data-page'));
        if (pageNum === currentPage) {
            button.classList.add('active');
            button.style.background = 'linear-gradient(135deg, #018dd7 0%, #0277bd 100%)';
            button.style.borderColor = '#018dd7';
            button.style.color = 'white';
        } else {
            button.classList.remove('active');
            button.style.background = '#f5f5f5';
            button.style.borderColor = '#e0e0e0';
            button.style.color = '#666';
        }
    });
}

// Inicializa busca de CEP
function initializeCepSearch() {
    const searchBtn = document.getElementById('searchNovoCep');
    const cepInput = document.getElementById('osNovoCep');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', searchNovoCep);
    }
    
    if (cepInput) {
        cepInput.addEventListener('blur', searchNovoCep);
        cepInput.addEventListener('input', limitCepInput);
    }
}

// Busca CEP via ViaCEP API
async function searchNovoCep(e) {
    const cepInput = document.getElementById('osNovoCep');
    
    if (e.target.id === 'osNovoCep' && e.type === 'blur' && !cepInput.value) return;
    
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('CEP deve conter 8 dígitos');
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert('CEP não encontrado');
            return;
        }

        // Preenche os campos de endereço
        document.getElementById('osNovoLogradouro').value = data.logradouro || '';
        document.getElementById('osNovoBairro').value = data.bairro || '';
        document.getElementById('osNovoCidade').value = data.localidade || '';
        
        // Formata CEP para exibição
        cepInput.value = `${cep.substring(0, 5)}-${cep.substring(5)}`;
        
        // Foca no campo de número
        document.getElementById('osNovoNumero').focus();
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Tente novamente.');
    }
}

// Limita input de CEP (8 dígitos: 00000-000)
function limitCepInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) {
        value = value.substring(0, 8);
    }
    if (value.length > 5) {
        e.target.value = `${value.substring(0, 5)}-${value.substring(5)}`;
    } else {
        e.target.value = value;
    }
}

// Inicializa forçar caixa alta em campos de texto
function initializeUppercaseInputs() {
    const textInputs = [
        'osClienteNome',
        'osEnderecoAntigo',
        'osNovoLogradouro',
        'osNovoNumero',
        'osNovoComplemento',
        'osNovoBairro',
        'osNovoCidade',
        'osResponsavel',
        'osPontoClienteNome',
        'osPontoRoteadorAtual',
        'osPontoNovoPonto',
        'osPontoResponsavel',
        'osEquipClienteNome',
        'osEquipResponsavel'
    ];
    
    textInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', forceUppercase);
        }
    });
}

// Força texto em caixa alta
function forceUppercase(e) {
    e.target.value = e.target.value.toUpperCase();
}

// Inicializa máscara de telefone
function initializePhoneMask() {
    const phoneInputs = ['osTelefone', 'osPontoTelefone', 'osEquipTelefone'];
    phoneInputs.forEach(id => {
        const phoneInput = document.getElementById(id);
        if (phoneInput) {
            phoneInput.addEventListener('input', limitPhoneInput);
        }
    });
}

// Limita input de telefone (11 dígitos: (00) 00000-0000)
function limitPhoneInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    if (value.length > 6) {
        e.target.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
    } else if (value.length > 2) {
        e.target.value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
    } else if (value.length > 0) {
        e.target.value = `(${value}`;
    } else {
        e.target.value = value;
    }
}

// Aplica estilos de hover nos tabs
function applyTabHoverStyles() {
    const styleId = "os-tab-styles";
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
        .tab-button:hover:not(.active) {
            border-color: #018dd7 !important;
            color: #018dd7 !important;
        }

        .tab-button:hover:not(.active) .tab-icon {
            filter: brightness(0) saturate(100%) invert(44%) sepia(99%) saturate(2223%) hue-rotate(185deg) brightness(93%) contrast(101%) !important;
            opacity: 1 !important;
        }

        /* Ícone azul no botão enviar */
        #osSubmitBtn .nav-icon,
        #osSubmitBtn2 .nav-icon,
        #osSubmitBtn3 .nav-icon {
            filter: brightness(0) saturate(100%) invert(44%) sepia(99%) saturate(2223%) hue-rotate(185deg) brightness(93%) contrast(101%);
        }
    `;
}

// Inicializa botões do formulário
function initializeFormButtons() {
    // Botões limpar formulário (todas as páginas)
    const resetBtns = ['osResetBtn', 'osResetBtn2', 'osResetBtn3'];
    resetBtns.forEach(btnId => {
        const resetBtn = document.getElementById(btnId);
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja limpar todo o formulário? Todos os dados serão perdidos.')) {
                    resetForm();
                }
            });
        }
    });
    
    // Botões enviar (todas as páginas - temporariamente desabilitados)
    const submitBtns = ['osSubmitBtn', 'osSubmitBtn2', 'osSubmitBtn3'];
    submitBtns.forEach(btnId => {
        const submitBtn = document.getElementById(btnId);
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Funcionalidade de envio em desenvolvimento.');
            });
        }
    });
}

// Limpa o formulário
function resetForm() {
    // Limpa todos os inputs de texto
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.value = '';
    });
    
    // Limpa arquivo
    const fileInput = document.getElementById('osComprovanteEndereco');
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Reseta selects
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
