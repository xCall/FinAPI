const express = require("express");

const { v4: uuidv4 } = require("uuid");
const port = 3000;
const app = express();

const customers = [];

/**
 * Middlewares
 */
app.use(express.json());

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    response.status(400).json({ error: "Customer not found!" });
  }

  request.customer = customer;

  return next();
}

/**
 * Functions
 */

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return parseFloat(acc) + parseFloat(operation.amount);
    } else {
      return parseFloat(acc) - parseFloat(operation.amount);
    }
  }, 0);

  return balance;
}

/**
 * Route account
 */

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists" });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return response.status(201).send();
});

app.put("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { name } = request.body;
  const { customer } = request;

  customer.name = name;

  return response.status(201).send();
});

app.get("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer);
});

app.delete("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { cpf } = request.headers;
  const customerIndex = customers.findIndex((customer) => customer.cpf === cpf);

  if (customerIndex < 0) {
    return response.status(404).json({ error: "Customer not found!" });
  }

  customers.splice(customerIndex, 1);

  return response.status(200).json(customers);
});

/**
 * Route statement
 */

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request; 
  const { date } = request.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter(
    (statement) =>
      statement.created_at.toDateString() === dateFormat.toDateString()
  );

  return response.json(statement);
});

/**
 * Route deposit
 */

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body;
  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

/**
 * Route withdraw
 */

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;
  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return response.status(400).json({ error: "Insufficient funds!" });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

/**
 * Route Balance
 */

app.get("/balance",verifyIfExistsAccountCPF, (request, response) => {
  const {customer} = request;
  const balance = getBalance(customer.statement);

  return response.json(balance);
});

app.listen(port);
