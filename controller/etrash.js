import koneksi from "../config/database.js";


const postPickup = (req, res) => {
    try {
        const { nik, alamat, lat, long, jadwal } = req.body;
        console.log(req.body);
        koneksi.query("INSERT INTO `etrash` (`id_user`, `alamat`, `lat`, `long`, `jadwal`) VALUES (?,?,?,?,? );",
            [nik, alamat, lat, long, jadwal],
            (err, results) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send({
                        status: "success",
                    })
                }
            }
        )
    } catch (err) {
        return res.status(401).send({
            message: "Error",
        });
    }
}

const getRiwayat = (req, res) => {
    try {
        koneksi.query(
            "SELECT * FROM `etrash` WHERE id_user = ?",

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
}


export default {
    postPickup,
    getRiwayat
}