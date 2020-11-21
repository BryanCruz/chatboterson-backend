const {
  drawBoard,
  resetBoard,
  isMoveAllowed,
  playerMove,
  botMove,
  setSymbols,
  isGameOver,
  hasSomeoneWon
} = require("./game");

const getRandomMessage = messages => {
  return messages[Math.floor(Math.random() * messages.length)];
};

const createMessage = possibleMessages => ({
  fulfillmentText: getRandomMessage(possibleMessages)
});

const createCard = content => {
  const message = Array.isArray(content) ? getRandomMessage(content) : content;

  return {
    text: {
      text: [message]
    }
  };
};

const createBoardCards = () =>
  drawBoard()
    .split("\n")
    .map(line => createCard(line));

const createCards = cards => ({ fulfillmentMessages: cards });

const gameLoop = params => {
  const { linha, coluna } = params;

  const coord = `${coluna}${linha}`;
  
  const cards = [];
  if (!isMoveAllowed(coord)) {
    cards.push(createCard("Não é possível jogar nessa posição, escolha outra.!"));
    cards.push(...createBoardCards());
    return createCards(cards);
  }

 
  const restartGameMessage =
    "Se quiser jogar novamente basta escrever 'repetir'. Se não quiser, digite 'finalizar'";
  const tieGameMessage = getRandomMessage(["Empatou D:", "Deu velha!"]);

  playerMove(coord);

  cards.push(createCard("Boa jogada!"));
  cards.push(...createBoardCards());
  cards.push(createCard("."));

  if (isGameOver()) {
    if (hasSomeoneWon()) {
      cards.push(createCard(["Você ganhou!", "Você deu sorte"]));
    } else {
      cards.push(createCard(tieGameMessage));
    }
    
    resetBoard();
    cards.push(createCard(restartGameMessage));
    return createCards(cards);
  }

  const botCoord = botMove();
  cards.push(createCard(`Eu vou jogar na posição ${botCoord}`));
  cards.push(...createBoardCards());
  
  if (isGameOver()) {
    if (hasSomeoneWon()) {
      cards.push(
        createCard(["Você perdeu!", "Achei fácil", "Teeente outra vez"])
      );
    } else {
      cards.push(createCard(tieGameMessage));
    }
    
    resetBoard();
    cards.push(createCard(restartGameMessage));
    return createCards(cards);
  }

  cards.push(createCard(["Escolha sua posição", "Su-su-sua vez!", "Sua jogada", "Vai lá campeão!"]));
  return createCards(cards);
};

const reset = params => {
  console.log("reset");
  const { simbolo } = params;
  resetBoard();

  if (simbolo !== undefined) {
    setSymbols(simbolo);
  }

  return createCards([
    createCard([
      "Iniciando novo jogo, prepare-se para perder!",
      "Um novo jogo? Vamos lá então!",
      "Novo jogo! É hora do duelo!"
    ]),
    ...createBoardCards(),
    createCard("Escolha uma posição")
  ]);
};

const finish = () => {
  resetBoard();

  return createMessage([
    "Até a próxima então",
    "Beleza, a gente se vê por aí",
    "É isso então, até mais"
  ]);
};

const fallback = () => {
  return createMessage(["Desculpa, não entendi"]);
};

module.exports = {
  gameLoop,
  reset,
  finish,
  fallback
};
