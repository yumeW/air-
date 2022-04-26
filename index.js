

const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');



const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get ('/api',(request, response) => {
    database.find ({}, (err, data)=> {
     if (err){
       response.end ();
       return;
     }
      response.json(data)
    });
});

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});


app.get('/airQuality/:latlon', async (request, response) => {
//console.log (request.params)
const latlon= request.params.latlon.split (',');
//console.log (latlon);
const lat = latlon[0];
const lon = latlon[1];
//console.log (lat,lon);
//make it a string literal 
const airApi_url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=0087d05ea5b09bd4a4f7f93457c83a64`;
// const api_url= `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`
//const api_url= `https://api.openaq.org/v2/latest?coordinates=51.53,-0.12`;
const airApi_response = await fetch (airApi_url);
const airApi_data = await airApi_response.json();

const data = {
  air_quality: airApi_data
}
response.json (data);

});



