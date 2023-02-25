const { con } = require('../config/db');
const configVars = require('../config/configVars') 

var FrameController = {
    getFrame: (req, res) => {
        if (req.params.numeroFrame == -1) return res.status(400).json({ ok: false, message: 'No puedes buscar un frame inexistente' })
        if (isNaN(req.params.numeroFrame)) return res.status(400).json({ ok: false, message: 'Solo debes ingresar valores numericos' })
        const query = `SELECT numeroFrame, url FROM frame WHERE numeroFrame = ${req.params.numeroFrame}`;
        con.query(query, async (err, resultQuery) => {
            if (err) return res.status(500).json({ ok: false, message: 'Ha ocurrido un error inesperado :( ' + err.code })
            if (!resultQuery[0]) return res.status(404).json({ ok: false, message: 'Frame no encontrado, recuerda buscar solo los frames que ya han pasado' })
            return res.status(200).json({ 
                ok: true,
                message: 'Busqueda exitosa',
                caption: `${configVars.seriesName}, Frame: ${resultQuery[0].numeroFrame || 'load'}/${configVars.totalFrames}`, 
                url: resultQuery[0].url, numeroFrame: resultQuery[0].numeroFrame 
            });
        });
    },

    getPage: (req, res) => {
        if (req.params.numeroPagina == -1) return res.status(400).json({ ok: false, message: 'No puedes buscar un frame inexistente' })
        if (isNaN(req.params.numeroPagina)) return res.status(400).json({ ok: false, message: 'Solo debes ingresar valores numericos' })
        let rightLimit = req.params.numeroPagina * 100;
        let leftLimit = rightLimit - 99;
        const query = `SELECT numeroFrame, url FROM frame WHERE numeroFrame BETWEEN ${leftLimit} AND ${rightLimit}`;
        con.query(query, async (err, resultQuery) => {
            if (err) return res.status(500).json({ ok: false, message: 'Ha ocurrido un error inesperado :( ' + err.code })
            if (!resultQuery[0]) return res.status(404).json({ ok: false, message: 'Frame no encontrado, recuerda buscar solo los frames que ya han pasado' })
            return res.status(200).json({ 
                ok: true,
                message: 'Busqueda exitosa',
                page: resultQuery
            });
        });
    },

    getGallerySize: (req, res) => {
        const query = `SELECT COUNT(*) FROM frame`;
        con.query(query, async (err, resultQuery) => {
            if (err) return res.status(500).json({ ok: false, message: 'Ha ocurrido un error inesperado :( ' + err.code })
            if (!resultQuery[0]) return res.status(404).json({ ok: false, message: 'Gallery no encontrado' })
            return res.status(200).json({ 
                ok: true,
                message: 'Busqueda exitosa',
                size: resultQuery[0]['COUNT(*)']
            });
        });
    }
}

module.exports = FrameController;
