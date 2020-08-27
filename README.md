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

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
