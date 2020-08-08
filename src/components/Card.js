import React from 'react';

function Card(card) {
  let {text, faceDown, onClick} = card;

  faceDown = faceDown ?? false;
  const classNames = ['card'];
  classNames.push(faceDown ? 'faceDown' : 'faceUp');
  if(faceDown) {
    text = '';
  }

  return (
    <div className={classNames.join(' ')} onClick={() => onClick(card)}>{text}</div>
  )
}

export default Card;