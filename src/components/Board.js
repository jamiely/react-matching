import React from 'react';
import Card from './Card';
import './Board.css';

function determineNumberOfColumns(cards) {
  return Math.max(
    Math.min(Math.floor(cards.length / 5), 8),
    5);
}

function Board({cards, onClick}) {
  const onCardClickGen = (cardIndex) => {
    return (card) => {
      onClick({cardIndex, ...card})
    };
  };

  const columns = determineNumberOfColumns(cards);

  return (
    <div className="board" style={{gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
      { cards.map ((card, index) => 
        <Card key={index} {...card} onClick={onCardClickGen(index)} /> ) }
    </div>
  )
}

export default Board;
