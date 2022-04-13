import koneksi from "../config/database.js";
import path from "path";
import fs from "fs-extra";

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
                    let id_rs = me[0].id_rs;

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
                            id_rs,
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
    var data;

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

const admDelDokter = async (req, res) => {
    const { id } = req.params;
    try {
        fs.remove(`./public/images/dokter/${id}.jpg`);
        koneksi.query(
            "DELETE FROM edokter_dokter WHERE id_dokter = ?",
            [id],
            (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(results);
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

const admPostDokter = async (req, res) => {
    if (req.body == null) {
        return res.status(400).send({
            message: "Request body is missing",
        });
    }
    const { id_dokter, nama_dokter, notelp, id_poli, id_rs, spesialis } = req.body;
    const  {foto}  = req.files;
    try {
        foto.mv(`./public/images/dokter/${id_dokter}`, async (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            koneksi.query(
                "INSERT INTO edokter_dokter (id_dokter, dr_name, dr_notelp, id_poli, id_rs, spesialis, avatar_picture) VALUES (?, ?, ?, ?, ?, ?,?)",
                [id_dokter, nama_dokter, notelp, id_poli, id_rs, spesialis,  `${id_dokter}.jpg`],
                (err, results) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.status(200).send(results);
                    }
                }
            );
        });
    }
    catch (err) {
        return res.status(500).send({
            message: "Error",
        });
    }
}

const admGetDokterImage = async (req, res) => {
    const { id } = req.params;
    const location = './public/images/dokter/';
    return res.sendFile(path.resolve(location + id + '.jpg'));
}

const admGetPasien = async (req, res) => {
    const nik = req.user.nik;
    var me = await getMe(nik);
    var data;

    try {
        koneksi.query(
            "SELECT * FROM edokter_reservasi JOIN edokter_poli ON edokter_reservasi.id_poli=edokter_poli.id_poli JOIN users ON edokter_reservasi.nik_pasien=users.nik JOIN edokter_dokter ON edokter_reservasi.id_dokter = edokter_dokter.id_dokter WHERE edokter_reservasi.id_rs = ? ORDER BY tanggal DESC",
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

const admPostPasienUpdate = async (req, res) => {
    if (req.body == null) {
        return res.status(400).send({
            message: "Request body is missing",
        });
    }
    const { id_reservasi,  id_poli, id_dokter, status, alasan,   } = req.body;
    try {
        koneksi.query(
            "UPDATE edokter_reservasi SET  id_poli=?,  id_dokter=?, status=?, alasan=?,  WHERE id_reservasi=?",
            [id_poli, id_dokter, status, alasan, id_reservasi],
            (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(results);
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
    admGetDokter,
    admDelDokter,
    admPostDokter,
    admGetDokterImage,
    admGetPasien,
    admPostPasienUpdate
};
