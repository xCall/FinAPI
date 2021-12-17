# FinAPI - API Financeira

- Projeto api financeira, contém os principais métodos para utilização, sendo eles: cadastro de usuário, deposito, extrato, extrato por data, verificar créditos, deletar conta.

## Efetuar cadastro de nova conta

### Request type - POST - Account

```
 http://localhost:3000/account

 {
   "cpf":"123456789",
   "name":"Home de Ferro"
 }

```

## Efetuar atualização de nova conta

### Request type - PUT - Account

```
  http://localhost:3000/account

  {
    "name":"Batman"
  }

  headers ->
  Content-Type: application/json
  cpf: 123456789
```

## Listar usuarios

### Request type - GET - Account

```
  http://localhost:3000/account

  headers ->
  cpf: 123456789
```

## deletar de nova conta

### Request type - DELETE - Account

```
  http://localhost:3000/account

  headers ->
  cpf: 123456789
```

## Efetuar deposito em conta existente

### Request type - POST - Deposit

```
  http://localhost:3000/deposit

  {
    "description": "Salario"
    "amount": 1250,00
  }

  headers ->
  Content-Type: application/json
  cpf: 123456789
```

## Efetuar saque em conta existente com saldo

### Request type - POST - Withdraw

```
  http://localhost:3000/withdraw

  {
    "amount": 250,00
  }

  headers ->
  Content-Type: application/json
  cpf: 123456789
```

## Efetuar extrato em conta existente com movimentação

### Request type - GET - Statement

```
  http://localhost:3000/statement

  headers ->
  cpf: 123456789
```

## Efetuar extrato por data em conta existente com movimentação

### Request type - GET - Statement

```
  http://localhost:3000/statement/date

  headers ->
  cpf: 123456789
  query ->
  date: 2021-12-16
```

## Efetuar extrato por data em conta existente com movimentação

### Request type - GET - Balance

```
  http://localhost:3000/balance

  headers ->
  cpf: 123456789
```