export const indexPage = (req, res, next) => {
    res.render('layout', {content: 'index', title: 'Server Rendered React'})
}

export const altPage = (req, res, next) => {
    res.render('layout', {content: 'alt', title: 'Server Rendered React'})
}

