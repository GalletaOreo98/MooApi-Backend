const { con } = require('../config/db');
const configVars = require('../config/configVars') 

var VideoController = {
    getVideos: (req, res) => {
        const query = `SELECT * FROM video`;
        con.query(query, async (err, resultQuery) => {
            if (err) return res.status(500).json({ ok: false, message: 'Ha ocurrido un error inesperado :( ' + err.code })
            if (!resultQuery[0]) return res.status(404).json({ ok: false, message: 'No hay videos' })
            return res.status(200).json({ 
                ok: true,
                message: 'Busqueda exitosa',
                result: resultQuery
            });
        });
    }
}

module.exports = VideoController;
