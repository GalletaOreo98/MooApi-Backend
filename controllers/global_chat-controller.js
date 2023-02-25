const { con } = require('../config/db');
const configVars = require('../config/configVars') 

var GlobalChatController = {
    getChat: (req, res) => {
        console.log(req.userId);
        const query = `SELECT user, comentario FROM chat_global ORDER BY idchat_global DESC LIMIT 50`;
        con.query(query, async (err, resultQuery) => {
            if (err) return res.status(500).json({ ok: false, message: 'Ha ocurrido un error inesperado :( ' + err.code })
            return res.status(200).json({ 
                ok: true,
                message: resultQuery,
                
            });
        });
    },
    postChat: (req, res) => {
    const query = `CALL SP_POST_COMENTARIO(${req.userId}, "${req.body.comentario}")`;
    console.log(req.body.comentario);
    con.query(query, async (err, resultQuery) => {
        if (err) return res.status(500).json({ ok: false, message: 'Ha ocurrido un error inesperado :( ' + err })
        return res.status(200).json({ 
            ok: true,
            message: resultQuery[0][0].message,
        });
    });
    }
}

module.exports = GlobalChatController;