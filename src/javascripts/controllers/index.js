export const indexPage = (req, res, next) => {
    res.render('layout', {content: 'index', title: 'Server Rendered React'})
}

export const dashBoardPage = (req, res, next) => {
    res.render('layout', {content: 'dashboard', title: 'Server Rendered React'})
}

export const signInPage = (req, res, next) => {
    res.render('layout', {content: 'signin', title: 'My App'})
}

export const signUpPage = (req, res, next) => {
    res.render('layout', {content: 'signup', title: 'My App'})
}

export const notAuthorizedPage = (req, res, next) => {
    res.render('layout', {msg: 'Not Authorized', content: '',   title: 'My App'})
}