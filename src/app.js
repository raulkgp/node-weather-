const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const hbs = require('hbs')

//Define paths for express config
const viewpath = path.join(__dirname, '../templates/views')
const partialpath = path.join(__dirname, '../templates/partials')

// setup handler
app.set('view engine', 'hbs')
app.set('views', viewpath)
hbs.registerPartials(partialpath)

app.use(express.static(path.join(__dirname, '../public')))

app.get('/about', (req, res)=>{
    res.render('about', {
        title:'About me',
        name: 'Rahul Sardar'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText:'This is soome helpful text',
        title:'help',
        name: 'Rahul Sardar'
    })
})

app.get('', (req, res) => {
    res.render('index', {
        title:'Weather app',
        name: 'Rahul Sardar'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) =>{
        if(error){
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastdata) => {
            if(error){
                return res.send({ error })
            }

            res.send({
                forecast: forecastdata,
                location,
                address: req.query.address
            })

        })
    })

})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) =>{
    res.render('404',{
        title: '404',
        name: 'Rahul Sardar',
        message: 'Help  not found'
    })
})

app.get('*', (req, res) =>{
    res.render('404',{
        title: '404',
        name: 'Rahul Sardar',
        message: 'Page not found'
    })
})
app.listen(port, () =>{
    console.log('Server is up on port.' + port)
})