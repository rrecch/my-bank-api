import mongoose from 'mongoose'

//{"agencia":10,"conta": 1001 ,"name":"Maria Roberta Fernandes","balance":587}

const accountsSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
})

const accounts = mongoose.model('accounts', accountsSchema, 'accounts')

export { accounts }
