document.addEventListener('DOMContentLoaded', () => {


    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spinButton');
    const resultDiv = document.getElementById('result');
    const balanceAmountSpan = document.getElementById('balanceAmount');
    const depositButton = document.getElementById('depositButton');
    const increaseBetBtn = document.getElementById('increaseBet'); 
    const decreaseBetBtn = document.getElementById('decreaseBet'); 
    const betAmountSpan = document.getElementById('betAmount');   


    const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '🔔'];
    const SPIN_DURATION = 2000;
    

    const INITIAL_BALANCE = 0;
    const BET_INCREMENT = 5;      
    const WIN_MULTIPLIER = 10;    

    let currentBalance = INITIAL_BALANCE;
    let currentBet = 5;    
    let spinCount = 0;


    function updateBalanceDisplay() {
        balanceAmountSpan.textContent = currentBalance;
    }
    
 
    function updateBetDisplay() {
        betAmountSpan.textContent = currentBet;

        spinButton.disabled = currentBet > currentBalance;
    }


    function increaseBet() {

        if (currentBet + BET_INCREMENT <= currentBalance) {
            currentBet += BET_INCREMENT;
            updateBetDisplay();
        }
    }

    function decreaseBet() {

        if (currentBet - BET_INCREMENT >= BET_INCREMENT) {
            currentBet -= BET_INCREMENT;
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

        spinCount++;
        resultDiv.textContent = '';
        spinButton.disabled = true;
        increaseBetBtn.disabled = true; 
        decreaseBetBtn.disabled = true;


        const isForcedWin = spinCount % 5 === 0;
        let winSymbol = null;
        if (isForcedWin) {
            winSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        }
        reels.forEach((reel, index) => {
            reel.classList.add('spinning');
            const interval = setInterval(() => { reel.textContent = symbols[Math.floor(Math.random() * symbols.length)]; }, 100);
            setTimeout(() => {
                clearInterval(interval);
                reel.classList.remove('spinning');
                if (isForcedWin) { reel.textContent = winSymbol; }
                else { reel.textContent = symbols[Math.floor(Math.random() * symbols.length)]; }
                if (index === reels.length - 1) { determineResult(); }
            }, SPIN_DURATION + (index * 500));
        });
    }
    

    function determineResult() {
        const finalResults = Array.from(reels).map(reel => reel.textContent);

        if (finalResults[0] === finalResults[1] && finalResults[1] === finalResults[2]) {
            const prize = currentBet * WIN_MULTIPLIER;
            currentBalance += prize;
            updateBalanceDisplay();

            const message = (spinCount % 5 === 0) ? '🎉 Vitória da Sorte! 🎉' : '🎉 Você Ganhou! 🎉';
            resultDiv.textContent = `${message} (+R$ ${prize})`;
        } else {
            resultDiv.textContent = 'Tente novamente!';
        }

        updateBetDisplay();
        increaseBetBtn.disabled = false;
        decreaseBetBtn.disabled = false;

        if (currentBalance < BET_INCREMENT) {
             resultDiv.textContent += " Fim de Jogo! Faça um depósito para continuar.";
        }
    }

    updateBalanceDisplay();
    updateBetDisplay();
    spinButton.addEventListener('click', spin);
    depositButton.addEventListener('click', handleDeposit);
    increaseBetBtn.addEventListener('click', increaseBet);
    decreaseBetBtn.addEventListener('click', decreaseBet);
    
    if(currentBalance < currentBet) {
        spinButton.disabled = true;
        resultDiv.textContent = "Bem-vindo! Faça um depósito para começar.";
    }
});