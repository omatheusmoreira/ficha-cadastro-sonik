// ============================================================
// ATENDIMENTOS.JS — Gerador de Texto Padronizado
// ============================================================

let currentPage = 1;

// Previne restauração de scroll pelo navegador
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// ── Mapa de labels amigáveis para disponibilidade ──
const disponibilidadeLabel = {
    'Manhã': 'MANHÃ',
    'Tarde': 'TARDE',
    'Somente aos Sábados': 'SOMENTE AOS SÁBADOS',
    'Horário Comercial': 'HORÁRIO COMERCIAL'
};

// ── Mapa de labels amigáveis para taxa ──
const taxaLabel = {
    'Renovou para se isentar': 'RENOVOU PARA SE ISENTAR',
    '1x R$100,00': '1X R$100,00',
    '2x R$50,00': '2X R$50,00'
};

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    initializeTabs();
    updateTabDisplay();
    initializeUppercaseInputs();
    initializePhoneMask();
    initializeCepSearch();
    applyTabHoverStyles();
    initializeValidationFeedback();
    initializeFormButtons();
    initializePrevisao();
    initializeLiveOutput();
    initializeCpfMaskHe2();
});

// ============================================================
// TABS
// ============================================================
function initializeTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            goToPage(parseInt(button.getAttribute('data-page')));
        });
    });
}

function goToPage(pageNum) {
    currentPage = pageNum;
    updateTabDisplay();
    window.scrollTo({ top: 0, behavior: 'auto' });
}

function updateTabDisplay() {
    document.querySelectorAll('.form-page').forEach(page => page.classList.remove('active'));

    const active = document.querySelector(`.form-page[data-page="${currentPage}"]`);
    if (active) active.classList.add('active');

    document.querySelectorAll('.tab-button').forEach(button => {
        const n = parseInt(button.getAttribute('data-page'));
        if (n === currentPage) {
            button.classList.add('active');
            button.style.background = 'linear-gradient(135deg, #018dd7 0%, #0277bd 100%)';
            button.style.borderColor = '#018dd7';
            button.style.color = 'white';
            const icon = button.querySelector('.tab-icon');
            if (icon) {
                icon.style.filter = 'brightness(0) saturate(100%) invert(100%)';
                icon.style.opacity = '1';
            }
        } else {
            button.classList.remove('active');
            button.style.background = '#f5f5f5';
            button.style.borderColor = '#e0e0e0';
            button.style.color = '#666';
            const icon = button.querySelector('.tab-icon');
            if (icon) {
                icon.style.filter = 'brightness(0) saturate(100%) opacity(0.7)';
                icon.style.opacity = '0.7';
            }
        }
    });
}

// ============================================================
// HOVER STYLES (injetados via <style>)
// ============================================================
function applyTabHoverStyles() {
    const styleId = 'at-tab-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
        .tab-button:hover:not(.active) {
            border-color: #018dd7 !important;
            color: #018dd7 !important;
        }
        .tab-button:hover:not(.active) .tab-icon {
            filter: brightness(0) saturate(100%) invert(44%) sepia(99%) saturate(2223%)
                    hue-rotate(185deg) brightness(93%) contrast(101%) !important;
            opacity: 1 !important;
        }
        .tab-button:active:not(.active) {
            transform: scale(0.95);
            opacity: 0.8;
        }
    `;
}

// ============================================================
// UPPERCASE
// ============================================================
function initializeUppercaseInputs() {
    const ids = [
        'atEquipCliente', 'atEquipResponsavel',
        'atEndCliente', 'atEndEnderecoAntigo', 'atEndLogradouro',
        'atEndNumero', 'atEndComplemento', 'atEndBairro', 'atEndCidade', 'atEndResponsavel',
        'atPontoCliente', 'atPontoComodoAtual', 'atPontoNovoPonto', 'atPontoResponsavel',
        'atMeshCliente', 'atMeshComodoRoteador', 'atMeshComodosMesh', 'atMeshResponsavel',
        'atHe2NomeSonik', 'atHe2NomeCemig', 'atHe2RgCemig',
        'atHe2NomeSolicitante', 'atHe2Logradouro', 'atHe2Bairro',
        'atHe2Numero', 'atHe2Cidade', 'atHe2UnidadeConsumidora'
    ];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', e => { e.target.value = e.target.value.toUpperCase(); });
    });
}

// ============================================================
// PHONE MASK
// ============================================================
function initializePhoneMask() {
    ['atEquipTelefone', 'atEndTelefone', 'atPontoTelefone', 'atMeshTelefone',
     'atHe2TelefoneSonik', 'atHe2TelefoneSolicitante'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', limitPhoneInput);
    });
}

function limitPhoneInput(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);

    if (v.length === 11) {
        e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 3)} ${v.substring(3, 7)}-${v.substring(7)}`;
    } else if (v.length > 6) {
        e.target.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
    } else if (v.length > 2) {
        e.target.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
    } else if (v.length > 0) {
        e.target.value = `(${v}`;
    } else {
        e.target.value = v;
    }
}

// ============================================================
// CEP SEARCH
// ============================================================
function initializeCepSearch() {
    const btn = document.getElementById('atSearchNovoCep');
    const cepInput = document.getElementById('atEndNovoCep');
    if (btn) btn.addEventListener('click', searchCep);
    if (cepInput) {
        cepInput.addEventListener('blur', e => { if (e.target.value) searchCep(); });
        cepInput.addEventListener('input', limitCepInput);
    }
}

function limitCepInput(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 8) v = v.substring(0, 8);
    e.target.value = v.length > 5 ? `${v.substring(0, 5)}-${v.substring(5)}` : v;
}

async function searchCep() {
    const cepInput = document.getElementById('atEndNovoCep');
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) { alert('CEP deve conter 8 dígitos'); return; }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (data.erro) { alert('CEP não encontrado'); return; }

        document.getElementById('atEndLogradouro').value = (data.logradouro || '').toUpperCase();
        document.getElementById('atEndBairro').value = (data.bairro || '').toUpperCase();
        document.getElementById('atEndCidade').value = (data.localidade || '').toUpperCase();
        cepInput.value = `${cep.substring(0, 5)}-${cep.substring(5)}`;
        document.getElementById('atEndNumero').focus();
    } catch (err) {
        console.error('Erro ao buscar CEP:', err);
        alert('Erro ao buscar CEP. Tente novamente.');
    }
}

// ============================================================
// BOTÕES: GERAR + LIMPAR
// ============================================================
function initializeFormButtons() {
    // Limpar
    document.getElementById('atEquipResetBtn')?.addEventListener('click', () => resetPage(1));
    document.getElementById('atEndResetBtn')?.addEventListener('click',  () => resetPage(2));
    document.getElementById('atPontoResetBtn')?.addEventListener('click', () => resetPage(3));
    document.getElementById('atMeshResetBtn')?.addEventListener('click',  () => resetPage(4));
    document.getElementById('atHe2ResetBtn')?.addEventListener('click',   () => resetPage(5));

    // CEP HE²
    const he2CepBtn   = document.getElementById('atHe2SearchCep');
    const he2CepInput = document.getElementById('atHe2Cep');
    if (he2CepBtn)   he2CepBtn.addEventListener('click', searchCepHe2);
    if (he2CepInput) {
        he2CepInput.addEventListener('blur', e => { if (e.target.value) searchCepHe2(); });
        he2CepInput.addEventListener('input', limitCepInputHe2);
    }
}

// ============================================================
// LIVE OUTPUT (atualiza em tempo real conforme o usuário digita)
// ============================================================
function initializeLiveOutput() {
    const equip = ['atEquipAtendente','atEquipCliente','atEquipMotivo','atEquipAtual',
                   'atEquipNovo','atEquipTelefone','atEquipResponsavel','atEquipDisponibilidade','atEquipObs'];
    const end = ['atEndAtendente','atEndCliente','atEndEnderecoAntigo','atEndNovoCep',
                 'atEndLogradouro','atEndNumero','atEndComplemento','atEndBairro','atEndCidade',
                 'atEndTelefone','atEndResponsavel','atEndDisponibilidade','atEndTaxa','atEndPrevisaoData','atEndObs'];
    const ponto = ['atPontoAtendente','atPontoCliente','atPontoComodoAtual','atPontoNovoPonto',
                   'atPontoTelefone','atPontoResponsavel','atPontoDisponibilidade','atPontoTaxa','atPontoObs'];

    const watchFields = (ids, renderer) => {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            const evt = (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') ? 'change' : 'input';
            el.addEventListener(evt, renderer);
            if (el.tagName === 'TEXTAREA') el.addEventListener('input', renderer);
        });
    };

    const mesh = ['atMeshAtendente','atMeshCliente','atMeshMotivo','atMeshModelo',
                   'atMeshComodoRoteador','atMeshComodosMesh','atMeshTelefone','atMeshResponsavel',
                   'atMeshDisponibilidade','atMeshObs'];

    const he2 = ['atHe2Atendente',
                  'atHe2NomeSonik','atHe2CpfSonik','atHe2TelefoneSonik',
                  'atHe2NomeCemig','atHe2CpfCemig','atHe2RgCemig',
                  'atHe2NomeSolicitante','atHe2EmailSolicitante','atHe2TelefoneSolicitante',
                  'atHe2Cep','atHe2Logradouro','atHe2Bairro','atHe2Numero',
                  'atHe2Complemento','atHe2Cidade','atHe2UnidadeConsumidora'];

    watchFields(equip, renderEquipOutput);
    watchFields(end, renderEndOutput);
    watchFields(ponto, renderPontoOutput);
    watchFields(mesh, renderMeshOutput);
    watchFields(he2, renderHe2Output);
}

// ── helpers ──
function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function selText(id) {
    const el = document.getElementById(id);
    if (!el || !el.value) return '';
    return el.selectedOptions[0]?.text || el.value;
}

function buildNovoEndereco() {
    const log  = val('atEndLogradouro');
    const num  = val('atEndNumero');
    const comp = val('atEndComplemento');
    const bair = val('atEndBairro');
    const cid  = val('atEndCidade');
    const cep  = val('atEndNovoCep');

    let addr = log;
    if (num)  addr += `, ${num}`;
    if (comp) addr += ` - ${comp}`;
    if (bair) addr += `, ${bair}`;
    if (cid)  addr += ` - ${cid}`;
    if (cep)  addr += ` (CEP: ${cep})`;
    return addr;
}

function setOutput(boxId, text) {
    const box = document.getElementById(boxId);
    if (!box) return;
    if (text) {
        box.textContent = text;
        box.classList.add('has-content');
    } else {
        box.innerHTML = '<span class="output-placeholder">Preencha os campos acima para gerar o texto padronizado.</span>';
        box.classList.remove('has-content');
    }
}

// ============================================================
// RENDERERS
// ============================================================

// PAGE 1 — TROCA DE EQUIPAMENTO
function renderEquipOutput() {
    const atendente     = selText('atEquipAtendente');
    const cliente       = val('atEquipCliente');
    const motivo        = selText('atEquipMotivo');
    const equipAtual    = selText('atEquipAtual');
    const equipNovo     = selText('atEquipNovo');
    const telefone      = val('atEquipTelefone');
    const responsavel   = val('atEquipResponsavel');
    const disponib      = selText('atEquipDisponibilidade');
    const obs           = val('atEquipObs');

    if (!isPageAllFilled(1)) { setOutput('atEquipOutput', ''); return; }

    let lines = [];
    lines.push(`** ATENDENTE: ${atendente.toUpperCase()}`);
    lines.push(`** NOME DO CLIENTE: ${cliente}`);
    lines.push(`** MOTIVO DA TROCA DO EQUIPAMENTO: ${motivo.toUpperCase()}`);
    lines.push(`** EQUIPAMENTO ANTIGO: ${equipAtual.toUpperCase()}`);
    lines.push(`** NOVO EQUIPAMENTO: ${equipNovo.toUpperCase()}`);
    lines.push(`** TELEFONE: ${telefone}`);
    lines.push(`** RESPONSÁVEL: ${responsavel}`);
    lines.push(`** DISPONIBILIDADE: ${disponib.toUpperCase()}`);
    if (obs) lines.push(`** OBS: ${obs.toUpperCase()}`);

    setOutput('atEquipOutput', lines.join('\n'));
}

// PAGE 2 — ALTERAÇÃO DE ENDEREÇO
function renderEndOutput() {
    if (!isPageAllFilled(2)) { setOutput('atEndOutput', ''); return; }

    const atendente   = selText('atEndAtendente');
    const cliente     = val('atEndCliente');
    const endAntigo   = val('atEndEnderecoAntigo');
    const endNovo     = buildNovoEndereco();
    const previsao    = getPrevisaoEndVal();
    const telefone    = val('atEndTelefone');
    const responsavel = val('atEndResponsavel');
    const disponib    = selText('atEndDisponibilidade');
    const taxa        = selText('atEndTaxa');
    const obs         = val('atEndObs');

    let lines = [];
    lines.push(`** ATENDENTE: ${atendente.toUpperCase()}`);
    lines.push(`** NOME DO CLIENTE: ${cliente}`);
    lines.push(`** ENDEREÇO ANTIGO: ${endAntigo}`);
    lines.push(`** NOVO ENDEREÇO: ${endNovo}`);
    lines.push(`** PREVISÃO DE MUDANÇA: ${previsao}`);
    lines.push(`** TELEFONE: ${telefone}`);
    lines.push(`** RESPONSÁVEL: ${responsavel}`);
    lines.push(`** DISPONIBILIDADE: ${disponib.toUpperCase()}`);
    lines.push(`** TAXA: ${taxa.toUpperCase()}`);
    if (obs) lines.push(`** OBS: ${obs.toUpperCase()}`);

    setOutput('atEndOutput', lines.join('\n'));
}

// PAGE 3 — MUDANÇA DE PONTO INTERNO
function renderPontoOutput() {
    const atendente   = selText('atPontoAtendente');
    const cliente     = val('atPontoCliente');
    const comodoAtual = val('atPontoComodoAtual');
    const novoPonto   = val('atPontoNovoPonto');
    const telefone    = val('atPontoTelefone');
    const responsavel = val('atPontoResponsavel');
    const disponib    = selText('atPontoDisponibilidade');
    const taxa        = selText('atPontoTaxa');
    const obs         = val('atPontoObs');

    if (!isPageAllFilled(3)) { setOutput('atPontoOutput', ''); return; }

    let lines = [];
    lines.push(`** ATENDENTE: ${atendente.toUpperCase()}`);
    lines.push(`** NOME DO CLIENTE: ${cliente}`);
    lines.push(`** CÔMODO ATUAL DO ROTEADOR: ${comodoAtual}`);
    lines.push(`** NOVO CÔMODO: ${novoPonto}`);
    lines.push(`** TELEFONE: ${telefone}`);
    lines.push(`** RESPONSÁVEL: ${responsavel}`);
    lines.push(`** DISPONIBILIDADE: ${disponib.toUpperCase()}`);
    lines.push(`** TAXA: ${taxa.toUpperCase()}`);
    if (obs) lines.push(`** OBS: ${obs.toUpperCase()}`);

    setOutput('atPontoOutput', lines.join('\n'));
}

// PAGE 4 — INSTALAÇÃO PONTO MESH
function renderMeshOutput() {
    if (!isPageAllFilled(4)) { setOutput('atMeshOutput', ''); return; }

    const atendente   = selText('atMeshAtendente');
    const cliente     = val('atMeshCliente');
    const motivo      = selText('atMeshMotivo');
    const modelo      = selText('atMeshModelo');
    const comodoRot   = val('atMeshComodoRoteador');
    const comodosMesh = val('atMeshComodosMesh');
    const telefone    = val('atMeshTelefone');
    const responsavel = val('atMeshResponsavel');
    const disponib    = selText('atMeshDisponibilidade');
    const obs         = val('atMeshObs');

    let lines = [];
    lines.push(`** ATENDENTE: ${atendente.toUpperCase()}`);
    lines.push(`** NOME DO CLIENTE: ${cliente}`);
    lines.push(`** MOTIVO DA SOLICITAÇÃO: ${motivo.toUpperCase()}`);
    lines.push(`** MODELO DO EQUIPAMENTO: ${modelo.toUpperCase()}`);
    lines.push(`** CÔMODO DO ROTEADOR PRINCIPAL: ${comodoRot}`);
    lines.push(`** CÔMODO DO PONTO MESH: ${comodosMesh}`);
    lines.push(`** TELEFONE: ${telefone}`);
    lines.push(`** RESPONSÁVEL: ${responsavel}`);
    lines.push(`** DISPONIBILIDADE: ${disponib.toUpperCase()}`);
    if (obs) lines.push(`** OBS: ${obs.toUpperCase()}`);

    setOutput('atMeshOutput', lines.join('\n'));
}

// PAGE 5 — HE² SOLAR
let he2Tipo = 'pf'; // 'pf' ou 'pj'

function selectHe2Tipo(tipo) {
    he2Tipo = tipo;
    document.getElementById('atHe2BtnPf')?.classList.toggle('active', tipo === 'pf');
    document.getElementById('atHe2BtnPj')?.classList.toggle('active', tipo === 'pj');
    renderHe2Output();
}

function maskCpfAtendimentos(el) {
    let v = el.value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 3)       el.value = v;
    else if (v.length <= 6)  el.value = `${v.slice(0,3)}.${v.slice(3)}`;
    else if (v.length <= 9)  el.value = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
    else                     el.value = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
}

function initializeCpfMaskHe2() {
    ['atHe2CpfSonik','atHe2CpfCemig'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', () => maskCpfAtendimentos(el));
    });
}

function limitCepInputHe2(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8);
    e.target.value = v.length > 5 ? `${v.slice(0,5)}-${v.slice(5)}` : v;
}

async function searchCepHe2() {
    const cepInput = document.getElementById('atHe2Cep');
    const cep = cepInput.value.replace(/\D/g, '');
    if (cep.length !== 8) { alert('CEP deve conter 8 dígitos'); return; }
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (data.erro) { alert('CEP não encontrado'); return; }
        document.getElementById('atHe2Logradouro').value = (data.logradouro || '').toUpperCase();
        document.getElementById('atHe2Bairro').value     = (data.bairro    || '').toUpperCase();
        document.getElementById('atHe2Cidade').value     = (data.localidade|| '').toUpperCase();
        cepInput.value = `${cep.slice(0,5)}-${cep.slice(5)}`;
        document.getElementById('atHe2Numero').focus();
    } catch (err) {
        console.error('Erro ao buscar CEP:', err);
        alert('Erro ao buscar CEP. Tente novamente.');
    }
}

function renderHe2Output() {
    if (!isPageAllFilled(5)) { setOutput('atHe2Output', ''); return; }

    const tipo              = he2Tipo === 'pf' ? 'PESSOA FÍSICA' : 'PESSOA JURÍDICA';
    const atendente         = val('atHe2Atendente');
    const nomeSonik         = val('atHe2NomeSonik');
    const cpfSonik          = val('atHe2CpfSonik');
    const telSonik          = val('atHe2TelefoneSonik');
    const nomeCemig         = val('atHe2NomeCemig');
    const cpfCemig          = val('atHe2CpfCemig');
    const rgCemig           = val('atHe2RgCemig');
    const nomeSolic         = val('atHe2NomeSolicitante');
    const emailSolic        = val('atHe2EmailSolicitante');
    const telSolic          = val('atHe2TelefoneSolicitante');
    const cep               = val('atHe2Cep');
    const logradouro        = val('atHe2Logradouro');
    const bairro            = val('atHe2Bairro');
    const numero            = val('atHe2Numero');
    const complemento       = val('atHe2Complemento');
    const cidade            = val('atHe2Cidade');
    const unidadeConsumidora= val('atHe2UnidadeConsumidora');

    const lines = [];
    lines.push(`** ATENDENTE: ${atendente}`);
    lines.push(`** TIPO: ${tipo}`);
    lines.push(``);
    lines.push(`** DADOS DO TITULAR SONIK`);
    lines.push(`** NOME: ${nomeSonik}`);
    lines.push(`** CPF: ${cpfSonik}`);
    lines.push(`** TELEFONE: ${telSonik}`);
    lines.push(``);
    lines.push(`** DADOS DO TITULAR CEMIG`);
    lines.push(`** NOME: ${nomeCemig}`);
    lines.push(`** CPF: ${cpfCemig}`);
    lines.push(`** RG: ${rgCemig}`);
    lines.push(``);
    lines.push(`** SOLICITANTE`);
    lines.push(`** NOME: ${nomeSolic}`);
    lines.push(`** E-MAIL: ${emailSolic}`);
    lines.push(`** TELEFONE: ${telSolic}`);
    lines.push(``);
    lines.push(`** ENDEREÇO`);
    lines.push(`** CEP: ${cep}`);
    lines.push(`** LOGRADOURO: ${logradouro}`);
    lines.push(`** BAIRRO: ${bairro}`);
    lines.push(`** NÚMERO: ${numero}${complemento ? ' / COMPLEMENTO: ' + complemento : ''}`);
    lines.push(`** CIDADE: ${cidade}`);
    lines.push(`** UNIDADE CONSUMIDORA: ${unidadeConsumidora}`);

    setOutput('atHe2Output', lines.join('\n'));
}

// ============================================================
// VERIFICAÇÃO DE COMPLETUDE
// ============================================================
function isPageAllFilled(pageNum) {
    const pageEl = document.querySelector(`.form-page[data-page="${pageNum}"]`);
    if (!pageEl) return false;

    const required = pageEl.querySelectorAll('input[required], select[required], textarea[required]');
    for (const field of required) {
        if (!field.value || field.value.trim() === '') return false;
    }

    // Page 2: previsão de mudança precisa estar preenchida (data OU já se mudou)
    if (pageNum === 2 && !getPrevisaoEndVal()) return false;

    return true;
}

// ============================================================
// PREVISÃO DE MUDANÇA (Page 2 — Alteração de Endereço)
// ============================================================
function initializePrevisao() {
    const jaMudouBtn = document.getElementById('atEndJaMudouBtn');
    const dataInput  = document.getElementById('atEndPrevisaoData');
    if (!jaMudouBtn || !dataInput) return;

    jaMudouBtn.addEventListener('click', () => {
        const isActive = jaMudouBtn.classList.toggle('active');
        if (isActive) {
            dataInput.value = '';
            dataInput.disabled = true;
        } else {
            dataInput.disabled = false;
        }
        renderEndOutput();
    });

    dataInput.addEventListener('input', () => {
        if (dataInput.value) {
            jaMudouBtn.classList.remove('active');
        }
        renderEndOutput();
    });
}

function getPrevisaoEndVal() {
    const jaMudou = document.getElementById('atEndJaMudouBtn')?.classList.contains('active');
    if (jaMudou) return 'JÁ SE MUDOU';

    const dateInput = document.getElementById('atEndPrevisaoData');
    if (dateInput?.value?.trim()) return dateInput.value.trim().toUpperCase();
    return '';
}

// ============================================================
// VALIDAÇÃO
// ============================================================
function validatePage(pageNum) {
    const pageEl = document.querySelector(`.form-page[data-page="${pageNum}"]`);
    if (!pageEl) return false;

    clearValidationAlert(pageEl);

    const required = pageEl.querySelectorAll('input[required], select[required], textarea[required]');
    const empty = [];
    let firstEmpty = null;

    required.forEach(field => {
        const isEmpty = !field.value || field.value.trim() === '';
        if (isEmpty) {
            const label = field.closest('.form-group')?.querySelector('label')?.textContent
                .replace('*', '').trim() || field.name;
            empty.push(label);
            if (!firstEmpty) firstEmpty = field;
        }
    });

    if (empty.length > 0) {
        showValidationAlert(pageEl, [...new Set(empty)]);
        if (firstEmpty) firstEmpty.focus();
        return false;
    }
    return true;
}

function showValidationAlert(pageEl, fields) {
    clearValidationAlert(pageEl);
    const div = document.createElement('div');
    div.className = 'alert alert-error at-validation-alert';
    div.textContent = `Campos obrigatórios pendentes: ${fields.join(', ')}`;
    pageEl.insertBefore(div, pageEl.firstChild.nextSibling);
}

function clearValidationAlert(pageEl) {
    pageEl.querySelector('.at-validation-alert')?.remove();
}

function initializeValidationFeedback() {
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        const evt = field.tagName === 'SELECT' ? 'change' : 'input';
        field.addEventListener(evt, () => {
            const pageEl = document.querySelector(`.form-page[data-page="${currentPage}"]`);
            if (pageEl) clearValidationAlert(pageEl);
        });
    });
}

// ============================================================
// RESET
// ============================================================
function resetPage(pageNum) {
    const pageEl = document.querySelector(`.form-page[data-page="${pageNum}"]`);
    if (!pageEl) return;

    pageEl.querySelectorAll('input[type="text"], input[type="date"], textarea').forEach(el => { el.value = ''; });
    pageEl.querySelectorAll('select').forEach(el => { el.selectedIndex = 0; });
    clearValidationAlert(pageEl);

    // Reset previsão de mudança (page 2)
    if (pageNum === 2) {
        const jaMudouBtn = document.getElementById('atEndJaMudouBtn');
        const dataInput  = document.getElementById('atEndPrevisaoData');
        if (jaMudouBtn) jaMudouBtn.classList.remove('active');
        if (dataInput)  dataInput.disabled = false;
    }

    // Limpa output da página
    const outputMap = { 1: 'atEquipOutput', 2: 'atEndOutput', 3: 'atPontoOutput', 4: 'atMeshOutput', 5: 'atHe2Output' };
    setOutput(outputMap[pageNum], '');

    // Reset HE² tipo (page 5)
    if (pageNum === 5) selectHe2Tipo('pf');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// COPIAR PARA ÁREA DE TRANSFERÊNCIA
// ============================================================
function copyOutput(boxId, btnId) {
    const box = document.getElementById(boxId);
    const btn = document.getElementById(btnId);
    if (!box || !btn) return;

    const text = box.textContent.trim();
    if (!text || box.querySelector('.output-placeholder')) {
        alert('Gere o texto primeiro antes de copiar.');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                 stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copiado!`;
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback para browsers sem suporte
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);

        const original = btn.innerHTML;
        btn.textContent = 'Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.remove('copied');
        }, 2000);
    });
}
