const express = require('express');
const cors = require('cors');
const path = require('path');
var cloudinary = require('cloudinary').v2;
const configVars = require('./config/configVars');
const http = require('http');
const {Server} = require('socket.io'); 
//Llamar al .env
require('dotenv').config();

//Crear el servidor de express
const app = express();

//Crear websocketServer
const server = http.createServer(app);
const io = new Server(server);
var usuariosConectados = [];

io.on('connection', (socket)=> {

    socket.on('new user', (name) => {
        var existe = false;
        usuariosConectados.forEach(e => { if (e.id === socket.id) existe=true; });
        if (!existe) {
            socket.name = name;
            usuariosConectados.push({nombre: name, id: socket.id})
            console.log('Connected user');
            console.log(name);
        } else {
            console.log('Ese id ya existe');
        }
        console.log(usuariosConectados);
    });

    socket.on('disconnect', (socket) => {
        console.log('Disconnected user');
        usuariosConectados.splice(usuariosConectados.indexOf({nombre: socket.name, id: socket.id}), 1)
        console.log(usuariosConectados);
    });

    socket.on('sayhello', ()=> {
        console.log('I have to say hello');
        io.emit('sayhello');
    })

    socket.on('ver usuarios conectados', (cb)=> {
        cb(usuariosConectados);
    })
})


//Directorio publico
app.use(express.static('public'));

//CORS
app.use(cors());

//Lectura y parseo del body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Llamar al archivo de conexion de bbdd
const { con } = require('./config/db');

//Base de datos
con.getConnection(function (err) {
    if (err) throw err;
    console.log("Connected to BBDD!");
});

//Variables globales
const TOTAL_FRAMES = configVars.totalFrames;
const PAUSE_IN_FRAME = configVars.pauseInFrame; 
var nFrame = 0;
var cursor;
var urlImg;
var isOn = true;

//Configurar cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

//Rutas
app.use('/api', require('./routes/frame-router'));
app.use('/api', require('./routes/videos-router'));
app.use('/api', require('./routes/auth-router'));
app.use('/api', require('./routes/global_chat-router'));


//Arrancar el servidor
server.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
    if (!cursor) {
        const query = 'SELECT numeroFrame, url, `cursor` FROM frame ORDER BY numeroFrame DESC LIMIT 1';
        con.query(query, async (err, resultQuery) => {
            console.log(resultQuery[0]);
            if (resultQuery[0]) {
                cursor = await resultQuery[0].cursor;
                urlImg = await resultQuery[0].url;
                nFrame = await resultQuery[0].numeroFrame;
                console.log('Datos de carga extraidos: ' + `Frame: ${nFrame}, urlImage: ${urlImg}, Cursor: ${cursor}`);
            }
        });
    }
});

//WEB SITE POSTS

function postearWebSite(cursorParam) {
    cloudinary.search
        .sort_by('public_id', 'asc')
        .expression('frames')
        .max_results(1)
        .next_cursor(cursorParam)
        .execute().then(result => {
            console.log(result);
            urlImg = result.resources[0].secure_url;
            cursor = result.next_cursor;
            nFrame++;
            if (nFrame >= PAUSE_IN_FRAME) {
                stopMainInterval();
                isOn = false;
                console.log(`App pausada exitosamente en el Frame: ${nFrame}, cursor: ${cursor}`)
            }
            const query = 'INSERT INTO frame (numeroFrame, url, `cursor`) ' + `VALUES (${nFrame}, "${urlImg || null}", "${cursor || null}")`;
            con.query(query, (err) => {
                if (err) console.log(err);
            });
        }).catch(result => {
            console.log(result);
        });

}

/* //Ejecucion Main (Web site)
function stopMainInterval() {
    clearInterval(mainInterval);
}

const mainInterval = setInterval(function () { postearWebSite(cursor) }, 1000*60*1);  */

app.get('/api/frame', (req, res) => {
    return res.status(200).json({ caption: `${configVars.seriesName}, Frame: ${nFrame || 'load'}/${TOTAL_FRAMES}`, url: urlImg || 'load', isOn: isOn });
})

//Manejar demas rutas
app.get('*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html'));
});



