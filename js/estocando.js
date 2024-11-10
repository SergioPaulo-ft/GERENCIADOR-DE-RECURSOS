const result = document.getElementById('result');
const btCalc = document.getElementById('calcular');
const VerHistorico = document.getElementById('VerHistorico');
let historico = [];

// Calcular ao clicar no botão
btCalc.addEventListener('click', (e) => {
    e.preventDefault();
    result.style.display = "block";
    result.innerHTML = '';

    const MedidaInteira = parseFloat(document.getElementById('MedidaInteira').value);
    const quantPecas = parseFloat(document.getElementById('quantPecas').value);
    const MedidaCorte = parseFloat(document.getElementById('MedidaCorte').value);

    if (isNaN(MedidaInteira) || MedidaInteira <= 0 || isNaN(quantPecas) || quantPecas <= 0 || isNaN(MedidaCorte) || MedidaCorte <= 0) {
        result.innerHTML = '<p>Por favor, insira valores válidos e selecione um modelo.</p>';
        return;
    }

    const perca = 3;
    const CortesPorInteiro = Math.floor(MedidaInteira / (MedidaCorte + perca));
    const quantInteiros = Math.ceil(quantPecas / CortesPorInteiro);

    const calculoHtml = `
        <div class="calculo-item" style="display: flex;">
            <div>
                <div class="separator"></div>
                <p>Tamanho bruto: ${MedidaInteira} mm</p>
                <p>Tamanho do corte: ${MedidaCorte} mm</p>
                <p>Quantidade necessária de Inteiros: ${quantInteiros} PÇS</p>
                <p>Cortes por Inteiro Estipulado: ${CortesPorInteiro}</p>
                <p>Quantidade em estoque: ?</p>
                <p>Prazo estipulado para compra: ?</p>
            </div>
            <i class="fa-regular fa-circle-xmark remove-calculo" style="margin-left: auto; cursor: pointer;"></i>
        </div>
    `;

    result.innerHTML = calculoHtml;
    historico.push(calculoHtml);
    
    document.getElementById('quantPecas').value = "";
    document.getElementById('MedidaCorte').value = "";
});

// Ver histórico ao clicar no botão
VerHistorico.addEventListener('click', (e) => {
    e.preventDefault();
    if (historico.length > 0) {
        result.style.display = "block";
        result.innerHTML = historico.join('');
    } else {
        result.style.display = "none";
        alert('Sem histórico no momento, faça pelo menos uma conta');
    }
});

// Remover cálculo ao clicar no botão
result.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-calculo')) {
        const itemToRemove = e.target.closest('.calculo-item');
        itemToRemove.remove();
        historico = historico.filter(item => item !== itemToRemove.outerHTML);

        if (historico.length === 0) {
            result.style.display = "none";
        }
    }
});
