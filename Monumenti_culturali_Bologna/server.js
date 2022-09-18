/******************************* richiamo tutti i moduli *******************************/
const express = require('express')                              // chiamo il modulo express
const app = express()                                           // creo server
const res = require('ejs')                                      // chiamo il modulo ejs
const fs = require('fs');                                       // chiamo il modulo fs
const CSVtoJSON = require('csvtojson')

/***************************** conversione del file da csv a json *****************************/
const csvfilepath = "views/DataStrutture.csv"

CSVtoJSON()
    .fromFile(csvfilepath);
    //.then((json)
    // => {}

    // scrittura del file json
    //  fs.writeFileSync("strutture.json", JSON.stringify(json)
    //);
//);

// lettura del file Json
let strutture = JSON.parse(fs.readFileSync("strutture.json"));

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
// definizione di view come cartella principle
app.set('views', __dirname);

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

//  ENDPOINT GET. per acquisire i dati dal file json
app.get('/dataStrutture', (req, res) => {
    console.log("Caricamento dati...")
    res.send(strutture);
});

app.get('*', (req, res) => {
    res.render('./views/404.html');
})

// 4° ENDPOINT GET. Necessario per ricerca e acquisizione dati
app.get("/cercaNome", (req, res) => {   
    // acquisisisco i dati
    let nome = req.body.Denominazione;
    let trovaStruttura = strutture.find(s => s.Denominazione === nome);
    if(trovaStruttura){
        console.log("Trovata struttura " + nome);
        res.status(200).send("Trovata struttura");
    }else{
        res.status(404).send("Struttura non trovata!")
        console.log("struttura INESISTENTE");
    }
/*
    // acquisiszione dei dati
    let nome = req.params.param;
    console.log("Trovata struttura" + nome);
    res.send();*/

    /*
    if(nome != ""){
            const dati = 
                strutture.find(d => d.Denominazione === nome);     
            // richiesta andata a buon fine, restituisco l'elemento
            console.log("Trovata struttura" + nome) 
            res.render("./views/risultatoRicerca.html");
        } else {
            // richiesta non andata a buon fine
            res.render('./views/404.html');
        }    */
});

app.get("/ricercaQuartiere", (req, res) => {
    if(strutture.includes(param)){   
        let dati = 
            strutture.find(d => d.Quartiere === req.query.quartiere);     
        // richiesta andata a buon fine
        // dalle strutture viene preso l'elemento 
        res.status(200).send(strutture[strutture.indexOf(dati)]);
    } else {
        // richiesta non andata a buon fine
        res.sendStatus(404);
    }
})

app.get("/ricercaTipo", (req, res) => {
    if(strutture.includes(param)){   
        let dati = 
            strutture.find(d => d.Categoria === req.query.tipo);     
        // richiesta andata a buon fine
        // dalle strutture viene preso l'elemento 
        res.status(200).send(strutture[strutture.indexOf(dati)]);
    } else {
        // richiesta non andata a buon fine
        res.sendStatus(404);
    }
})

/* --------------- ENDPOINT: POST -------------- */
// devo inserire una struttura e definisco il tipo di azione
app.post("/inserimento", (req, res) => {
     
    // acquisisco i dati
    let denominazione = req.body.denominazione;
    let quartiere     = req.body.quartiere;
    let indirizzo     = req.body.indirizzo;
    let latitudine    = req.body.latitudine;
    let longitudine   = req.body.longitudine;

    // controllo che non siano vuoti
    if(denominazione == "" || quartiere == "" || indirizzo == "" ||
        latitudine == "" || longitudine == ""){
            res.sendStatus(404);
    } else {
            // inserisco gli elementi nel file letto
            strutture.push(req.body);
            // aggiungo elementi al file
            fs.writeFileSync("strutture.json", JSON.stringify(strutture));        
            res.status(200);
    }   
});

/* --------------- ENDPOINT: DELETE -------------- */
app.delete("/rimuovi", (req, res) => {
    // acquisisisco i dati
    let nome = req.body.Denominazione;
    
    let eliminaStruttura = strutture.find(s => s.Denominazione === nome);
    console.log("Rimozione della struttura " + nome);
        
    strutture.splice((strutture.indexOf(eliminaStruttura)), 1);
        
    fs.writeFileSync("strutture.json", JSON.stringify(strutture));
    res.status(200).send("Elemento eliminato correttamente!");
    if(!eliminaStruttura){
        res.status(404).send("Struttura non trovata!")
    }    
  });
