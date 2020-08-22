import React from 'react';
import Card from './Card';
import './Board.css';

// we want the jitter to persist for the cards
const minRotation = 1;
const maxRotation = 5;
const rotations = (() => {
  const rotations = [];
  const getRotation = () => Math.floor(Math.random() * maxRotation) + minRotation;
  for(let i = 0; i < 100; i++) {
    const shouldRotate = Math.random() > .7;
    rotations.push(shouldRotate ? getRotation(): 0);
  }
  return rotations;
})();

const minJitter = 1;
const maxJitter = 10;
const chanceOfJittering = .3;
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

function Board({cards, onClick}) {
  const onCardClickGen = (cardIndex) => {
    return (card) => {
      onClick({cardIndex, ...card})
    };
  };

  return (
    <div className="board">
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
