// Required by Webpack - do not touch
// require('../favicon.ico')
// require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
// require.context('../stylesheets/', true, /\.(css|scss)$/i)

// TODO
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

ReactDOM.render(<App />, document.getElementById('main'))


if (document.querySelector('#_sign_user_out')) {
    document.querySelector('#_sign_user_out').onclick = (e) => {
        let el = document.createElement('div')
        document.body.appendChild(el)
        ReactDOM.render(<SignOut />, el)
    }
}

module.hot.accept() //see https://www.robinwieruch.de/minimal-react-webpack-babel-setup
