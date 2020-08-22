import React from 'react';
import 'pattern.css';

const possiblePatterns = [
  'pattern-diagonal-stripes-md',
  'pattern-vertical-stripes-md'
];
const pattern = possiblePatterns[Math.floor(Math.random() * possiblePatterns.length)];
const possibleColors = [
  ['PaleVioletRed', 'pink'],
  ['blue', 'navy'],
  ['green', 'forestgreen'],
  ['cyan', 'DarkTurquoise'],
  ['BurlyWood', 'Peru'],
  ['violet', 'darkviolet']
];
const [backgroundColor, borderColor] = possibleColors[Math.floor(Math.random() * possibleColors.length)];

function Card({card, style, onClick}) {
  let {text, faceDown, hidden} = card;

  hidden = hidden ?? false;

  faceDown = faceDown ?? false;
  const classNames = ['card'];
  if(faceDown) {
    classNames.push('faceDown');
    classNames.push(pattern);
  }
  else {
    classNames.push('faceUp');
  }
  if(faceDown) {
    text = '';
  }
  if(hidden) {
    classNames.push('hidden');
  }

  let styles = {
    ...style
  };

  if(!hidden) {
    styles = {
      ...styles,
      backgroundColor, 
      borderColor
    };
  }

  return (
    <div className={classNames.join(' ')}
      style={styles}
      onClick={() => onClick(card)}>{text}</div>
  )
}

export default Card;