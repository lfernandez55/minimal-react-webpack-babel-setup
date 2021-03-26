# minimal-react-plus-express

This is built on top of minimal-react-webpack-babel-setup see (https://www.robinwieruch.de/minimal-react-webpack-babel-setup/).

## Features

- React 16
- Webpack 5
- Babel 7
- Hot Module Replacement
- Express
- This setup doesn't compile css thereby keeping things simpler. . . .

## Installation

- npm install
- open two terminals
- in the left one do npm run build
- in the right one do npm run serve
- visit `http://localhost:8080/`

### How to get from minimal-react-webpack-babel-setup to this express version:

- npm install @babel/cli @babel/node --save-dev
- npm install express ejs --save
- npm install nodemon --save-dev
- add "server": "nodemon server.js --exec babel-node" to package.json
- add server.js
- rename src to srcOLD
- add new src folder and files (these contain react componenets and server routes,views,controllers)
- add public folder (the sever's static pages are served out of here rather than dist)
- in webpack:
-- change output folder from dist to public
-- change entry point from src/index.js to src/javascripts/main
-- added watch: true (this will recompile react files every time a change is made)
- added public/stylesheets/main.css (this is referenced by layout.ejs)
