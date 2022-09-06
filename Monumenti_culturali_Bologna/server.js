// chiamo il modulo express
const express = require('express')
// creo server
const app = express()

// chiamo il modulo ejs
const res = require('ejs')

// chiamo il modulo fs
const fs = require('fs');

// settaggi principali
// Inizializzazione tramite express.
app.use(express.static("public"));
app.use(express.json());

// Per le richieste json.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

///?????????????????????????
// definizione del motore di ricerca html
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// definizione di view come cartella principle
app.set('views', __dirname);

/* END POINT degli API */ 
// 1° END POINT. Necessario per entrare nella pagina principale (index)
app.get('/', (req, res) => {
    res.render('./views/index.html');
})
/*
// end point per rendering pagina HTML
app.get('/mappa', (req,res) => {
    res.render('./view/index.html');
})
*/

// 2° END POINT. Necessario per caricare i dati dal file csv
app.get('/datacsv', (req, res) => {
    console.log("Carico dati")
    res.type('text/csv').sendFile(__dirname + '/views/data.csv');
})

app.listen(4000)