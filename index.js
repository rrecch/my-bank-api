import express from 'express';
import mongoose from 'mongoose';

import { accountsRouter } from './routes/accountsRouter.js';

const app = express();

/*Conexao com o MongoDB*/
(async () => {
  try {
    
    //   'mongodb+srv://' +
    //     process.env.USERDB +
    //     ':' +
    //     process.env.PWDDB +
    //     '@bootcamp-smurc.mongodb.net/grades?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: 
      }
    );
  } catch (error) {
    console.log('Erro ao conectar no MongoDB');
  }
})();

/*usando o express*/
//app.put.apply.apply.apply
app.use(express.json());
/*usando a rota*/
app.use(accountsRouter);

app.listen(3001, () => console.log('Servidor em execucao'));
