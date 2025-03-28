import app from '../../app';
import http from 'http';
import debug from 'debug';
import usersRoute from '../routes/usersRoute';
import suratsRoute from '../../src/routes/suratmasukRoute';

import cors from 'cors';



const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
app.set('port', port);
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
const server = http.createServer(app);

server.listen({ port: Number(port), host }, () => {
    console.log(`Server running on http://${host}:${port}`);
});
app.use('/api/users', usersRoute);
app.use('/api/surats', suratsRoute);

server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: string) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val;
    if (port >= 0) return port;
    return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
        default:
            throw error;
    }
}

function onListening(): void {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
    debug('Listening on ' + bind);
}
