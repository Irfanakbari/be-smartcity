import koneksi from "../config/database.js";

const getJadwal = (req, res) => {
    try {
        koneksi.query(
            "SELECT * FROM edokter_reservasi JOIN edokter_dokter ON edokter_reservasi.id_dokter = edokter_dokter.id_dokter JOIN edokter_rs ON edokter_reservasi.id_rs = edokter_rs.id_rs JOIN edokter_poli ON edokter_reservasi.id_poli = edokter_poli.id_poli  WHERE nik_pasien = ? LIMIT 20",
            [req.user.nik],
            (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(results);
                }
            }
        );
    } catch (err) {
        return res.status(500).send({
            message: "Error",
        });
    }
};

const postJadwal = (req, res) => {
    try {
        const { nik, nama, usia, jk, alamat, rs_tujuan, poli, tanggal, keluhan, dokter } = req.body;
        koneksi.query(
            "INSERT INTO reservasi (nik_pasien, id_dokter, id_rs, tanggal, nama, jk, usia, alamat, poli, keluhan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [nik, dokter,  rs_tujuan, tanggal, nama, jk, usia, alamat, poli, keluhan],
            (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(results);
                }
            }
        );

    } catch (err) {
        return res.status(500).send({
            message: "Error",
        });
    }
};

const getAllRS = (req, res) => {
    try {
        koneksi.query(
            "SELECT * FROM rumah_sakit",
            (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(results);
                }
            }
        );
    } catch (err) {
        return res.status(500).send({
            message: "Error",
        });
    }
}

const getAllDokter = (req, res) => {
    const { id_rs } = req.params;
    try {
        koneksi.query(
            "SELECT * FROM dokter WHERE id_rs = ? AND id_poli = ?",
            [id_rs, id_poli],
            (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(results);
                }
            }
        );
    } catch (err) {
        return res.status(500).send({
            message: "Error",
        });
    }
}

const getAllPoli = (req, res) => {
    const { id_rs } = req.params;
    try {
        koneksi.query(
            "SELECT * FROM edokter_poli WHERE id_rs = ?",
            [id_rs],
            (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(results);
                }
            }
        );
    } catch (err) {
        return res.status(500).send({
            message: "Error",
        });
    }
}

    export default {
        getJadwal,
        postJadwal,
        getAllRS,
        getAllDokter,
        getAllPoli,
    };
