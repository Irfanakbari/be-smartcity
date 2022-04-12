import mysql from 'mysql2';
import 'dotenv/config';
const {HOST, USER, PASSWORD, DATABASE} = process.env;

const koneksi = mysql.createConnection({
    host: '103.55.39.44',
    user: 'kanadeex_npm',
    password: 'habib18102002',
    database: 'kanadeex_npm',
    multipleStatements: true
});

export default koneksi;