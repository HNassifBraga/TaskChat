// SERVER -> Ponto de entrada da aplicação
// configura frameworks, carrega midlewares globais, configura as rotas principais e inicia a porta do servidor


import http from 'http';
import express from 'express';
import {router} from '../routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { setupSocket } from './socket';

const app = express();
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT', 'DELETE'],
    credentials:true,
    allowedHeaders:['Content-Type','Authorization']
}));
app.use(express.json());
app.use(router);
const server = http.createServer(app);
const io = setupSocket(server)
// console.log('something')
const port = 3000

server.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})