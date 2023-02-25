const { con } = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

var authJwt = {

    verifyToken: async (req, res , next) => {
        try {
            const token = req.headers['accesstoken'];
            if (!token) return res.status(403).json({ ok: false, message: "No token provided", result: null });

            const decoded = await jwt.verify(token, process.env.SECRET);
            req.userId = decoded.id;
   
            const query = `SELECT email FROM user WHERE idUser = ${req.userId}`;
            await con.query(query, (err, result) => {
                if (err) return res.status(500).json({ ok: false, message: "Something wrong: VerifyToken", result: err });
                if (!result) return res.status(404).json({ ok: false, message: "User not found", result: null });
                next();
            });
        } catch (error) {
            if (error) return res.status(401).json({ ok: false, message: "Unauthorized", result: error });
        }

    }
}

module.exports = authJwt;