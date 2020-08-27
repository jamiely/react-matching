import React from 'react';
import Card from './Card';
import './Board.css';

// we want the jitter to persist for the cards
const minRotation = 1;
const maxRotation = 5;
const shouldInclude90DegreeTurns = false;
const chanceOfRotation = .5;
const rotations = (() => {
  const rotations = [];
  const getRotation = () => {
    const initial = Math.floor(Math.random() * maxRotation) + minRotation;
    const sign = Math.random() <= .5 ? -1 : 1;
    return initial * sign;
  };
  for(let i = 0; i < 100; i++) {
    const shouldRotate = Math.random() < chanceOfRotation;
    let rotation = shouldRotate ? getRotation(): 0;
    if(shouldInclude90DegreeTurns && Math.random() < .3) {
      const adjustment = Math.floor(Math.random() * 4) * 90;
      rotation += adjustment;
    }

    rotations.push(rotation);
  }
  return rotations;
})();

const minJitter = 1;
const maxJitter = 15;
const chanceOfJittering = .5;
const jitters = (() => {
  const rtn = [];
  const getJitter = () => Math.floor(Math.random() * maxJitter) + minJitter;
  for(let i = 0; i < 100; i++) {
    const shouldJitter = Math.random() < chanceOfJittering;
    rtn.push(shouldJitter ? [getJitter(), getJitter()]: [0, 0]);
  }
  return rtn;
})();

console.log(jitters);

function Board({cards, onClick, fontSize}) {
  const onCardClickGen = (cardIndex) => {
    return (card) => {
      onClick({cardIndex, ...card})
    };
  };

  return (
    <div className="board" style={{fontSize: fontSize}}>
      { cards.map ((card, index) => {
        const rotation = rotations[index % rotations.length];
        const [jx, jy] = jitters[index % jitters.length];
        const transforms = `rotate(${rotation}deg) translate(${jx}px, ${jy}px)`
        return <Card key={index} style={{transform: transforms}} card={card} onClick={onCardClickGen(index)} /> 
      }) }
    </div>
  )
}

export default Board;
