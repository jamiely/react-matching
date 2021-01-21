import React, {useState, useEffect} from 'react';
import './App.css';
import _ from 'lodash';
import Board from './components/Board';

const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const SIGHT_WORDS = ["you", "the", "why", "do", "go", "some", "one", "two", "blue", "look", "where", "down", "who", "here", "said", "come"];
const SIGHT_WORDS1 = SIGHT_WORDS;

const LETTER_WORDS = 
  _.zip(UPPERCASE_LETTERS.split(''), LOWERCASE_LETTERS.split(''))
  .map(([upper, lower]) => `${upper}${lower}:${lower}`);

const NUMBERS = '0123456789';
const QUERY_CHARS = 'characters';
const QUERY_WORDS = 'words';
const INITIAL_REVEAL_MILLIS = 5000;
const REVEAL_MILLIS = 2000;

const synth = window.speechSynthesis;
const voices = synth.getVoices();

const CARD_FLIP_DELAY = 1000;

console.log(voices);

let revealBeforeStart = false;

function generateCardsByCharacter(allowedLetters, cardCount) {
  console.log(allowedLetters);

  const baseCards = allowedLetters.split('').map(c => {
    return {
      text: c,
      recite: c.toLowerCase(),
      faceDown: !revealBeforeStart
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

function createWordsLink(label, words) {
  let url = `?words=${words.join(',')}&fontSize=12pt`;
  return <a href={ url }>{ label }</a>;
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

function getCards(urlParams) {
  if(urlParams.get(QUERY_CHARS)) return getCardsByCharacter(urlParams);
  if(urlParams.get(QUERY_WORDS)) return getCardsByWords(urlParams);

  let words = _.shuffle(LETTER_WORDS);
  words = words.slice(0, 8);

  window.location = `${window.location.href}?words=${words.join(',')}&fontSize=45pt`;
}

function getCardsByWords(urlParams) {
  const words = urlParams.get(QUERY_WORDS) ?? LETTER_WORDS.join(',');
  if(! words) {
    console.error('No words were specified.')
    return [];
  }

  const getCardFromWord = word => {
    const [text, ...rest] = word.split(':');
    let recite = rest.length ? rest[0] : text;
    recite = recite.toLowerCase();

    return {
      text,
      recite,
      faceDown: !revealBeforeStart
    }
  }

  const base = words.split(',').map(getCardFromWord);
  return _.shuffle(base.concat(...base));
}

function getCardsByCharacter(urlParams) {
  const cards = generateCardsByCharacter(
    urlParams.get(QUERY_CHARS) ?? LOWERCASE_LETTERS,
    urlParams.get('cardCount') ?? 13);
  return cards;
}

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const [reveal, setReveal] = useState(true);
  const [cards, setCards] = useState(getCards(urlParams));
  const fontSize = urlParams.get('fontSize') ?? '60pt';

  const flipCards = faceDown =>
    setCards(cards => cards.map(c => {
      return {...c, faceDown: faceDown}
    }));

  useEffect(() => {
    if(! reveal) return;

    flipCards(false);

    setTimeout(() => {
      setReveal(false);
      flipCards(true);
    }, INITIAL_REVEAL_MILLIS);
  }, [reveal])

  const [revealedCount, setRevealedCount] = useState(0);
  const [voiceIndex, setVoiceIndex] = useState(getInitialVoiceIndex());
  const [volumePct, setVolumePct] = useState(50);
  const volume = volumePct / 100;

  console.log(`Starting with voice index ${voiceIndex}`);

  function onClick(arg) {
    const {cardIndex, recite} = arg;
    const card = cards[cardIndex];
    if(card.hidden) return;
    if(!card.faceDown) return;

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
    <Board fontSize={fontSize} cards={cards} onClick={onClick} />;

  const onRevealClick = () => {
    flipCards(false);

    setTimeout(() => {
      setReveal(false);
      flipCards(true);
    }, REVEAL_MILLIS);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Matching <div onClick={onRevealClick} style={{display: 'block', float: 'right'}}>👁</div></h1>
        
      </header>
      <section className="App-main">
        {content}        
      </section>
      <section className="controls">
        <ul className="letterList">
          <li><a href={`/?${QUERY_CHARS}=` + UPPERCASE_LETTERS}>Uppercase Letters</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + LOWERCASE_LETTERS}>Lowercase Letters</a></li>
          <li><a href={`/?fontSize=45pt&${QUERY_WORDS}=` + LETTER_WORDS.join(',')}>Upper and Lowercase Letters Combined</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + NUMBERS}>Numbers</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + UPPERCASE_LETTERS.substr(0, 13)}>Uppercase Letters (1st half)</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + UPPERCASE_LETTERS.substr(13, 13)}>Uppercase Letters (2nd half)</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + LOWERCASE_LETTERS.substr(0, 13)} >Lowercase Letters (1st half)</a></li>
          <li><a href={`/?${QUERY_CHARS}=` + LOWERCASE_LETTERS.substr(13, 13)}>Lowercase Letters (2nd half)</a></li>
          <li><a href={`/?fontSize=45pt&${QUERY_WORDS}=` + LETTER_WORDS.slice(0, 13).join(',')}>Upper and Lowercase Letters Combined (1st half)</a></li>
          <li><a href={`/?fontSize=45pt&${QUERY_WORDS}=` + LETTER_WORDS.slice(13, 26).join(',')}>Upper and Lowercase Letters Combined (2nd half)</a></li>
          <li>{createWordsLink("Sight Words 1", SIGHT_WORDS1)}</li>
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
