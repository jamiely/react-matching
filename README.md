# React Matching

A matching/memory game based on characters. A simple game to teach someone
letters or numbers.

https://demo-matching.jamie.ly

# How to Play

Click on two cards to flip them over. If they match, they'll be removed from
the board. If not, they will be flipped face down. Continue until all the
cards are matched.

# Features

## Characters

Change characters used by clicking on the links. The url parameter
`characters` controls what characters are used in the game. This is
useful if you are trying to teach someone specific characters like
those in their name.

A computer voice will recite the character. There are voice controls at the
bottom of the page for setting voice type and volume.

There are also handy URLs at the bottom of the page preconfigured for
particular character lists.

## Words

Words can be specified to be on the cards using the `words` query string
variable. The format of the words should be:

```
?words=text1:pronunciation1,text2,text3,text4:pronunciation4
```

You can either provide some text which will be pronounced as is, or use a colon
to denote the pronunciation that should be used. Words are comma-delimited.

## Font Size

It is important to set the font size since you may have some really long words.
This is done via the `fontSize` query parameter. Example:

```
?fontSize=50pt
```

# Screenshots

<img src="https://raw.githubusercontent.com/jamiely/react-matching/master/docs/screenshots/match4.png" alt="Matching Grid">
<img src="https://raw.githubusercontent.com/jamiely/react-matching/master/docs/screenshots/controls1.png" alt="Game Controls">

[More screenshots](docs/screenshots.md)

# Screencast

TBD

# Dev Notes

This project uses create-react-app. See the automatically generated
[notes](docs/dev.md) for more information.

