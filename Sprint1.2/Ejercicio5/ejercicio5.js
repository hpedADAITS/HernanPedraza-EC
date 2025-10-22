const board = document.getElementById('gameBoard');
const message = document.getElementById('message');
const cardsArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cards = [...cardsArray, ...cardsArray];
cards.sort(() => 0.5 - Math.random());
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
cards.forEach(letter => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.letter = letter;
  card.textContent = '';
  board.appendChild(card);
  card.addEventListener('click', () => handleCardClick(card));
});
function handleCardClick(card) {
  if (lockBoard || card.classList.contains('revealed') || card.classList.contains('matched')) return;
  card.textContent = card.dataset.letter;
  card.classList.add('revealed');
  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true;
    if (firstCard.dataset.letter === secondCard.dataset.letter) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matchedPairs++;
      resetTurn();
      if (matchedPairs === cardsArray.length) {
        message.textContent = '¡Felicidades! Has encontrado todas las parejas 🎉';
      }
    } else {
      setTimeout(() => {
        firstCard.textContent = '';
        secondCard.textContent = '';
        firstCard.classList.remove('revealed');
        secondCard.classList.remove('revealed');
        resetTurn();
      }, 1000);
    }
  }
}
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}
