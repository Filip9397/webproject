const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer'); 
const tinify = require("tinify");
tinify.key = "0qKGbkrZSd3vYHpvM3Rr55FbJYwSRxD0";


const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://filipcindric11:mongo123@cluster0.e9cx6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Uspješno povezano s bazom podataka');
})
.catch((error) => {
    console.error('Greška prilikom povezivanja s bazom podataka:', error);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});

app.use(express.json()); 

const Korisnik = mongoose.model('Korisnik', {
  role: {
    type: String,
    default: "prijavljeniKorisnik"
  },
  ime: String,
  prezime: String,
  datum_rodenja: String,
  korime: String,
  lozinka: String
});

const secretKey = 'mySecretKey'; 
app.get('/prijava', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/prijava.html'));
});

app.post('/prijava', async (req, res) => {
  const { username, password } = req.body;

  console.log('Uneseno korisničko ime:', username);
  console.log('Unesena lozinka:', password);

  try {
    const korisnik = await Korisnik.findOne({ korime: { $regex: new RegExp(username, 'i') } });

    if (korisnik && korisnik.lozinka === password) {
      res.send("Uspješno ste prijavljeni!");
    } else {
      res.status(401).json({error: 'Pogrešno korisničko ime ili lozinka. Pokušajte ponovo.' });
    }
  } catch (error) {
    console.error('Greška prilikom prijave korisnika:', error);
    res.status(500).json({ error: 'Došlo je do greške prilikom prijave korisnika.' });
  }
});

app.get('/registracija', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/registracija.html'));
});
app.post('/registracija', async (req, res) => {
  const { role, ime, prezime, datum_rodenja, korime, lozinka } = req.body;

  try {
      const postojeciKorisnik = await Korisnik.findOne({ korime });
      if (postojeciKorisnik) {
          return res.status(400).send('Korisničko ime već postoji. Izaberite drugo korisničko ime.');
      }


      const noviKorisnik = new Korisnik({
          role: role,
          ime: ime,
          prezime: prezime,
          datum_rodenja: datum_rodenja,
          korime: korime,
          lozinka: lozinka
      });

      await noviKorisnik.save();
      res.send("Korisnik uspješno registriran");
  } catch (err) {
      console.error('Greška prilikom registracije korisnika:', err);
      res.status(500).send(err.message || 'Internal Server Error');
  }
});

const Utakmica = mongoose.model('Utakmica', {
    _id: Number, 
    Datum_vrijeme_utakmice: String,
    mjesto: String,
    kolo: String,
    domaći: String,
    gosti: String
  });
  
  app.get('/utakmice/popis-utakmica', async (req, res) => {
    try {
      const utakmice = await Utakmica.find();
      console.log('Dohvaćeni podaci o utakmicama:', utakmice); 
      res.json(utakmice);
    } catch (error) {
      console.error('Greška prilikom dohvaćanja utakmica:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  const Obavijest = mongoose.model('Obavijest', {
    naslov_obavijesti: String,
    autor_obavijesti: String,
    datum_obavijesti: String,
    tekst_obavijesti: String
  });
  
  app.get('/obavijesti/popis-obavijesti', async (req, res) => {
    try {
        const obavijesti = await Obavijest.find();
        res.json(obavijesti);
    } catch (error) {
        console.error('Greška prilikom dohvaćanja obavijesti:', error);
        res.status(500).send('Internal Server Error');
    }
});

const Igrac = mongoose.model('Igrac', {
  id: Number,
  ime: String,
  prezime: String,
  datum_rodenja: String,
  pozicija: String
});

app.get('/momcad', async (req, res) => {
  try {
      const igraci = await Igrac.find();
      res.json(igraci);
  } catch (error) {
      console.error('Greška prilikom dohvaćanja igrača:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Trening = mongoose.model('Trening', {
  _id: Number, 
  Datum_vrijeme_treninga: String,
  kratki_opis_zagrijavanje: String,
  kratki_opis_glavni_dio: String
});

app.get('/plan', async (req, res) => {
  try {
    const treninzi = await Trening.find();
    res.json(treninzi);
  } catch (error) {
    console.error('Greška prilikom dohvaćanja treninga:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/plan/:id', async (req, res) => {
  const treningId = req.params.id;

  try {
    const trening = await Trening.findById(treningId);
    if (!trening) {
      return res.status(404).json({ error: 'Trening not found' });
    }
    res.json(trening);
  } catch (error) {
    console.error('Greška prilikom dohvaćanja pojedinačnog treninga:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/dodajTrening', async (req, res) => {
  const { _id, Datum_vrijeme_treninga, kratki_opis_zagrijavanje, kratki_opis_glavni_dio } = req.body;

  try {
      const noviTrening = new Trening({
          _id: parseInt(_id), 
          Datum_vrijeme_treninga: Datum_vrijeme_treninga,
          kratki_opis_zagrijavanje: kratki_opis_zagrijavanje,
          kratki_opis_glavni_dio: kratki_opis_glavni_dio
      });

      await noviTrening.save();
      res.send('Trening dodat uspešno');
  } catch (err) {
      console.error('Greška prilikom dodavanja treninga:', err);
      res.status(500).send(err.message || 'Internal Server Error');
  }
});

app.put('/azurirajTrening/:id', async (req, res) => {
  const treningId = req.params.id;
  const { Datum_vrijeme_treninga, kratki_opis_zagrijavanje, kratki_opis_glavni_dio } = req.body;

  try {
      const updatedTrening = await Trening.findByIdAndUpdate(treningId, {
          Datum_vrijeme_treninga: Datum_vrijeme_treninga,
          kratki_opis_zagrijavanje: kratki_opis_zagrijavanje,
          kratki_opis_glavni_dio: kratki_opis_glavni_dio
      }, { new: true });

      if (!updatedTrening) {
          return res.status(404).json({ error: 'Trening not found' });
      }

      res.json(updatedTrening);
  } catch (error) {
      console.error('Greška prilikom ažuriranja treninga:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/obrisiTrening/:id', async (req, res) => {
  const treningId = req.params.id;

  try {
    const result = await Trening.findByIdAndDelete(treningId);
    if (!result) {
      return res.status(404).send('Trening not found');
    }

    res.send('Trening obrisan uspešno');
  } catch (error) {
    console.error(error);
    res.status(500).send('Greška prilikom brisanja treninga');
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'materijali'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

function spremismanjenusliku (req, res, next){
  const source = tinify.fromFile(req.file.path);
  source.toFile(path.join(req.file.destination, "minislike", req.file.filename));
  next()
}

app.post('/upload', upload.single('image'), spremismanjenusliku, (req, res) => {
  res.redirect('preuzmi_postavi.html');
});

app.get('/download', (req, res) => {
  const filename = req.query.filename; 
  res.set("Content-Disposition", "attachment; filename=" +filename).sendFile(path.join(__dirname, 'materijali', filename));
});

const fs = require('fs');

app.get('/slike', (req, res) => {
  const direktorijum = path.join(__dirname, 'materijali', "minislike");

  fs.readdir(direktorijum, (err, datoteke) => {
    if (err) {
      console.error('Greška prilikom čitanja direktorijuma:', err);
      return res.status(500).send('Internal Server Error');
    }

    const slike = datoteke.filter(datoteka => {
      const ekstenzija = path.extname(datoteka).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ekstenzija);
    });

    res.json({ slike });
  });
});

app.use('/materijali', express.static(path.join(__dirname, 'materijali')));
app.use('/ruta', express.static(path.join(__dirname, 'ruta')));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server pokrenut na http://localhost:${PORT}`);
});