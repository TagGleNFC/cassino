document.addEventListener('DOMContentLoaded', () => {

    // 1. SELECIONAR OS ELEMENTOS DO HTML
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spinButton');
    const resultDiv = document.getElementById('result');
    const balanceAmountSpan = document.getElementById('balanceAmount'); // NOVO

    // 2. CONFIGURAÇÕES DO JOGO
    const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🔔'];
    const SPIN_DURATION = 2000;
    
    // NOVO: CONFIGURAÇÕES DA BANCA
    const INITIAL_BALANCE = 100;
    const SPIN_COST = 5;
    const WIN_PRIZE = 50;

    let currentBalance = INITIAL_BALANCE;
    let spinCount = 0;

    // NOVO: Função para atualizar o display do saldo
    function updateBalanceDisplay() {
        balanceAmountSpan.textContent = currentBalance;
    }

    // 3. FUNÇÃO PRINCIPAL PARA GIRAR OS ROLOS
    function spin() {
        // MODIFICADO: Verifica se o jogador tem saldo suficiente
        if (currentBalance < SPIN_COST) {
            resultDiv.textContent = "Saldo insuficiente para girar!";
            return; // Impede o giro de continuar
        }

        // MODIFICADO: Deduz o custo do giro e atualiza o display
        currentBalance -= SPIN_COST;
        updateBalanceDisplay();

        spinCount++;
        resultDiv.textContent = '';
        spinButton.disabled = true;

        const isForcedWin = spinCount % 5 === 0;
        let winSymbol = null;

        if (isForcedWin) {
            winSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        }

        reels.forEach((reel, index) => {
            reel.classList.add('spinning');
            
            const interval = setInterval(() => {
                const randomIndex = Math.floor(Math.random() * symbols.length);
                reel.textContent = symbols[randomIndex];
            }, 100);

            setTimeout(() => {
                clearInterval(interval);
                reel.classList.remove('spinning');

                if (isForcedWin) {
                    reel.textContent = winSymbol;
                } else {
                    const randomIndex = Math.floor(Math.random() * symbols.length);
                    reel.textContent = symbols[randomIndex];
                }

                if (index === reels.length - 1) {
                    determineResult();
                }
            }, SPIN_DURATION + (index * 500));
        });
    }
    
    // 4. FUNÇÃO PARA DETERMINAR E EXIBIR O RESULTADO
    function determineResult() {
        const finalResults = Array.from(reels).map(reel => reel.textContent);

        if (finalResults[0] === finalResults[1] && finalResults[1] === finalResults[2]) {
            // MODIFICADO: Adiciona o prêmio ao saldo e atualiza o display
            currentBalance += WIN_PRIZE;
            updateBalanceDisplay();

            const message = (spinCount % 5 === 0) ? '🎉 Vitória da Sorte! 🎉' : '🎉 Você Ganhou! 🎉';
            resultDiv.textContent = `${message} (+R$ ${WIN_PRIZE})`;
        } else {
            resultDiv.textContent = 'Tente novamente!';
        }

        // MODIFICADO: Verifica se o jogador pode jogar novamente
        if (currentBalance < SPIN_COST) {
            resultDiv.textContent += " Fim de Jogo!";
            spinButton.disabled = true; // Botão fica desabilitado permanentemente
        } else {
            spinButton.disabled = false; // Habilita para o próximo giro
        }
    }

    // 5. INICIALIZAÇÃO DO JOGO
    updateBalanceDisplay(); // Define o saldo inicial na tela
    spinButton.addEventListener('click', spin);
});