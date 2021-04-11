// Required by Webpack - do not touch
// require('../favicon.ico')
// require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
// require.context('../stylesheets/', true, /\.(css|scss)$/i)

// TODO
import React from 'react'
import ReactDOM from 'react-dom'


import App from './components/App'
import DashBoard from './components/DashBoard'
import SignUpForm from './components/auth/SignUpForm'
import SignInForm from './components/auth/SignInForm'
import SignOut from './components/auth/SignOut'

if(document.getElementById('main')){
    ReactDOM.render(<App />, document.getElementById('main'))
}else if(document.getElementById('dashboard')){
    ReactDOM.render(<DashBoard />, document.getElementById('dashboard'))
}else if(document.getElementById('signin')){
    ReactDOM.render(<SignInForm />, document.getElementById('signin'))
} else if(document.getElementById('signup')){
    ReactDOM.render(<SignUpForm />, document.getElementById('signup'))
}

if(document.querySelector('#_sign_user_out')){
    document.querySelector('#_sign_user_out').onclick = (e) => {
        let el = document.createElement('div')
        document.body.appendChild(el)
        ReactDOM.render(<SignOut/>, el)
    }
}

module.hot.accept() //see https://www.robinwieruch.de/minimal-react-webpack-babel-setup
