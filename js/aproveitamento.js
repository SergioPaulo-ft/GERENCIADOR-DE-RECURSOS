const addPeca = document.getElementById('add');
const calcularBtn = document.getElementById('calcular');
const conjuntoPecas = document.querySelector('.conjunto-pecas');
const resultDiv = document.getElementById('result');
const sobras = document.getElementById("sobras");

let pecas = [];
let pecasInteirasExtras = [];

// Adiciona peças extras (sobras)
sobras.addEventListener('click', () => {
    let medida = parseFloat(prompt("Medida da sobra (mm)"));
    let quantidade = parseInt(prompt("Quantidade de sobras"));
    
    if (!isNaN(medida) && !isNaN(quantidade) && medida > 0 && quantidade > 0) {
        pecasInteirasExtras.push({ medida, quantidade, tipo: 'sobra' });
    } else {
        alert("Por favor, insira valores válidos para a sobra.");
    }
});

// Função para salvar as peças
function salvarPeca(inteiro, corte, quant) {
    pecas.push({ inteiro, corte, quant, tipo: 'inteiro' });
    atualizarListaPecas();
}

// Função para atualizar a lista de peças
function atualizarListaPecas() {
    conjuntoPecas.innerHTML = '';
    pecas.forEach((peca, index) => {
        const pecaElement = document.createElement('p');
        pecaElement.innerHTML = `Peça ${index + 1}: Inteiro - ${peca.inteiro}, Corte - ${peca.corte}, Quantidade - ${peca.quant}, Tipo - ${peca.tipo} <i class="fa-regular fa-circle-xmark delete"></i> `;
        conjuntoPecas.appendChild(pecaElement);
    });
}

// Adicionar peça ao clicar no botão "Adicionar"
addPeca.addEventListener('click', (e) => {
    e.preventDefault();
    const inteiro = parseFloat(document.getElementById('inteiro').value);
    const MedidaCorte = parseFloat(document.getElementById('MedidaCorte').value);
    const quantidadePecas = parseFloat(document.getElementById('quantidade').value);
    if (!isNaN(inteiro) && !isNaN(MedidaCorte) && !isNaN(quantidadePecas)) {
        salvarPeca(inteiro, MedidaCorte, quantidadePecas);
    } else {
        alert('Por favor, preencha todos os campos com valores válidos.');
    }
    document.getElementById('MedidaCorte').value = "";
    document.getElementById('quantidade').value = "";
});

// Algoritmo de corte de barras
const espessuraSerra = 3; // Defina a espessura da serra

function encontrarMelhorCombinacao(inteiro, pecas) {
    let melhorCombinacao = [];
    let melhorUtilizacao = 0;

    function gerarCombinacoes(pecas, combinacaoAtual, somaAtual, cortes, indice) {
        if (somaAtual + cortes * espessuraSerra > inteiro) {
            return;
        }

        if (somaAtual > melhorUtilizacao) {
            melhorUtilizacao = somaAtual;
            melhorCombinacao = combinacaoAtual.slice();
        }

        for (let i = indice; i < pecas.length; i++) {
            if (pecas[i].quant > 0) {
                pecas[i].quant--;
                combinacaoAtual.push(pecas[i].corte);
                gerarCombinacoes(pecas, combinacaoAtual, somaAtual + pecas[i].corte, cortes + 1, i);
                combinacaoAtual.pop();
                pecas[i].quant++;
            }
        }
    }

    gerarCombinacoes(pecas, [], 0, 0, 0);
    return melhorCombinacao;
}

function cortarBarras(pecas, pecasExtras, tamanhoInteiroPrincipal) {
    let combinacoesTotais = [];
    let pecasRestantes = JSON.parse(JSON.stringify(pecas));
    let totalInteirosNecessarios = 0;

    // Utilizando peças extras (sobras) primeiro
    for (let extra of pecasExtras) {
        for (let i = 0; i < extra.quantidade; i++) {
            let melhorCombinacao = encontrarMelhorCombinacao(extra.medida, pecasRestantes);
            if (melhorCombinacao.length > 0) {
                combinacoesTotais.push({ combinacao: melhorCombinacao, tamanho: extra.medida, tipo: 'sobra' });
                melhorCombinacao.forEach(corte => {
                    for (let j = 0; j < pecasRestantes.length; j++) {
                        if (pecasRestantes[j].corte === corte) {
                            pecasRestantes[j].quant--;
                            break;
                        }
                    }
                });
            }
        }
    }

    // Depois, utiliza peças inteiras principais
    while (pecasRestantes.some(peca => peca.quant > 0)) {
        let melhorCombinacao = encontrarMelhorCombinacao(tamanhoInteiroPrincipal, pecasRestantes);
        if (melhorCombinacao.length === 0) break;

        combinacoesTotais.push({ combinacao: melhorCombinacao, tamanho: tamanhoInteiroPrincipal, tipo: 'inteiro' });
        totalInteirosNecessarios++;

        melhorCombinacao.forEach(corte => {
            for (let j = 0; j < pecasRestantes.length; j++) {
                if (pecasRestantes[j].corte === corte) {
                    pecasRestantes[j].quant--;
                    break;
                }
            }
        });
    }

    return { combinacoes: combinacoesTotais, totalInteirosNecessarios };
}

// Função para agrupar combinações e calcular a quantidade de inteiros necessários
function agruparCombinacoes(combinacoes) {
    let combinacoesAgrupadas = {};

    combinacoes.forEach(item => {
        let chave = item.combinacao.join(",");
        if (!combinacoesAgrupadas[chave]) {
            combinacoesAgrupadas[chave] = { quantidade: 0, tamanho: item.tamanho, tipo: item.tipo };
        }
        combinacoesAgrupadas[chave].quantidade++;
    });

    return combinacoesAgrupadas;
}

// Evento de clique no botão "Calcular"
calcularBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const tamanhoInteiroPrincipal = parseFloat(document.getElementById('inteiro').value);
    if (isNaN(tamanhoInteiroPrincipal)) {
        alert('Por favor, preencha a medida do inteiro principal com um valor válido.');
        return;
    }

    const resultado = cortarBarras(pecas, pecasInteirasExtras, tamanhoInteiroPrincipal);
    const combinacoesAgrupadas = agruparCombinacoes(resultado.combinacoes);

    if (resultado.combinacoes.length > 0) {
        let resultHTML = `<h2>Relação de cortes necessários:</h2>`;
        let combinacoesMostradas = new Set();

        Object.keys(combinacoesAgrupadas).forEach((chave, index) => {
            const comb = chave.split(",").map(Number);
            const tamanhoInteiro = combinacoesAgrupadas[chave].tamanho;
            const tipo = combinacoesAgrupadas[chave].tipo;
            const quantidadeInteiros = combinacoesAgrupadas[chave].quantidade;

            if (!combinacoesMostradas.has(tamanhoInteiro)) {
                combinacoesMostradas.add(tamanhoInteiro);
            }

            resultHTML += `<p>Combinações com ${tamanhoInteiro}mm: ${comb.join(", ")} <br> Necessários: ${quantidadeInteiros} inteiros de ${tamanhoInteiro}mm</p>`;
        });

        resultHTML += `<p style="color:red;">Quantidade total de inteiros necessários: ${resultado.totalInteirosNecessarios}</p>`;
        resultDiv.innerHTML = resultHTML;
    } else {
        resultDiv.innerHTML = "Não foi possível realizar cortes com as peças fornecidas.";
    }
    resultDiv.style.display = 'block';
});
