var express = require('express');
var router = express.Router();
const config = require('../database')
const { Client } = require('pg');
const checkForValidUser = require('../middleware/checkForValidUser')

const { v4: uuid } = require('uuid')

const auditionList = [
  {
    id: 0,
    project: 'F&F',
    role: 'racer chick',
    date: '5/5/20',
    castingDirector: 'Rachel Tenner',
    productionCompany: 'Universal Pictures',
    medium: 'feature film',
    source: 'manager',
    method: 'in-person',
    notes: 'Taped with assoc. Rick Messina. Went well. He gave me 5 takes.',
    coaching: 'false',
    callbacks: [],
  },
]

router.post('/createaccount', async (req, res, next) => {
  console.log(config)
  const client = new Client(config);
  await client.connect();
  const authtoken = uuid()
  const data = await client.query(`INSERT INTO users (
    name,
    email,
    password,
    authtoken
  ) VALUES (
    '${req.body.name}',
    '${req.body.email}',
    '${req.body.password}',
    '${authtoken}'
  )`)
  await client.end()
  res.json(authtoken)
})

router.post('/login', async (req, res, next) => {
  const client = new Client(config);
  await client.connect();
  const users = await client.query(`SELECT * FROM users WHERE email = '${req.body.email}' AND password = '${req.body.password}'`)
  if (users.rows.length > 0) {
    const authtoken = uuid()
    const query = `
      UPDATE users
      SET 
        authtoken = '${authtoken}'
      WHERE 
        id = ${users.rows[0].id}
    `
    await client.query(query)
    res.json({success: true, message: authtoken})
  } else {
    res.json({success: false, message: "Invalid username or password"})
  }
  await client.end()
})

router.get('/auditions', checkForValidUser, async (req, res, next) => {
  const client = new Client(config);
  await client.connect();
  const data = await client.query(`SELECT * FROM auditions WHERE "userId" = '${req.user.id}'`)
  console.log(data.rows)
  await client.end()
  res.json(data.rows)
})

router.get('/auditions/:id', checkForValidUser, async (req, res, next) => {
  const client = new Client(config);
  await client.connect();
  const data = await client.query(`SELECT * FROM auditions WHERE id = ${req.params.id} AND "userId" = '${req.user.id}'`)
  console.log(data.rows)
  await client.end()
  res.json(data.rows[0])
})

router.post('/auditions', checkForValidUser, async (req, res, next) => {
  const client = new Client(config);
  await client.connect();
  const query = `
    INSERT INTO auditions (
      "userId",
      project,
      role,
      date,
      "castingDirector",
      coaching,
      "productionCompany",
      medium,
      source,
      callback,
      method, 
      notes
    ) VALUES (
      '${req.user.id}',
      '${req.body.project}',
      '${req.body.role}',
      '${req.body.date}',
      '${req.body.castingDirector}',
      '${req.body.coaching}',
      '${req.body.productionCompany}',
      '${req.body.medium}',
      '${req.body.source}',
      '${req.body.method}',
      '${req.body.callback}',
      '${req.body.notes}'
    );
  `
  const data = await client.query(query)
  await client.end()
  res.json(data)
})

router.put('/auditions/:id', checkForValidUser, async (req, res, next) => {

  if (req.body.project === undefined) {
    res.json('Please enter a project name.')
    return
  }
  if (Number.isInteger(parseInt(req.params.id)) === false) {
    res.json('Not a valid url.')
    return
  }
  const client = new Client(config);
  await client.connect();
  const query = `
    UPDATE auditions
    SET 
      project = '${req.body.project}',
      role = '${req.body.role}',
      date = '${req.body.date}',
      "castingDirector" = '${req.body.castingDirector}',
      coaching = '${req.body.coaching}',
      "productionCompany" = '${req.body.productionCompany}',
      medium = '${req.body.medium}',
      source = '${req.body.source}',
      callback = '${req.body.method}',
      method = '${req.body.callback}', 
      notes ='${req.body.notes}'
    WHERE 
      id = ${req.params.id}
    AND
      "userId" = '${req.user.id}'
  `
  const data = await client.query(query)
  await client.end()
  res.json(data)
})

router.delete('/auditions/:id', checkForValidUser, async (req, res, next) => {
  const client = new Client(config);
  await client.connect();
  const query = `
  DELETE FROM auditions
  WHERE 
    id = ${req.params.id}
  AND
    "userId" = ${req.user.id}
`
const data = await client.query(query)
  await client.end()
  res.json(data)
})

router.get('/auditions/:id/:callbackid', (req, res, next) => {
  const audition = auditionList.find(e => {
    return e.id == req.params.id
  })
  res.json(audition.callbacks)
})

router.post('/auditions/:id', (req, res, next) => {
  const i = auditionList.findIndex(e => {
    return e.id == req.params.id
  })
  const newCallback = {
    id: auditionList[i].callbacks.length,
    date: req.body.date,
    coaching: req.body.coaching,
    method: req.body.method,
    notes: req.body.coaching,
  }
  auditionList[i].callbacks.push(newCallback)
  res.json(auditionList[i].callbacks)
})

router.delete('/auditions/:id/:callbackid', (req, res, next) => {
  const i = auditionList.findIndex(e => {
    return e.id == req.params.id
  }) 
  const j = auditionList[i].callbacks.findIndex(c => {
    return c.id == req.params.callbackid
  })
  auditionList[i].callbacks.splice(j, 1)
  res.json(auditionList[i].callbacks)
})

module.exports = router;
