import React from 'react';

function Card(card) {
  let {text, faceDown, onClick, hidden} = card;

  hidden = hidden ?? false;

  faceDown = faceDown ?? false;
  const classNames = ['card'];
  classNames.push(faceDown ? 'faceDown' : 'faceUp');
  if(faceDown) {
    text = '';
  }
  if(hidden) {
    classNames.push('hidden');
  }

  return (
    <div className={classNames.join(' ')}
      onClick={() => onClick(card)}>{text}</div>
  )
}

export default Card;