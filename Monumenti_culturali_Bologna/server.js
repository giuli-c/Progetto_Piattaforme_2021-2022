/******************************* richiamo tutti i moduli *******************************/
const express = require('express')                              // chiamo il modulo express
const app = express()                                           // creo server
const res = require('ejs')                                      // chiamo il modulo ejs
const fs = require('fs');                                       // chiamo il modulo fs
const CSVtoJSON = require('csvtojson')

/***************************** conversione del file da csv a json *****************************/
const csvfilepath = "views/DataStrutture.csv"

CSVtoJSON()
    .fromFile(csvfilepath).then((json) => {

    // scrittura del file json
    fs.writeFileSync("strutture.json", JSON.stringify(json), "utf-8",(err) => {
        if(err){
            console.log(err)
        }
    });
});

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
// 1° ENDPOINT GET. Necessario per viasualizzare tutte le strutture
app.get('/strutture', (req, res) => {
    if(strutture.length == 0){
        res.sendStatus(404);
    } else {
        res.send(strutture)
    }
})

// 2° ENDPOINT GET. Necessario per la visualizzazione delle varie pagine
app.get('/', (req, res) => {
    res.render('./views/index.html');
})

app.get('/new', (req, res) => {
    res.render('./views/new.html');
})

app.get('/ricerca', (req, res) => {
    res.render('./views/ricerca.html');
})

app.get('/rimuovi', (req, res) => {
    res.render('./views/rimuovi.html');
})

app.get('/tabella', (req, res) => {
    res.render('./views/tabella.html');
})

app.get('*', (req, res) => {
    res.render('./views/404.html');
})


// 4° ENDPOINT GET. Necessario per ricerca e acquisizione dati
/*app.get("/ricerca", (req, res) => {
  let strutture = CSVToArray(fileSystem.readFileSync("./views/DataStrutture.csv"));
  console.log("OK" + strutture);
  if(strutture.includes(param)){
    let dataArray = [];
    console.log("OK" + dataArray);
    strutture.forEach(elemento => {
        dataArray.push(elemento)
    });
    // richiesta andata a buon fine
    res.status(200).send(JSON.stringify(dataArray));
    res.render('./views/trovato.html');
  }
    
});*/

/* --------------- ENDPOINT: POST -------------- */
// devo inserire una struttura e definisco il tipo di azione
app.post("/inserimento", (req, res) => {
     
     // salvo i dati del csv in strutture
    /* let strutture = CSVToArray(fs.readFileSync("./views/DataStrutture.csv"));*/
    
    const ws = fs.createWriteStream("views/DataStrutture.csv")

    /*let csvWrite = wtiteCsv({
        path:'views/DataStrutture.csv',
        header: [
           { id: "denominazione", title: "Denominazione" },
           { id: "quartiere", title: "Quartiere" },
           { id: "indirizzo", title: "Indirizzo" },
           { id: "categoria", title: "Categoria" },
           { id: "descrizione", title: "Descrizione" },
           { id: "latitudine", title: "Latitudine" }, 
           { id: "longitudine", title: "Longitudine" },          
        ]
    }, { append: true });*/

    // acquisisco i dati
    let denominazione = req.body.denominazione;
    let quartiere     = req.body.quartiere;
    let indirizzo     = req.body.indirizzo;
    let categoria     = req.body.categoria;
    let descrizione   = req.body.descrizione;
    let latitudine    = req.body.latitudine;
    let longitudine   = req.body.longitudine;

     // creo un array contenente le info relative ad una riga
    // che dovrà essere inserita nell'array appena creato
    let nuovaStruttura = [
        denominazione + ";" + 
        quartiere     + ";" +
        indirizzo     + ";" +
        categoria     + ";" +
        descrizione   + ";" +
        latitudine    + ";" +
        longitudine];

     // inserisco la nuova struttura nel file csv
     //strutture.push(nuovaStruttura);

     // appendo il file.
     //fs.writeFileSync("./views/DataStrutture.csv", nuovaStruttura, {flag:'a'});
     /*csvWrite
        .writeRecords(nuovaStruttura)
        .then(() =>  console.log('The CSV file was written successfully'));*/
    ws.append(nuovaStruttura);
    fastcsv.write(ws, {headers:true}).pipe(ws);

    console.log(nuovaStruttura);
    console.log(ws);
    res.status(200).send(nuovaStruttura);
   
});

/* --------------- ENDPOINT: DELETE -------------- */
/*app.delete("/rimuovi/:nome", (req, res) => {
    // definizione del nuovo array nella quale inserire i dati presi dal csv
    let strutture = CSVToArray(fileSystem.readFileSync("./views/DataStrutture.csv"));
    let nome = req.params.nome;
    console.log("Rimozione della struttura " + nome);
    let strutturaDaEliminare = strutture.filter(i => i.nome === nome);
    strutture.splice(strutturaDaEliminare, 1);
      
    fileSystem.writeFileSync("./views/DataStrutture.csv", strutture);
    console.log(strutture);
    res.status(200).send("Elemento eliminato correttamente.");
  });

/* FUNZIONI */
// Funzione per convertire da CSV ad array.
/* Preso da https://gist.github.com/luishdez/644215 */
    // This will parse a delimited string into an array of arrays. 
    // The default delimiter is the comma, but this can be overriden in the second argument.
    /*function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not, then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
                (
                        // Delimiters.
                        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                        // Quoted fields.
                        '(?:\"([^\"]*(?:""[^"]*)*)"|' +

                        // Standard fields.
                        '([^"\\' + strDelimiter + "\\r\\n]*))"
                ),
                "gi");

        // Create an array to hold our data. Give the array a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern matching groups.
        var arrMatches = null;

        // Keep looping over the regular expression matches until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

                // Get the delimiter that was found.
                var strMatchedDelimiter = arrMatches[ 1 ];

                // Check to see if the given delimiter has a length (is not the start of string) 
                // and if it matches field delimiter. 
                // If id does not, then we know that this delimiter is a row delimiter.
                if (
                        strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)){

                        // Since we have reached a new row of data, add an empty row to our data array.
                        arrData.push( [] );
                }
                // Now that we have our delimiter out of the way, let's check to see which kind of value we
                // captured (quoted or unquoted).
                if (arrMatches[ 2 ]){
                        // We found a quoted value. When we capture this value, unescape any double quotes.
                        var strMatchedValue = arrMatches[ 2 ].replace(new RegExp( "\"\"", "g" ),"\"");
                } else {
                        // We found a non-quoted value.
                        var strMatchedValue = arrMatches[ 3 ];
                }

                // Now that we have our value string, let's add it to the data array.
                arrData[ arrData.length - 1 ].push( strMatchedValue );
        }
        // Return the parsed data.
        return( arrData );
    }*/
