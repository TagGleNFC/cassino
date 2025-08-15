# Arquivo: cassino.py
import random
import time

# --- Funções dos Jogos ---

def jogo_adivinha(carteira):
    """Lógica para o jogo de adivinhar o número."""
    print("\n--- Jogo: Adivinhe o Número ---")
    print("Vou pensar em um número entre 1 e 10. Se você acertar, ganha o dobro da aposta!")

    while True:
        try:
            aposta = float(input(f"Sua carteira: R$ {carteira:.2f}. Quanto você quer apostar? "))
            if aposta <= 0:
                print("A aposta deve ser um valor positivo.")
            elif aposta > carteira:
                print("Você não tem saldo suficiente para essa aposta.")
            else:
                break
        except ValueError:
            print("Por favor, digite um número válido para a aposta.")
    
    numero_secreto = random.randint(1, 10)
    
    while True:
        try:
            palpite = int(input("Qual seu palpite (1 a 10)? "))
            if 1 <= palpite <= 10:
                break
            else:
                print("Por favor, digite um número entre 1 e 10.")
        except ValueError:
            print("Entrada inválida. Digite um número inteiro.")

    print(f"\nO número secreto era: {numero_secreto}")
    
    if palpite == numero_secreto:
        print(f"🎉 Parabéns! Você acertou e ganhou R$ {aposta:.2f}!")
        carteira += aposta
    else:
        print(f"😔 Que pena! Você errou e perdeu R$ {aposta:.2f}.")
        carteira -= aposta
        
    return carteira

def calcular_pontos(mao):
    """Calcula a pontuação de uma mão de cartas, tratando o Ás (11) corretamente."""
    pontos = sum(mao)
    if pontos > 21 and 11 in mao:
        mao[mao.index(11)] = 1
        pontos = sum(mao)
    return pontos

def jogo_blackjack(carteira):
    """Lógica para uma versão simplificada do jogo Blackjack (Vinte e Um)."""
    print("\n--- Jogo: Blackjack (Vinte e Um) ---")

    while True:
        try:
            aposta = float(input(f"Sua carteira: R$ {carteira:.2f}. Quanto você quer apostar? "))
            if aposta <= 0:
                print("A aposta deve ser um valor positivo.")
            elif aposta > carteira:
                print("Você não tem saldo suficiente para essa aposta.")
            else:
                break
        except ValueError:
            print("Por favor, digite um número válido para a aposta.")

    baralho = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11] * 4
    random.shuffle(baralho)

    mao_jogador = [baralho.pop(), baralho.pop()]
    mao_dealer = [baralho.pop(), baralho.pop()]

    while True:
        pontos_jogador = calcular_pontos(mao_jogador)
        print(f"\nSua mão: {mao_jogador} (Total: {pontos_jogador})")
        print(f"Mão do Dealer: [{mao_dealer[0]}, ?]")

        if pontos_jogador > 21:
            print("\nVocê estourou (passou de 21)! Você perdeu. 💥")
            return carteira - aposta
        
        acao = input("Você quer 'p' (pedir mais uma carta) ou 'm' (manter)? ").lower()
        if acao == 'p':
            mao_jogador.append(baralho.pop())
        elif acao == 'm':
            break
        else:
            print("Ação inválida. Escolha 'p' ou 'm'.")

    pontos_jogador = calcular_pontos(mao_jogador)
    pontos_dealer = calcular_pontos(mao_dealer)
    
    print("\n--- Revelando as cartas ---")
    print(f"Sua mão final: {mao_jogador} (Total: {pontos_jogador})")

    while pontos_dealer < 17:
        mao_dealer.append(baralho.pop())
        pontos_dealer = calcular_pontos(mao_dealer)

    print(f"Mão final do Dealer: {mao_dealer} (Total: {pontos_dealer})")

    if pontos_dealer > 21:
        print("\nO Dealer estourou! Você ganhou! 🥳")
        return carteira + aposta
    elif pontos_jogador > pontos_dealer:
        print("\nVocê tem mais pontos que o Dealer! Você ganhou! 🥳")
        return carteira + aposta
    elif pontos_dealer > pontos_jogador:
        print("\nO Dealer tem mais pontos. Você perdeu. 😔")
        return carteira - aposta
    else:
        print("\nEmpate! Ninguém ganha ou perde.")
        return carteira

def jogo_slot_machine(carteira):
    """Lógica para o jogo de Caça-Níqueis (VERSÃO MAIS FÁCIL)."""
    print("\n--- Jogo: Caça-Níqueis 🎰 ---")
    
    simbolos = ["🍒", "🍋", "🍊", "🍉", "⭐", "💰"]
    
    # <-- MUDANÇA AQUI: Definindo pesos para cada símbolo
    # A cereja (🍒) tem peso 40, o limão (🍋) peso 30, etc.
    # A soma dos pesos não precisa ser 100, a biblioteca cuida disso.
    pesos =    [40,   30,   20,   15,    5,    2]

    pagamentos = {
        "🍒": (3, 1), "🍋": (5, 0), "🍊": (10, 0),
        "🍉": (15, 0), "⭐": (20, 0), "💰": (50, 0)
    }

    # ... (o print das regras e a lógica da aposta continuam iguais)
    print("Combinações e Prêmios (multiplicador da sua aposta):")
    # ...
    while True:
        try:
            aposta = float(input(f"Sua carteira: R$ {carteira:.2f}. Quanto você quer apostar? "))
            if aposta <= 0:
                print("A aposta deve ser um valor positivo.")
            elif aposta > carteira:
                print("Você não tem saldo suficiente para essa aposta.")
            else:
                break
        except ValueError:
            print("Por favor, digite um número válido para a aposta.")

    carteira -= aposta
    print("\nGirando os rolos... Boa sorte!")
    time.sleep(1)

    # <-- MUDANÇA AQUI: Usando os pesos para gerar o resultado
    resultado = random.choices(simbolos, weights=pesos, k=3)

    # ... (a animação e a lógica de pagamento continuam iguais)
    for _ in range(10):
        display = random.choices(simbolos, weights=pesos, k=3)
        print(f"  | {display[0]} | {display[1]} | {display[2]} |", end="\r")
        time.sleep(0.1)

    print(f"  | {resultado[0]} | {resultado[1]} | {resultado[2]} | <= O seu resultado!")
    
    ganhos = 0
    if resultado[0] == resultado[1] == resultado[2]:
        simbolo_vencedor = resultado[0]
        multiplicador = pagamentos[simbolo_vencedor][0]
        ganhos = aposta * multiplicador
        print(f"🎉 INCRÍVEL! Três '{simbolo_vencedor}' em linha! Você ganhou R$ {ganhos:.2f}!")
    elif resultado.count("🍒") == 2:
        multiplicador = pagamentos["🍒"][1]
        ganhos = aposta * multiplicador
        print(f"🍒 Legal! Duas cerejas! Você recebeu sua aposta de volta, R$ {ganhos:.2f}.")
    else:
        print("😔 Não foi dessa vez. Mais sorte na próxima rodada!")

    carteira += ganhos
    return carteira

# --- Estrutura Principal do Cassino ---

def mostrar_menu(carteira):
    """Exibe o menu principal do cassino."""
    print("\n" + "="*30)
    print("      🐍 CASSINO PYTHON 🐍")
    print("="*30)
    print(f"💰 Sua carteira: R$ {carteira:.2f}")
    print("\nEscolha um jogo:")
    print("  1 - Adivinhe o Número 🎲")
    print("  2 - Blackjack (Vinte e Um) 🃏")
    print("  3 - Caça-Níqueis (Slot Machine) 🎰")
    print("  0 - Sair do Cassino")
    print("="*30)

def main():
    """Função principal para iniciar e gerenciar o cassino."""
    carteira = 10000.00
    print("Bem-vindo ao Cassino Python!")
    print(f"Você começa com R$ {carteira:.2f}. Boa sorte!")

    while True:
        mostrar_menu(carteira)
        
        if carteira <= 0:
            print("\nVocê não tem mais dinheiro! Fim de jogo. 😢")
            break

        escolha = input("Digite o número da sua escolha: ")

        if escolha == '1':
            carteira = jogo_adivinha(carteira)
        elif escolha == '2':
            carteira = jogo_blackjack(carteira)
        elif escolha == '3':
            carteira = jogo_slot_machine(carteira)
        elif escolha == '0':
            print("\nObrigado por jogar! Volte sempre.")
            break
        else:
            print("\nOpção inválida! Por favor, escolha uma das opções do menu.")
        
        time.sleep(2)

# Ponto de entrada do programa
if __name__ == "__main__":
    main()