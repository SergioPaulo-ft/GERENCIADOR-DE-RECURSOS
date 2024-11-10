document.getElementById('calcular').addEventListener('click', () => {
    const result = document.getElementById("result");
    result.style.display = "block";

    const quantPecas = parseFloat(document.getElementById("quantPecas").value);
    const MedidaEsteira = parseFloat(document.getElementById("MedidaEsteira").value);
    const Paco = parseFloat(document.getElementById("Paco").value);

    if (!isNaN(quantPecas) && !isNaN(MedidaEsteira) && !isNaN(Paco)) {
        if (MedidaEsteira > 2500) {
            result.innerHTML = '<p style="color: red;">Desculpe, nao atendemos medidas maiores que 250 cm</p>';
        } else {
            // Calculando quantidade de roletes por esteira
            let QuantRoletes;
            if (MedidaEsteira <= 500) {
                QuantRoletes = 3;
            } else {
                QuantRoletes = Paco === 55 ? Math.trunc(MedidaEsteira / Paco) : Math.ceil(MedidaEsteira / Paco);
            }

            // Calculando quantidade de eixos estruturais por esteira
            let QuantEixosEstruturais = MedidaEsteira >= 2000 ? (MedidaEsteira == 2500 ? 4 : 3) : 2;

            result.innerHTML = `
                <p>Quantidade de Roletes por Esteira: ${QuantRoletes}</p>
                <p style="font-weight: bold;">Total de Roletes: ${QuantRoletes * quantPecas}</p><br>
                <p>Quantidade de Eixos Estruturais por Esteira: ${QuantEixosEstruturais}</p>
                <p style="font-weight: bold;">Total de eixos Estruturais: ${QuantEixosEstruturais * quantPecas}</p>
            `;
        }
    } else {
        result.innerHTML = '<p style="color: red;">Preencha todos os campos</p>';
    }
});
