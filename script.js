document.addEventListener('DOMContentLoaded', () => {

    // 1. SELECIONAR OS ELEMENTOS DO HTML
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spinButton');
    const resultDiv = document.getElementById('result');
    const balanceAmountSpan = document.getElementById('balanceAmount');
    const depositButton = document.getElementById('depositButton');
    const increaseBetBtn = document.getElementById('increaseBet');
    const decreaseBetBtn = document.getElementById('decreaseBet');
    const betAmountSpan = document.getElementById('betAmount');
    // NOVO: Seleciona os elementos da tabela de prêmios
    const prizeTableToggle = document.querySelector('.prize-table-toggle');
    const prizeTableContent = document.querySelector('.prize-table-content');

    // 2. CONFIGURAÇÕES DO JOGO
    const SYMBOLS = [
        { symbol: '🍒', multiplier: 2, weight: 10 },
        { symbol: '🍋', multiplier: 5, weight: 8 },
        { symbol: '🍊', multiplier: 10, weight: 6 },
        { symbol: '🍉', multiplier: 15, weight: 4 },
        { symbol: '🔔', multiplier: 25, weight: 2 },
        { symbol: '⭐', multiplier: 50, weight: 1 }
    ];
    
    const SPIN_DURATION = 2000;
    
    // CONFIGURAÇÕES DA BANCA E APOSTA
    const INITIAL_BALANCE = 0;
    const MINIMUM_BET = 5;
    let currentBalance = INITIAL_BALANCE;
    let currentBet = MINIMUM_BET;

    // --- FUNÇÕES DE LÓGICA ---

    function getWeightedRandomSymbol() {
        const totalWeight = SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);
        let random = Math.random() * totalWeight;

        for (const symbolData of SYMBOLS) {
            random -= symbolData.weight;
            if (random < 0) {
                return symbolData;
            }
        }
    }

    function getBetIncrement(bet) {
        if (bet >= 150) {
            return 50;
        } else if (bet >= 50) {
            return 10;
        } else {
            return 5;
        }
    }

    // --- FUNÇÕES DE INTERFACE ---

    function updateBalanceDisplay() {
        balanceAmountSpan.textContent = currentBalance;
    }
    
    function updateBetDisplay() {
        betAmountSpan.textContent = currentBet;
        spinButton.disabled = currentBet > currentBalance;
    }

    function increaseBet() {
        const increment = getBetIncrement(currentBet);
        if (currentBet + increment <= currentBalance) {
            currentBet += increment;
            updateBetDisplay();
        }
    }

    function decreaseBet() {
        const effectiveBetForDecrement = currentBet - 1;
        const decrement = getBetIncrement(effectiveBetForDecrement);

        if (currentBet - decrement >= MINIMUM_BET) {
            currentBet -= decrement;
            updateBetDisplay();
        }
    }

    function handleDeposit() {
        const depositValueString = prompt("Digite o valor que deseja depositar:", "100");
        if (depositValueString === null) return;

        const depositAmount = parseFloat(depositValueString);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            alert("Por favor, insira um valor válido para o depósito.");
            return;
        }

        currentBalance += depositAmount;
        updateBalanceDisplay();
        updateBetDisplay();
        resultDiv.textContent = `Depósito de R$ ${depositAmount} realizado com sucesso!`;
    }

    function spin() {
        if (currentBet > currentBalance) {
            resultDiv.textContent = "Aposta maior que o saldo!";
            return; 
        }

        currentBalance -= currentBet;
        updateBalanceDisplay();

        resultDiv.textContent = '';
        spinButton.disabled = true;
        increaseBetBtn.disabled = true;
        decreaseBetBtn.disabled = true;

        const finalResults = [getWeightedRandomSymbol(), getWeightedRandomSymbol(), getWeightedRandomSymbol()];

        reels.forEach((reel, index) => {
            reel.classList.add('spinning');
            const interval = setInterval(() => { 
                reel.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].symbol;
            }, 100);
            
            setTimeout(() => {
                clearInterval(interval);
                reel.classList.remove('spinning');
                reel.textContent = finalResults[index].symbol;

                if (index === reels.length - 1) {
                    determineResult(finalResults);
                }
            }, SPIN_DURATION + (index * 500));
        });
    }
    
    function determineResult(finalResults) {
        const firstSymbol = finalResults[0].symbol;
        const allSame = finalResults.every(result => result.symbol === firstSymbol);

        if (allSame) {
            const winningSymbolData = SYMBOLS.find(s => s.symbol === firstSymbol);
            const prize = currentBet * winningSymbolData.multiplier;
            currentBalance += prize;
            updateBalanceDisplay();

            resultDiv.textContent = `🎉 Você Ganhou! 🎉 (+R$ ${prize})`;
        } else {
            resultDiv.textContent = 'Manda mais dinheiro pra conta do pai!';
        }

        updateBetDisplay();
        increaseBetBtn.disabled = false;
        decreaseBetBtn.disabled = false;

        if (currentBalance < MINIMUM_BET) {
             resultDiv.textContent += " Ja era, irmão! Fiquei rico na suas custas.";
        }
    }

    function populatePrizeTable() {
        const prizeTableContent = document.querySelector('.prize-table-content');
        prizeTableContent.innerHTML = prizeTableContent.querySelector('h3').outerHTML;
        const sortedSymbols = [...SYMBOLS].sort((a, b) => b.multiplier - a.multiplier);

        sortedSymbols.forEach(symbolData => {
            const row = document.createElement('div');
            row.classList.add('prize-row');
            row.innerHTML = `
                <span class="prize-symbol">${symbolData.symbol.repeat(3)}</span>
                <span class="prize-multiplier">${symbolData.multiplier}x</span>
            `;
            prizeTableContent.appendChild(row);
        });
    }

    // INICIALIZAÇÃO E EVENT LISTENERS
    updateBalanceDisplay();
    updateBetDisplay();
    spinButton.addEventListener('click', spin);
    depositButton.addEventListener('click', handleDeposit);
    increaseBetBtn.addEventListener('click', increaseBet);
    decreaseBetBtn.addEventListener('click', decreaseBet);
    
    // NOVO: Adiciona o evento de clique para mostrar/esconder a tabela de prêmios
    prizeTableToggle.addEventListener('click', () => {
        prizeTableContent.classList.toggle('visible');
    });

    if(currentBalance < currentBet) {
        spinButton.disabled = true;
        resultDiv.textContent = "Bem-vindo! Faça um depósito para começar.";
    }

    populatePrizeTable();
});