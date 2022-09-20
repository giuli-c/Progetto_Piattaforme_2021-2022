/******************************* richiamo tutti i moduli *******************************/
const express = require('express')                              // chiamo il modulo express
const app = express()                                           // creo server
//const res = require('ejs')                                      // chiamo il modulo ejs
const fs = require('fs');                                       // chiamo il modulo fs
const CSVtoJSON = require('csvtojson')

/***************************** conversione del file da csv a json *****************************/
const csvfilepath = "views/DataStrutture.csv"
let strutture;

// trasformazione del file CSV in json
CSVtoJSON().fromFile(csvfilepath).then((json) => {
        // strutture diventa l'oggetto Json;
        strutture = json;
    });

/******************************* SETTAGGI PRINCIPALI *******************************/
// Inizializzazione tramite express.
app.use(express.static('public'));
app.use(express.json());

// utilizzo dei pacchetti e delle richieste json
app.use(express.json());
app.use(express.urlencoded({extended: true}));  // per fare leggere i dati dal form

// definizione del motore di ricerca html
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);                    // definizione di view come cartella principle

//settaggio della porta del localhost
app.set('port', process.env.PORT || 3800);
var server = app.listen(app.get('port'), function() {
  console.log('The server listening on port ' + server.address().port);
});

/******************************* END POINT GET *******************************/ 
// 1° ENDPOINT GET. Necessario per la visualizzazione delle varie pagine
app.get('/', (req, res) => {
    res.render('./views/index.html');
})

app.get('/new', (req, res) => {
    res.render('./views/new.html');
})

app.get('/ricerca', (req, res) => {
    res.render('./views/cerca.html');
})

app.get('/rimuovi', (req, res) => {
    res.render('./views/rimuovi.html');
})

app.get('/tabella', (req, res) => {
    res.render('./views/tabella.html');
})

// 2° ENDPOINT GET. Necessario per caricare i dati dal file Json nascosto
app.get('/dataStrutture', (req, res) => {
    console.log("Caricamento dati...")
    res.send(strutture);
});

// 3° ENDPOINT GET. Necessario per ricerca delle strutture
app.get("/cercaNome", (req, res) => {   
    // acquisisisco i dati
    let nome = req.query.Denominazione;

    let trovaStrutturaNome = strutture.find(s => s.Denominazione === nome);
    if(trovaStrutturaNome){
        console.log("Trovata struttura: " + nome);
        res.status(200).send(trovaStrutturaNome);
    }else{
        res.status(404).send("Struttura inesistente!");
    }
});

app.get("/cercaTipo", (req, res) => {
    // acquisisco dati
    let tipo = req.query.Categoria;
    let dati = [];

    for(let element of strutture){
        if(element.Categoria === tipo){
            dati.push(element);
        }
    }    

    if(dati){
        res.status(200).send(dati);
    }else{
        res.status(404).send("Struttura non trovata!")
    }
});

app.get("/cercaQuartiere", (req, res) => {
    // acquisisco dati
    let quartiere = req.query.Quartiere;
    let dati = [];

    for(let element of strutture){
        if(element.Quartiere === quartiere){
            dati.push(element);
        }
    }    

    if(dati){
        res.status(200).send(dati);
    }else{
        res.status(404).send("Struttura inesistente!")
    }
});

// 4° ENDPOINT GET. Necessario per inviare messaggio di errore a tutte le pagine non trovate
app.get('*', (req, res) => {
    res.render('./views/404.html');
})

/******************************* ENDPOINT: POST *******************************/
// devo inserire una struttura e definisco il tipo di azione
app.post("/inserimento", (req, res) => {
     
    // acquisisco i dati
    let denominazione = req.body.denominazione;
    let quartiere     = req.body.quartiere;
    let indirizzo     = req.body.indirizzo;
    let descrizione   = req.body.descrizione;
    let latitudine    = req.body.latitudine;
    let longitudine   = req.body.longitudine;

    // controllo che non siano vuoti o che il dato non sia già presente
    if(denominazione == "" || quartiere == "" || indirizzo == "" ||
        latitudine == "" || longitudine == "" /*&& 
        denominazione == denominazione || quartiere == quartiere || 
        indirizzo == indirizzo || latitudine == latitudine || 
        longitudine == longitudine*/){
            res.status(404).send("struttura già esistente!");
    } else {
        let data = '\n' + // Per evitare di appenderlo all'ultima riga
                denominazione + ',' +
                quartiere     + ',' +
                indirizzo     + ',' + 
                descrizione   + ',' + 
                latitudine    + ',' + 
                longitudine   + ',';

        console.log(data);
        // inserisco gli elementi nel file letto
        //strutture.push(req.body);
        fs.appendFileSync('./views/DataStrutture.csv', data);
        res.status(200);
    }   
});

/******************************* ENDPOINT: DELETE *******************************/
app.delete("/rimuovi", (req, res) => {
    // acquisisisco i dati
    let nome = req.body.Denominazione;
    
    // ricerco la struttura richiesta
    let eliminaStruttura = strutture.find(s => s.Denominazione === nome);
    console.log("Rimozione della struttura " + nome);
        
    for(let element of strutture){
        if(element.Denominazione === nome){
            strutture.splice((strutture.indexOf(eliminaStruttura)), 1);
            res.status(200).send(eliminaStruttura);
        } else {
            res.status(404).send("Impossibile rimuovere la struttura! Struttura non trovata.")
        }    
    }
  })
