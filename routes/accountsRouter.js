import express from 'express'
import { accounts } from '../models/accounts.js'

const app = express()


app.test('/testandobranch/:ag/:cc', async (req, res) => {

  try {
    const filter = {agencia: req.params.ag, conta: req.params.cc}
    const account = await accounts.find(filter)

    res.send(account)
  } catch (err) {
    res.status(500).send(err)
  }
})


app.get('/accounts/:ag/:cc', async (req, res) => {

  try {
    const filter = {agencia: req.params.ag, conta: req.params.cc}
    const account = await accounts.find(filter)

    res.send(account)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.get('/acc/:qtd', async (req, res) => {

  try {
    //const filter = {agencia: req.params.ag, conta: req.params.cc}
    const account = await accounts.find({}).limit(parseInt(req.params.qtd)).sort({balance: -1})

    res.send(account)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.put('/transf/', async (req, res) => {
  const db = await accounts.countDocuments({agencia: 10})
  const account = await accounts.aggregate([
    //{$match: { agencia: parseInt(req.params.agencia) }},
    {$group: {_id: null, media: {$sum: "$balance"}}}
  ])

  try {
    res.send(account)
  } catch (err) {
    res.status(500).send(err)
  }
})


app.put('/acc/:agencia', async (req, res) => {
  const db = await accounts.countDocuments({agencia: 10})
  const account = await accounts.aggregate([
    {$match: { agencia: parseInt(req.params.agencia) }},
    {$group: {_id: null, media: {$avg: "$balance"}}}
  ])

  try {
    res.send(account)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.get('/accounts', async (_, res) => {
  const account = await accounts.find({})

  try {
    res.send(account)
  } catch (err) {
    res.status(500).send(err)
  }
})


app.put('/accounts/:type', async (req, res) => {
  //type: 1 depósito 2 saque
  try {
    const balance = req.body.balance
    let saldo = 0
    const type = req.params.type
    const taxaSaque = 1

    const filter = {agencia: req.body.agencia, conta: req.body.conta}
    const account = await accounts.findOne(filter)

    if (type === "1") {
      account.balance += balance
    } else {
      saldo = account.balance - balance - taxaSaque
      if (saldo < 0) {
        res.status(500).send('saldo insulficiente para o saque: ' + balance)
        return
      } else {
        account.balance = saldo
      }
    }
    await account.save()

    res.send(account)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.patch('/accounts', async (req, res) => {
  try {
    const { ccOrigem, ccDestino, balance} = req.body
    
    const filterOrigem = {conta: ccOrigem}
    const filterDestino = {conta: ccDestino}
    const taxa = 8

    const accountOrigem = await accounts.findOne(filterOrigem)
    const accountDestino = await accounts.findOne(filterDestino)

    const agOrigem = accountOrigem.agencia
    const agDestino = accountDestino.agencia

    let saldo = accountOrigem.balance - balance
    if (agOrigem !== agDestino) {
      saldo = saldo - taxa
    }

    if (saldo < 0) {
      res.status(404).send('saldo insulficiente para transferência')
      return
    } else {
      accountOrigem.balance = saldo
      accountOrigem.save()
      accountDestino.balance += balance
      accountDestino.save()
    }

    res.send(`Novo saldo Origem (${ccOrigem}: ${saldo} - Novo saldo Destino ${ccDestino}: ${accountDestino.balance}` )
  } catch (err) {
    res.status(500).send(err)
  }
})

app.delete('/accounts/:ag/:cc', async (req, res) => {
  try {
    const filter = {agencia: req.params.ag, conta: req.params.cc}
    const account = await accounts.findOneAndDelete(filter);

    if (!account) {
      res.status(404).send('Agencia/Conta nao encontrado');
      return
    } else {
      const filterRetorno = {agencia: req.params.ag}
      const retorno = await accounts.find(filterRetorno)
      
      res.send(retorno);
    }

    
  } catch (err) {
    res.status(500).send(err);
  }
});


export { app as accountsRouter }