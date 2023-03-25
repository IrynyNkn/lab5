const express = require('express');
const axios = require('axios');

const API_KEY = '55a28335b5bb6849ee957f3ae34cd7a3';

const app = express();
const port = 3000;

const handlebars = require('express-handlebars');
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    partialsDir: __dirname + '/views/partials/'
}));

const hbs = handlebars.create({});

hbs.handlebars.registerHelper('check', function(value, comparator) {
    return (value === comparator) ? '<h2 class="mt-4">Choose a city to see weather</h2>' : '';
});

hbs.handlebars.registerHelper('isActive', function(value, comparator) {
    return (value === comparator) ? 'active' : '';
});

app.use(express.static('public'))

app.get('/', (req, res) => res.render('main', {layout : 'index', page: 'home'}));
app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if(city) {
        const reqUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
        try {
            const weatherResponse = await axios.get(reqUrl);
            const weatherResult = weatherResponse.data;
            const weather = {
                city: weatherResult.name,
                weather: weatherResult?.weather?.[0]?.main,
                description: weatherResult?.weather?.[0]?.description,
                temp: weatherResult?.main?.temp,
                feels_like: weatherResult?.main?.feels_like,
                humidity: weatherResult?.main?.humidity,
                pressure: weatherResult?.main?.pressure
            };
            res.render('weather', {layout : 'index', weather: weather, activeTab: (city || '').toLowerCase(), page: 'weather'})
        } catch (e) {
            res.render('weather', {layout : 'index', weather: {}, page: 'weather'})
        }
    } else {
        res.render('weather', {layout : 'index', page: 'weather'})
    }
});
app.get('/weather/:city', async (req, res) => {
    const city = req.params.city;
    const reqUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    try {
        const weatherResponse = await axios.get(reqUrl);
        const weatherResult = weatherResponse.data;
        const weather = {
            city: weatherResult.name,
            weather: weatherResult?.weather?.[0]?.main,
            description: weatherResult?.weather?.[0]?.description,
            temp: weatherResult?.main?.temp,
            feels_like: weatherResult?.main?.feels_like,
            humidity: weatherResult?.main?.humidity,
            pressure: weatherResult?.main?.pressure
        };
        res.render('weather', {layout : 'index', weather: weather, activeTab: (city || '').toLowerCase(), page: 'weather'})
    } catch (e) {
        res.render('weather', {layout : 'index', weather: {}, page: 'weather'})
    }
});

app.listen(port, () => console.log(`App listening to port ${port}`));