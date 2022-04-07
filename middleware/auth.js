import jwt from "jsonwebtoken";
import 'dotenv/config';
const { SECRET_KEY } = process.env;
import isJwtTokenExpired from 'jwt-check-expiry';

const key = "habib18102002";

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    let token = authorization.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            message: "Access Denied",
        });
    }
    try {
        const decoded = jwt.verify(token, key);
        req.user = decoded;
        if (decoded.role !== "superadmin" || decoded.role !== "admin") {
            return res.status(401).send({
                message: "Access Denied",
            });
        }
        next();
    } catch (err) {
        return res.status(401).send({
            message: "Invalid Token",
        });
    }
}

const verifyToken2 = (req, res, next) => {
    const { authorization } = req.headers;
    let token = authorization.split(" ")[1];
    if (!token) {
        return res.status(401).send({
            message: "Access Denied",
        });
    }
    try {
        const decoded = jwt.verify(token, key);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send({
            message: "Invalid Token",
        });
    }
} 


export default {
    verifyToken,
    verifyToken2,
};