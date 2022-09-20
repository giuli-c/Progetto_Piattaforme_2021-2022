## Studente: Costa Giulia
## Matricola: 308558

---

# CENTRI CULTURALI A BOLOGNA

---


## Introduzione e descrizione del progetto

Il progetto realizzato rappresenta una Restful API con l'obiettivo di fornire informazioni e posizioni sulle Strutture culturali a Bologna.
Il sito è infatti costruito in modo da garantire la presenza di una mappa con tutti i punti di interesse resi visibili tramite dei marker, che mostreranno anche i dati di ogni centro culturale.

I dati presenti nella piattaforma sono dati acquisiti da un Open Data distribuito dal sito **datiopen.it**, e riportati sulla mappa del sito sfruttando il servizio fornito dal sito **OpenStreetMap.org**.

Vengono inoltre offerte diverse possibilità di gestire le informazioni, tramite API costruite appositamente, che garantiscono:


•	di avere una lista completa dei centri culturali;

•	inserire una nuova struttura, nel caso in cui non sia presente nel sito;

•	eliminare strutture ormai chiuse;

•	ricercare strutture in base al nome, al quartiere e alla categoria a cui appartiene.

---
*Di seguito sono riportati i link utili:*

**Link GitHub:**  *https://github.com/giuli-c/Progetto_Piattaforme_2021-2022*

**Link Web Site:** *http://localhost:3800/*

---


## Descrizione dell'architettura e delle scelte implementative


Il progetto è stato realizzato grazie all'utilizzo di NodeJs, ovvero un framework che permette di realizzare l'architettura lato server. 
Mentre i dati sono stati acquisiti direttamente da un file CSV, trasformato poi successivamente in JSON.


**Moduli e librerie utilizzate per il back-end sono state le seguenti:**

•	**EXPRESS:** è un Framework che permette di usare Node.js per la programmazione di applicazioni web, permettendo la creazione di API molto forti.

•	**EJS:** è un modulo che permette di creare e rimandare file html, tramite js.

•	**CSVTOJSON:** è un pacchetto che permette la conversione da un file CSV a Json.



**Moduli e librerie utilizzate per il Front-End sono stati utilizzati:**

•	**BOOTSTRAP:** framework di sviluppo web, che permette di avere un sito più reattivo.

•	**LEAFLET:** è una libreria JavaScript che permette di sviluppare mappe geografiche interattive.

•	**OPENSTREETMAP:** è un formato usato da Leaflet per acquisire un tile specifico.



## HTML E JS:


Per il progetto è stata utilizzata un’unica pagina .js e 6 pagine .html:

-	***Server.js:*** equivale al nostro server, necessario per inviare risposte al cliente in base al tipo di richiesta che verrà effettuata;


-	***Index.html:*** pagina utilizzata come Home Page, necessaria per visualizzare la posizione e le informazioni di tutti gli elementi presenti all’interno del file JSON. Al suo interno viene infatti inserita una mappa e definito il suo stile, e i bottoni necessari per muoversi all’interno del sito;


-	***Tabella.html:*** pagina utilizzata per definire lo stile della tabella, e acquisire i dati dal file JSON e popolare così la tabella stessa;


-	***New.html:*** pagina contenente il modello per l’inserimento di una nuova struttura;


-	***Cerca.html:*** pagina contenente il modello per la ricerca di una struttura;


-	***Rimuovi.html:*** pagina contenente il modello per la rimozione di una struttura;


-	***404.html:*** pagina inviata a tutte le pagine, quando viene aperta una pagina inesistente!



## Documentazione API

Gli EndPoint che sono stati utilizati sono i seguenti:

•	**GET:**

	- 1° END POINT GET: la sua funzione è quella di rendere visibili le pagine Html create:
      - app.get('/');
      - app.get('/new');
      - app.get('/ricerca);
      - app.get('/rimuovi);
      - app.get('/tabella);
      
	- 2° END POINT GET: utilizzato per caricare i dati prresenti nell'ogggetto Json precedentemente creato
  
	- 3° END POINT GET: utilizzato per la ricerca delle strutture, in base al parametro richiesto:
      - app.get("/cercaNome");
      - app.get("/cercaTipo");
      - app.get("/cercaQuartiere");
      
	- 4° END POINT GET: necessario per inviare messaggio di errore a tutte le pagine non trovate.
  
•	**POST:**       app.post("/inserimento");

La funzione di questo EndPoint è quella di inserire una nuova struttra. 
Tale inserimento avverrà direttamente sull'oggetto Json, che permetterà l'inclusione della nuova struttura   
all'interno della tabella.

•	**DELETE:**     app.delete("/rimuovi");

La funzione di questo EndPoint è quella di eliminare una struttra solo se presente.
In caso contrario verrà inviato un messaggio di errore!

