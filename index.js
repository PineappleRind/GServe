import path from 'path'
// Find directory to use (OSX Only)
let dir = process.env.HOME;
/**********
 * Express Initialization
 **********/
import express from 'express';
const app = express();

app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static('public'))
express.static.mime.define({'image/svg': ['svg']});

app.get('/', (req, res) => {
    res.render('index.pug')
})

// Set routes
import getRoutes from './routes/index.js';
getRoutes().then(routes => {
    for (const route in routes) {
        for (const method in routes[route]) {
            app[method](`/${route}`, (req, res) => routes[route][method](req, res, dir));
        }
    }
})

// Listen!
app.listen(8000, ()=>{})