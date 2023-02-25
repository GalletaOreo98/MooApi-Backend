const { con } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

var authController = {

    signUp: async (req, res) => {
        try {
            var { email, password, nombre } = req.body;
            if (!email || !password || !nombre) return res.status(400).json({ok: false, message: 'Campos vacios'});
            const salt = await bcrypt.genSalt(10);
            var hashPassword = await bcrypt.hash(password, salt);
            const query = `CALL SP_REGISTRO_USUARIO('${email}', '${hashPassword}', '${nombre}')`;
            con.query(query, async(err, result) => {
                if (err) return res.status(500).json(err);
                if (!result[0][0].ok) return res.status(400).json({ok: true, message: result[0][0].message, token: null, nombre: null});
                if (!result[0][0].insertId) return res.status(500).json(err);
                var token = jwt.sign({id: result.insertId}, process.env.SECRET, {
                    expiresIn: '7d'
                })
                
                return res.status(200).json({ok: true, message: 'Registrado exitosamente', token, nombre});
            });
        } catch (error) {
            return res.status(503).json(error);
        }
        
    },

    signIn: (req, res) => {
        try {
            var { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ok: false, message: 'Campos vacios'});
            const query = `SELECT * FROM user WHERE email = '${email}'`;
            con.query(query, async(err, result) => {
                if(!result[0]) return res.status(401).json({ok: false, message: 'Contraseña o usuario incorrecto'});
                const isCorrecta = await bcrypt.compare(password, result[0]['password']);
                if (err) return res.status(500).json(err);
                if (!isCorrecta) return res.status(401).json({ ok: false, message: `Contraseña o usuario incorrecto`});
                var token = jwt.sign({id: result[0]['iduser']}, process.env.SECRET, {
                    expiresIn: '7d'
                })
                return res.status(200).json({ ok: true, message: 'SignIn exitoso', token, nombre: result[0]['name']});
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    },

}

module.exports = authController;