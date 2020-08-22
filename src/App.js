import React, {useState, useEffect} from 'react';
import './App.css';
import _ from 'lodash';
import Board from './components/Board';

const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const QUERY_CHARS = 'characters';

const synth = window.speechSynthesis;
const voices = synth.getVoices();

const CARD_FLIP_DELAY = 1000;

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

  if(showedValues.length === 2) return cards;
  if(showedValues.length === 0) {
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

function say(word, {voiceIndex, volume}) {
  console.log(`Voice index ${voiceIndex} volume ${volume}`);
  const utterThis = new SpeechSynthesisUtterance(word);
  utterThis.voice = voices[voiceIndex ?? 0];
  utterThis.volume = volume;
  synth.speak(utterThis);
}

function calcIsWin(cards) {
  return !cards.find(c => !c.hidden);
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
    urlParams.get(QUERY_CHARS) ?? LOWERCASE_LETTERS,
    urlParams.get('cardCount') ?? 13));
  const [revealedCount, setRevealedCount] = useState(0);
  const [voiceIndex, setVoiceIndex] = useState(getInitialVoiceIndex());
  const [volumePct, setVolumePct] = useState(50);
  const volume = volumePct / 100;

  console.log(`Starting with voice index ${voiceIndex}`);

  function onClick(arg) {
    const {cardIndex, recite} = arg;
    const card = cards[cardIndex];
    if(card.hidden) return;

    if(revealedCount >= 2) return;
    say(recite, {voiceIndex, volume});

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

  }, [revealedCount, cards])

  const isWin = calcIsWin(cards);
  console.log(`isWin? ${isWin}`);

  if(isWin) {
    say('You won!', {voiceIndex, volume});
  }

  let content = isWin ? 
    <div className="youWin">You Won!</div> :
    <Board cards={cards} onClick={onClick} />;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Matching</h1>
      </header>
      <section className="App-main">
        {content}        
      </section>
      <section className="controls">
        <ul className="letterList">
          <li><a href={`/?${QUERY_CHARS}=` + UPPERCASE_LETTERS}>Uppercase Letters</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + LOWERCASE_LETTERS}>Lowercase Letters</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + NUMBERS}>Numbers</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + UPPERCASE_LETTERS.substr(0, 13)}>Uppercase Letters (1st half)</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + UPPERCASE_LETTERS.substr(13, 13)}>Uppercase Letters (2nd half)</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + LOWERCASE_LETTERS.substr(0, 13)} >Lowercase Letters (1st half)</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + LOWERCASE_LETTERS.substr(13, 13)}>Lowercase Letters (2nd half)</a></li>
        </ul>

        <fieldset>
          <legend>Volume Controls</legend>
          <select value={voiceIndex} onChange={evt => setVoiceIndex(evt.target.value)}>
            {voices.map((voice, index) =>
              <option key={voice.name} value={index}>{voice.name}</option>)}
          </select>
          <label for="volumeSlider">
            Volume: <input type="range" min="0" max="100" class="slider"
              id="volumeSlider"
              value={volumePct}
              onChange={evt => setVolumePct(evt.target.value)} />
          </label>
        </fieldset>
      </section>
    </div>
  );
}

export default App;
