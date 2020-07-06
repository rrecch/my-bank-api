import express from 'express';
import mongoose from 'mongoose';

import { accountsRouter } from './routes/accountsRouter.js';

const app = express();

/*Conexao com o MongoDB*/
(async () => {
  try {
    await mongoose.connect('mongodb+srv://igti_rei:110410@cluster0.uber5.mongodb.net/my-bank-api?authSource=admin&replicaSet=atlas-m485x1-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true',
    //   'mongodb+srv://' +
    //     process.env.USERDB +
    //     ':' +
    //     process.env.PWDDB +
    //     '@bootcamp-smurc.mongodb.net/grades?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (error) {
    console.log('Erro ao conectar no MongoDB');
  }
})();

app.use(express.json());
app.use(accountsRouter);

app.listen(3001, () => console.log('Servidor em execucao'));
