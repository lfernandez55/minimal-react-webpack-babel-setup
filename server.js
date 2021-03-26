let express = require('express')
let path = require('path')

//create the web server
export let app = express()

app.set('views', path.join(__dirname, 'src', 'javascripts', 'views'))

// the following is the template engine
app.set('view engine', 'ejs')

// middle ware for processing json files
app.use(express.json())

// helps encode the urls properly
app.use(express.urlencoded({extended: false}))
// set up a place for static files 7:07
app.use(express.static(path.join(__dirname, 'public')))

// Routing
import {configureRoutes} from './src/javascripts/config/routes'
configureRoutes(app)

//Create the web server
let http = require('http')
let server = http.createServer(app)
server.listen(process.env.PORT || '8080')
server.on('error', err => {
    throw err
})

server.on('listening', () => {
    let address = server.address()
    let bind = typeof address === 'string' ? address : address.port
    console.log("Listening on " + bind)
})


