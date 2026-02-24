// Página de multa carregada com sucesso
console.log("Página de multa carregada com sucesso");


// Dados reais dos planos
const planosDisponiveis = [
	{ nome: "COMBO 2026-WIFI6-STANDARD-500MEGA-SKEELO", mensalidade: 79.90, vtb: 491.76 },
	{ nome: "COMBO 2026-WIFI5-RENOVA-500MEGA-SKEELO", mensalidade: 79.90, vtb: 491.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-800MEGA-SKEELO", mensalidade: 89.90, vtb: 515.76 },
	{ nome: "COMBO 2026-WIFI5-RENOVA-800MEGA-SKEELO", mensalidade: 89.90, vtb: 515.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER", mensalidade: 99.90, vtb: 539.76 },
	{ nome: "COMBO 2026-WIFI5-RENOVA-1GIGA-SKEELO+DEEZER", mensalidade: 99.90, vtb: 539.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-800MEGA-SKEELO+DRIVE1TB", mensalidade: 104.90, vtb: 551.76 },
	{ nome: "COMBO 2026-WIFI5-MESH-800MEGA-SKEELO", mensalidade: 109.80, vtb: 563.52 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER+GLOBOPLAY", mensalidade: 109.90, vtb: 563.76 },
	{ nome: "COMBO 2026-WIFI5-RENOVA-500MEGA-SKEELO+TEL", mensalidade: 109.90, vtb: 563.76 },
	{ nome: "COMBO 2026-WIFI6-RENOVA-500MEGA-SKEELO+TEL", mensalidade: 109.90, vtb: 563.76 },
	{ nome: "COMBO 2026-WIFI7-STANDARD-1.6GIGA-SKEELO+DEEZER+HBOMAX", mensalidade: 119.90, vtb: 587.76 },
	{ nome: "COMBO 2026-WIFI6-RURAL-600MEGA-SKEELO", mensalidade: 119.90, vtb: 587.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER+HBOMAX", mensalidade: 119.90, vtb: 587.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER+DISNEY", mensalidade: 119.90, vtb: 587.76 },
	{ nome: "COMBO 2026-WIFI5-RURAL-RENOVA-600MEGA-SKEELO", mensalidade: 119.90, vtb: 587.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-800MEGA-SKEELO+TEL", mensalidade: 119.90, vtb: 587.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER+DRIVE1TB", mensalidade: 119.90, vtb: 587.76 },
	{ nome: "COMBO 2026-WIFI7-STANDARD-1.6GIGA-SKEELO+DEEZER+DISNEY", mensalidade: 119.90, vtb: 587.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA", mensalidade: 119.90, vtb: 587.76 },
	{ nome: "COMBO 2026-WIFI6-MESH-1GIGA(500+500)-SKEELO+DEEZER", mensalidade: 129.80, vtb: 611.52 },
	{ nome: "COMBO 2026-WIFI7-STANDARD-2GIGA-SKEELO+DEEZER+GLOBOPLAY+HBOMAX", mensalidade: 129.90, vtb: 611.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER+TEL", mensalidade: 129.90, vtb: 611.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER+GLOBOPLAY+HBOMAX", mensalidade: 129.90, vtb: 611.76 },
	{ nome: "COMBO 2026-WIFI6-MESH-1.6GIGA(800+800)-SKEELO+DEEZER+GLOBOPLAY", mensalidade: 139.80, vtb: 635.52 },
	{ nome: "COMBO 2026-WIFI6-MESH-1.6GIGA(800+800)-SKEELO+DEEZER+HBOMAX", mensalidade: 139.80, vtb: 635.52 },
	{ nome: "COMBO 2026-WIFI6-MESH-1.6GIGA(800+800)-SKEELO+DEEZER+DISNEY", mensalidade: 139.80, vtb: 635.52 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER+GLOBOPLAY+TEL", mensalidade: 139.90, vtb: 635.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER+DRIVE500GB+TEL", mensalidade: 144.90, vtb: 647.76 },
	{ nome: "COMBO 2026-WIFI6-ALL IN-1GIGA-SKEELO+DEEZER+GLOBOPLAY+HBOMAX+DISNEY", mensalidade: 145.90, vtb: 650.16 },
	{ nome: "COMBO 2026-WIFI6-MESH-1.6GIGA(800+800)-SKEELO+DEEZER+GLOBOPLAY+HBOMAX", mensalidade: 149.80, vtb: 659.52 },
	{ nome: "COMBO 2026-WIFI7-ALL IN-2GIGA-SKEELO+DEEZER+GLOBOPLAY+HBOMAX+DISNEY", mensalidade: 149.90, vtb: 659.76 },
	{ nome: "COMBO 2026-WIFI6-RURAL-600MEGA-SKEELO+TEL", mensalidade: 149.90, vtb: 659.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER+DISNEY+TEL", mensalidade: 149.90, vtb: 659.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER+HBOMAX+TEL", mensalidade: 149.90, vtb: 659.76 },
	{ nome: "COMBO 2026-WIFI7-ALL IN-2GIGA-SKEELO+DEEZER+GLOBOPLAY+HBOMAX+DISNEY", mensalidade: 149.90, vtb: 659.76 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+DEEZER+IPFIXO", mensalidade: 149.90, vtb: 659.76 },
	{ nome: "COMBO 2026-WIFI6-MESH-1GIGA(500+500)-SKEELO+DEEZER+TEL", mensalidade: 159.80, vtb: 683.52 },
	{ nome: "COMBO 2026-WIFI6-MESH-1.6GIGA(800+800)-SKEELO+DEEZER+HBOMAX+DRIVE1TB", mensalidade: 159.80, vtb: 683.52 },
	{ nome: "COMBO 2026-WIFI7-MESH-2GIGA(1000+1000)-SKEELO+DEEZER+GLOBOPLAY+HBOMAX", mensalidade: 169.80, vtb: 707.52 },
	{ nome: "COMBO 2026-WIFI6-MESH-1.6GIGA(800+800)-SKEELO+DEEZER+HBOMAX+TEL", mensalidade: 169.80, vtb: 707.52 },
	{ nome: "COMBO 2026-WIFI6-ALL IN-MESH-1GIGA(500+500)-SKEELO+DEEZER+GLOBOPLAY+HBOMAX+DISNEY", mensalidade: 175.80, vtb: 721.92 },
	{ nome: "COMBO 2026-WIFI6-ALL IN-1GIGA-SKEELO+DEEZER+GLOBOPLAY+HBOMAX+DISNEY+TEL", mensalidade: 175.90, vtb: 722.16 },
	{ nome: "COMBO 2026-WIFI6-MESH-1GIGA(500+500)-SKEELO+DEEZER+IPFIXO", mensalidade: 179.80, vtb: 731.52 },
	{ nome: "COMBO 2026-WIFI6-STANDARD-1GIGA-SKEELO+TEL+IPFIXO", mensalidade: 179.90, vtb: 731.76 },
	{ nome: "COMBO 2026-WIFI7-ALL IN-2GIGA-SKEELO+DEEZER+GLOBOPLAY+HBOMAX+DISNEY+TEL", mensalidade: 179.90, vtb: 731.76 },
	{ nome: "COMBO 2026-WIFI7-ALL IN-MESH-2GIGA(1000+1000)-SKEELO+DEEZER+GLOBOPLAY+HBOMAX+DISNEY", mensalidade: 189.80, vtb: 755.52 },
	{ nome: "COMBO 2026-WIFI6-MESH-1.6GIGA(800+800)-SKEELO+DEEZER+HBOMAX+IPFIXO", mensalidade: 189.80, vtb: 755.52 },
	{ nome: "COMBO 2026-WIFI6-MESH-1GIGA(500+500)-SKEELO+DEEZER+DRIVE1TB", mensalidade: 219.90, vtb: 827.76 },
	{ nome: "COMBO 2026-WIFI7-ALL IN-MESH-2GIGA(1000+1000)-SKEELO+DEEZER+GLOBOPLAY+HBOMAX+DISNEY+IPFIXO", mensalidade: 239.80, vtb: 875.52 }
];

const TAB_BASIC = "basico";
const TAB_MESH = "mesh";
let activeTab = TAB_BASIC;

function isMeshPlan(nome) {
	return /MESH/i.test(nome);
}

function getPlanosPorTab(tabKey) {
	if (tabKey === TAB_MESH) {
		return planosDisponiveis.filter(plano => isMeshPlan(plano.nome));
	}
	return planosDisponiveis.filter(plano => !isMeshPlan(plano.nome));
}

function populatePlanos(tabKey) {
	const selectPlano = document.getElementById("plano");
	if (!selectPlano) return;

	selectPlano.innerHTML = '<option value="">Selecione o plano</option>';
	getPlanosPorTab(tabKey).forEach(plano => {
		const opt = document.createElement("option");
		opt.value = plano.nome;
		opt.textContent = plano.nome;
		selectPlano.appendChild(opt);
	});
}

function applyTabStyles() {
	document.querySelectorAll(".tab-button").forEach(button => {
		if (button.dataset.tab === activeTab) {
			button.classList.add("active");
			button.style.background = "linear-gradient(135deg, #018dd7 0%, #0277bd 100%)";
			button.style.borderColor = "#018dd7";
			button.style.color = "white";
		} else {
			button.classList.remove("active");
			button.style.background = "#f5f5f5";
			button.style.borderColor = "#e0e0e0";
			button.style.color = "#666";
		}
	});
}

function applyTabHoverStyles() {
	const styleId = "multa-tab-styles";
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
	`;
}

function initializeTabs() {
	applyTabHoverStyles();
	applyTabStyles();
	document.querySelectorAll(".tab-button").forEach(button => {
		button.addEventListener("click", () => {
			activeTab = button.dataset.tab || TAB_BASIC;
			applyTabStyles();
			populatePlanos(activeTab);
			resetResultados();
		});
	});
}

function resetResultados() {
	const spanBoletosRestantes = document.getElementById("boletosRestantes");
	const spanMulta = document.getElementById("multa");
	const spanMensalidade = document.getElementById("mensalidadePlano");
	const inputBoletos = document.getElementById("boletosPagos");

	if (spanBoletosRestantes) spanBoletosRestantes.textContent = "-";
	if (spanMulta) spanMulta.textContent = "-";
	if (spanMensalidade) spanMensalidade.textContent = "-";
	if (inputBoletos) inputBoletos.value = "";
}

function updateMensalidade() {
	const selectPlano = document.getElementById("plano");
	const spanMensalidade = document.getElementById("mensalidadePlano");
	if (!selectPlano || !spanMensalidade) return;

	const planoSelecionado = selectPlano.value;
	if (!planoSelecionado) {
		spanMensalidade.textContent = "-";
		return;
	}

	const planoObj = planosDisponiveis.find(p => p.nome === planoSelecionado);
	spanMensalidade.textContent = planoObj
		? formatarMoeda(planoObj.mensalidade)
		: "-";
}

// Popula o select#plano automaticamente
document.addEventListener("DOMContentLoaded", () => {
	initializeTabs();
	populatePlanos(activeTab);
	updateMensalidade();

	const selectPlano = document.getElementById("plano");
	if (selectPlano) {
		selectPlano.addEventListener("change", updateMensalidade);
	}

	// Adiciona evento ao botão calcular
	const btnCalcular = document.getElementById("btnCalcular");
	if (btnCalcular) {
		btnCalcular.addEventListener("click", calcularMultaHandler);
	}
});

// Função principal do cálculo
function calcularMultaHandler(e) {
	e.preventDefault();
	const selectPlano = document.getElementById("plano");
	const inputBoletos = document.getElementById("boletosPagos");
	const spanBoletosRestantes = document.getElementById("boletosRestantes");
	const spanMulta = document.getElementById("multa");

	if (!selectPlano || !inputBoletos || !spanBoletosRestantes || !spanMulta) return;

	const planoSelecionado = selectPlano.value;
	const boletosPagos = parseInt(inputBoletos.value, 10);

	// Validações
	if (!planoSelecionado) return;
	if (isNaN(boletosPagos) || boletosPagos < 0 || boletosPagos > 12) return;

	// Busca exata do plano
	const planoObj = planosDisponiveis.find(p => p.nome === planoSelecionado);
	if (!planoObj || planoObj.vtb === null) return;

	const boletosRestantes = calcularBoletosRestantes(boletosPagos);
	const multa = calcularMultaProporcional(planoObj.vtb, boletosRestantes);

	spanBoletosRestantes.textContent = boletosRestantes;
	spanMulta.textContent = formatarMoeda(multa);
}

function calcularBoletosRestantes(boletosPagos) {
	return Math.max(0, 12 - boletosPagos);
}

function calcularMultaProporcional(vtb, boletosRestantes) {
	return (vtb / 12) * boletosRestantes;
}

function formatarMoeda(valor) {
	return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
