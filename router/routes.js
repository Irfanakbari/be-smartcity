import express from 'express';
import login from '../controller/auth.js';
import edokter from '../controller/edokter.js';
import middleware from '../middleware/auth.js';
import etrash from '../controller/etrash.js'

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

// auth
app.post('/login', login.login);
app.post('/register', login.register);
app.get('/saya', middleware.verifyToken2, (req, res) => {
    res.send(req.user);
});

// e-dokter
app.get('/api/edokter/myjadwal', middleware.verifyToken2, edokter.getJadwal);
app.post('/api/edokter/jadwal', middleware.verifyToken2, edokter.postJadwal);
app.get('/api/edokter/rs', edokter.getAllRS);
app.get('/api/edokter/dokter/:id_rs', edokter.getAllDokter);
app.get('/api/edokter/poli/:id_rs', edokter.getAllPoli);


// e-trash
app.post('/api/etrash/pickup', middleware.verifyToken2, etrash.postPickup);
app.get('/api/etrash/riwayat', middleware.verifyToken2, etrash.getRiwayat);

export default app;