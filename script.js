import database from './infra/database.js'; // Importando o módulo do banco de dados

document.addEventListener("DOMContentLoaded", function () {
    const botaoEnviar = document.getElementById('BotaoEnviar');
    const botaoSortear = document.querySelector('.sortear');
    let numFrases = 0;

    // Adicionando evento de clique no botão de enviar
    botaoEnviar.addEventListener('click', async function () { 
        const fraseInput = document.getElementById('FraseAdd').value.trim();
        if (fraseInput !== "") {
            try {
                // Inserindo a nova frase no banco de dados
                await database.query(`INSERT INTO frases (frase) VALUES ('${fraseInput}')`);
                
                // Atualizando a interface do usuário
                numFrases++;
                adicionarFraseAoContainer(numFrases, fraseInput);
                document.getElementById('FraseAdd').value = '';
            } catch (error) {
                console.error('Erro ao inserir a frase:', error);
                alert('Erro ao inserir a frase. Por favor, tente novamente.');
            }
        } else {
            alert("Por favor, digite uma frase antes de enviar.");
        }
    });
    
    // Adicionando evento de clique no botão de sortear
    botaoSortear.addEventListener('click', async function(){
        try {
            // Recuperando todas as frases do banco de dados
            const result = await database.query('SELECT frase FROM frases');
            const frases = result.rows.map(row => row.frase);

            if (frases.length === 0) {
                alert("Não há frases para sortear.");
                return;
            }

            // Escolhendo uma frase aleatoriamente
            const randomIndex = Math.floor(Math.random() * frases.length);
            const fraseEscolhida = frases[randomIndex];
            alert(`Frase escolhida: ${randomIndex + 1}: ${fraseEscolhida}`);
        } catch (error) {
            console.error('Erro ao sortear a frase:', error);
            alert('Erro ao sortear a frase. Por favor, tente novamente.');
        }
    });

    function adicionarFraseAoContainer(numero, frase) {
        const frasesContainer = document.querySelector('.frases-container');
        const novaDiv = document.createElement('div');
        const novaLabel = document.createElement('label');
        const botaoExcluir = document.createElement('input');

        novaLabel.textContent = `${numero}: ${frase}`;
        botaoExcluir.type = 'submit';
        botaoExcluir.value = '';
        botaoExcluir.className = 'excluir';
        novaDiv.className = 'frase-container';

        novaDiv.appendChild(novaLabel);
        novaDiv.appendChild(botaoExcluir);
        frasesContainer.appendChild(novaDiv);

        botaoExcluir.addEventListener('click', async function() {
            try {
                // Removendo a frase do banco de dados
                await database.query(`DELETE FROM frases WHERE frase = '${frase}'`);

                // Removendo a div da interface do usuário
                novaDiv.remove();
                numFrases--;
                atualizarNumeracao();
            } catch (error) {
                console.error('Erro ao excluir a frase:', error);
                alert('Erro ao excluir a frase. Por favor, tente novamente.');
            }
        });
    }

    function atualizarNumeracao() {
        const labels = document.querySelectorAll('.frase-container label');
        labels.forEach((label, index) => {
            label.textContent = `${index + 1}: ${label.textContent.split(': ')[1]}`;
        });
    }
});
