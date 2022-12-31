const app = require('./app');
const config = require('./config/config');

require('./cronJobs');
// eslint-disable-next-line import/order
const http = require('http');
// socket initialization
const server = http.createServer(app);
// eslint-disable-next-line import/order
const io = require('socket.io')(server, { cors: { origin: '*' } });

global.io = io;
require('./config/rootSocket')(io);

setTimeout(()=>{
    io.on('teste',()=>{
        console.log('testebc')
    })
},5000)

server.listen(config.port, () => {
    console.log('SERVER');
    console.log(`Listening to port ${config.port}`);
});
