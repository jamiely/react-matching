import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash';
import Board from './components/Board';

const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const synth = window.speechSynthesis;
const voices = synth.getVoices();

console.log(voices);

function generateCards(allowedLetters, cardCount) {
  console.log(allowedLetters);

  const baseCards = allowedLetters.split('').map(c => {
    return {
      text: c,
      recite: c.toLowerCase(),
      faceDown: true
    };
  });

  const slice = baseCards.slice(0, Math.min(baseCards.length, cardCount));
  console.log(`baseCards.length=${baseCards.length} slice count: ${slice.length}`);
  const doubled = slice.concat(...slice);

  const initialCards = _.shuffle(doubled);

  return initialCards;
}

function makeCardsFaceDown(cards) {
  return cards.map(card => {
    return {...card, faceDown: true};
  });
}

function makeMatchingCardsHidden(cards) {
  let showedValues = _.uniq(
    cards.filter(c => ! c.faceDown).map(c => c.text));
  console.log({
    msg: 'evaluating matching',
    showedValues
  });
  console.log(showedValues);
  if(showedValues.length > 3) {
    console.error('There are more than 3 shown values. SHOULD NOT HAPPEN.');
    return cards;
  }

  if(showedValues.length == 2) return cards;
  if(showedValues.length == 0) {
    console.error("Shouldn't happen, there should be at least 1 value");
    return cards;
  }

  let value = showedValues[0]

  return cards.map(card => {
    if(card.text !== value) return card;

    return {
      ...card,
      hidden: true
    };
  });
}

function evaluateCards(cards) {
  return makeCardsFaceDown(makeMatchingCardsHidden(cards));
}

const CARD_FLIP_DELAY = 1000;

function say(word, voiceIndex) {
  console.log(`Voice index ${voiceIndex}`);
  const utterThis = new SpeechSynthesisUtterance(word);
  utterThis.voice = voices[voiceIndex ?? 0];
  synth.speak(utterThis);
}

function getInitialVoiceIndex() {
  for(let i = 0; i < voices.length; i++) {
    if(voices[i].name === 'Samantha') return i;
  }
  return 0;
}

function App() {
  const urlParams = new URLSearchParams(window.location.search);

  const [cards, setCards] = useState(generateCards(
    urlParams.get('letters') ?? LOWERCASE_LETTERS,
    urlParams.get('cardCount') ?? 13));
  const [revealedCount, setRevealedCount] = useState(0);
  const [voiceIndex, setVoiceIndex] = useState(getInitialVoiceIndex());

  console.log(`Starting with voice index ${voiceIndex}`);

  function onClick(arg) {
    const {cardIndex, recite} = arg;
    if(revealedCount >= 2) return;
    say(recite, voiceIndex);

    console.log(arg)
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
      setRevealedCount(0);
      setCards(evaluateCards(cards));
    }, CARD_FLIP_DELAY);

  }, [revealedCount])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Matching</h1>
      </header>
      <section className="App-main">
        <Board cards={cards} onClick={onClick} />
      </section>
      <ul className="letterList">
        <li>{UPPERCASE_LETTERS}</li>
        <li>{LOWERCASE_LETTERS}</li>
      </ul>
      <select value={voiceIndex} onChange={evt => setVoiceIndex(evt.target.value)}>
        {voices.map((voice, index) =>
          <option key={voice.name} value={index}>{voice.name}</option>)}
      </select>
    </div>
  );
}

export default App;
