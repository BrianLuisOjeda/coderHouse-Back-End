const express = require('express')
const Contenedor = require('./contenedor')
const contenedor = new Contenedor("productos.json");

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/productos', async (req, res) => {
    const productos = await contenedor.getAll();
    res.render('pages/list',{productos})
})

app.get('/', (req,res) => {
    res.render('pages/form', {})
})

app.post('/productos', async(req,res) => {
    const {body} = req;
    await contenedor.save(body);
    res.redirect('/');
})


const PORT=8080
const server = app.listen(PORT, () => { console.log(`servidor funcionando en el puerto http://localhost:8080`)
})
server.on('error', (error) => console.log(error))