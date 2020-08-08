import React, {useState, useEffect, useRef, useReducer} from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash';
import Board from './components/Board';

const baseCards = _.range(2).map(i => {
  return {
    text: String.fromCharCode(i + 65),
    faceDown: true
  };
});

const initialCards = _.shuffle(baseCards.concat(...baseCards));

function makeCardsFaceDown(cards) {
  return cards.map(card => {
    return {...card, faceDown: true};
  });
}

const CARD_FLIP_DELAY = 5000;


function App() {
  const [cards, setCards] = useState(initialCards);
  const [revealedCount, setRevealedCount] = useState(0);

  function onClick(arg) {
    console.log(arg)
    const {cardIndex} = arg;
    const newCards = cards.map((card, index) => {
      if(index !== cardIndex) return card;

      const faceDown = !card.faceDown;

      if(! faceDown) {
        setRevealedCount(revealedCount + 1);
      }

      return {...card, faceDown: faceDown}
    });

    setCards(newCards);
  }

  useEffect(() => {
    console.log(revealedCount);
    if(revealedCount < 2) return;

    setTimeout(() => {
      setCards(makeCardsFaceDown(cards));
    }, CARD_FLIP_DELAY);

  }, [revealedCount])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Board cards={cards} onClick={onClick} />
      </header>
    </div>
  );
}

export default App;
