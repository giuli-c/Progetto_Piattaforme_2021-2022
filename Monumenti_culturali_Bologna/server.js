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
app.use(express.static('public'));
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

// 2° END POINT. Necessario per caricare i dati dal file csv
app.get('/datacsv', (req, res) => {
    console.log("Carico dati")
    res.type('text/csv').sendFile(__dirname + '/views/DataStrutture.csv');
})

// 3° END POINT. Necessario per la visualizzazione delle varie pagine
app.get('/', (req, res) => {
    res.render('./views/index.html');
})

app.get('/views/inserisci', (req, res) => {
    res.render('./views/inserisci.html');
})

app.get('/views/ricerca', (req, res) => {
    res.render('./views/ricerca.html');
})

app.get('/views/rimuovi', (req, res) => {
    res.render('./views/rimuovi.html');
})

app.get('/views/tabella', (req, res) => {
    res.render('./views/tabella.html');
})

app.get('*', (req, res) => {
    res.render('./views/404.html');
})

// END POINT per ricerca dati
app.get("/DataStrutture/:param", (req, res) => {
  let datiArray = CSVToArray(fileSystem.readFileSync("./views/DataStrutture.csv"));
  console.log(req.params.par);
  // Controllo se han passato un parametro numerico o di tipo stringa.
  if (isNaN(req.params.par)) { 
    let data = [];
    datiArray.forEach(elemento => { // Salvo ogni elemento in cui i comuni combaciano.
      let splitted = elemento.toString().split(";");
      if (splitted[3] == req.params.par.toUpperCase())
        data.push(elemento);
    });
    if (data.length == 0) { // Se l'array è vuoto non abbiamo trovato niente.
      res.status(404).send("Non esistono punti di interesse nel comune richiesto.");
    } else {
      res.status(200).send(JSON.stringify(data));
    }
  } else {
      if (punti.length > req.params.par && req.params.par > 0) { // Indice 0 riservato per l'header csv.
        res.status(200).send(punti[req.params.par]);
      } else {
        res.status(400).send('Elemento non presente in lista o parametro illegale');
      }
  }
});

// --------------- END POINT: RIMOZIONE --------------
app.delete("/rimuovi/:nome", (req, res) => {
    // definizione del nuovo array nella quale inserire i dati presi dal csv
    let strutture = CSVToArray(fileSystem.readFileSync("./views/DataStrutture.csv"));
    const {id} = req.params
    console.log("Rimozione dell'elemento " + id);
    if (strutture.length >= id && id > 0) {
        strutture.splice(strutture.length + 1, 1, id);
      let csv = "";
      for (let i = 0; i < strutture.length - 1; i++) {
        csv += String(strutture[i]) + "\n";
      }
      csv += String(strutture[strutture.length - 1]);
      fileSystem.writeFileSync(__dirname + "/views/DataStrutture.csv", csv);
      res.status(200).send("Elemento eliminato correttamente.");
    } else {
      res.status(400).send('Elemento non presente in lista o parametro illegale');
    }
  });

/* FUNZIONI */
// Funzione per convertire da CSV ad array.
/* Preso da https://gist.github.com/luishdez/644215 */
    // This will parse a delimited string into an array of arrays. 
    // The default delimiter is the comma, but this can be overriden in the second argument.
    function CSVToArray( strData, strDelimiter ){
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
    }

app.listen(3800)