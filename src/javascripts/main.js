// Required by Webpack - do not touch
// require('../favicon.ico')
// require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
// require.context('../stylesheets/', true, /\.(css|scss)$/i)

// TODO
import React from 'react'
import ReactDOM from 'react-dom'


import App from './components/App'
import Alt from './components/Alt'

if(document.getElementById('main')){
    ReactDOM.render(<App />, document.getElementById('main'))
}else{
    ReactDOM.render(<Alt />, document.getElementById('alt'))
}


