import koneksi from "../config/database.js";

const getJadwal = (req, res) => {
    try {
        koneksi.query(
            "SELECT * FROM reservasi JOIN dokter ON reservasi.id_dokter = dokter.id_dokter JOIN rumah_sakit ON reservasi.id_rs = rumah_sakit.id_rs WHERE nik_pasien = ? LIMIT 10",
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
        return res.status(401).send({
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
        return res.status(401).send({
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
        return res.status(401).send({
            message: "Error",
        });
    }
}

const getAllDokter = (req, res) => {
    const { id_rs } = req.params;
    try {
        koneksi.query(
            "SELECT * FROM dokter WHERE id_rs = ?",
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
        return res.status(401).send({
            message: "Error",
        });
    }
}

    export default {
        getJadwal,
        postJadwal,
        getAllRS,
        getAllDokter
    };
