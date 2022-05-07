export const indexPage = (req, res, next) => {
    res.render('layout', { content: 'index', title: 'Server Rendered React' })
}

export const notAuthorizedPage = (req, res, next) => {
    res.render('layout', { msg: 'Not Authorized', content: '', title: 'My App' })
}