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
            "INSERT INTO edokter_reservasi (nik_pasien, id_dokter, id_rs, tanggal, nama, jk, usia, alamat, id_poli, keluhan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [nik, dokter, rs_tujuan, tanggal, nama, jk, usia, alamat, poli, keluhan],
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
            "SELECT * FROM edokter_rs",
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
    const { id_rs, id_poli } = req.params;
    try {
        koneksi.query(
            "SELECT * FROM edokter_dokter WHERE id_rs = ? AND id_poli = ?",
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

const admGetHome = async (req, res) => {
    const nik = req.user.nik;
    var me = await getMe(nik);
    let data;

    try {
        koneksi.query(
            "SELECT * FROM edokter_reservasi JOIN edokter_rs ON edokter_rs.id_rs = edokter_reservasi.id_rs JOIN edokter_dokter ON edokter_reservasi.id_dokter = edokter_dokter.id_dokter JOIN edokter_poli ON edokter_reservasi.id_poli = edokter_poli.id_poli WHERE edokter_reservasi.id_rs = ?  ",
            [me[0].id_rs],
            (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    data = results;
                    let total = data.length;
                    let pending = data.filter(item => item.status == 1).length;
                    let selesai = data.filter(item => item.status == 2).length;
                    let batal = data.filter(item => item.status == 0).length;
                    let pria = data.filter(item => item.jk == "Laki-Laki").length;
                    let wanita = data.filter(item => item.jk == "Perempuan").length;


                    let rs_name = data.map(item => item.nama_rs).filter((item, index, self) => self.indexOf(item) === index);
                    let total_rs = rs_name.map(item => {
                        return {
                            nama_rs: item,
                            total: data.filter(item2 => item2.nama_rs == item).length
                        }
                    });

                    let poli_name = data.map(item => item.nama_poli).filter((item, index, self) => self.indexOf(item) === index);
                    let total_poli = poli_name.map(item => {
                        return {
                            nama_poli: item,
                            total: data.filter(item2 => item2.nama_poli == item).length
                        }
                    });

                    res.status(200).send(
                        {
                            total,
                            pending,
                            selesai,
                            batal,
                            pria,
                            wanita,
                            total_rs,
                            total_poli,

                        }
                    );
                }
            }
        );
    }
    catch (err) {
        return res.status(500).send({
            message: "Error",
        });
    }

}

const admGetDokter = async (req, res) => {
    const nik = req.user.nik;
    var me = await getMe(nik);
    let data;
    
    try {
        koneksi.query(
            "SELECT * FROM edokter_dokter  JOIN edokter_poli ON edokter_dokter.id_poli = edokter_poli.id_poli WHERE edokter_dokter.id_rs = ?",
            [me[0].id_rs],
            (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    data = results;
                    res.status(200).send(data);
                }
            }
        );
    }
    catch (err) {
        return res.status(500).send({
            message: "Error",
        });
    }
}

function getMe(nik) {
    return new Promise((resolve, reject) => {
        koneksi.query(
            "SELECT * FROM users WHERE nik = ?",
            [nik],
            (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            }
        );
    });
}


export default {
    getJadwal,
    postJadwal,
    getAllRS,
    getAllDokter,
    getAllPoli,
    admGetHome,
    admGetDokter
};
