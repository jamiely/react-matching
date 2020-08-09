import React from 'react';
import Card from './Card';
import './Board.css';

function Board({cards, onClick}) {
  const onCardClickGen = (cardIndex) => {
    return (card) => {
      onClick({cardIndex, ...card})
    };
  };

  return (
    <div className="board">
      { cards.map ((card, index) => 
        <Card key={index} {...card} onClick={onCardClickGen(index)} /> ) }
    </div>
  )
}

export default Board;
