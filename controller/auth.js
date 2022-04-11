import koneksi from "../config/database.js";
import jwt from "jsonwebtoken";
import md5 from "md5";
import 'dotenv/config';
const { SECRET_KEY } = process.env;

const key = "habib18102002";


const login = (req, res) => {
    const { nik, password } = req.body;
    let enkripsi = md5(password);

    koneksi.query(
        "SELECT * FROM users WHERE nik = ?",
        [nik],
        (error, results, fields) => {
            if (error) {
                res.status(500).send(err);
            } else {
                if (results.length > 0) {
                    if (results[0].password === enkripsi) {
                        const token = jwt.sign(
                            {
                                id: results[0].id,
                                nik: results[0].nik,
                                nama: results[0].full_name,
                                alamat: results[0].alamat,
                                role: results[0].role,
                                jk: results[0].jk,
                            },
                            key,
                            { expiresIn: "10h" }
                        );
                        res.status(200).send({
                            token: token,
                            id: results[0].id,
                            nik: results[0].nik,
                            nama: results[0].full_name,
                            alamat: results[0].alamat,
                            role: results[0].role,
                        });
                    } else {
                        res.status(404).send("User not found");
                    }
                } else {
                    res.status(404).send("User not found");
                }
            }
        }
    );

};


const register = async (req, res) => {
    const { nik, password, nama, alamat, role,jk } = req.body;
    let enkripsi = md5(password);
    koneksi.query(
        "INSERT INTO users (nik, full_name, alamat, password, role,jk) VALUES (?, ?, ?, ?, ?)",
        [nik, nama, alamat, enkripsi, role,jk],
        (err, results) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(500).send({
                        message: "NIK sudah terdaftar",
                        error: err.code,
                    });
                } else {
                    res.status(500).send({
                        error: err.code,
                        status: 500,
                    });
                }
            } else {
                res.status(200).send({
                    nik: nik,
                    status: "success",
                });
            }
        }
    );

}

export default {
    login,
    register
}