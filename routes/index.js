var express = require('express');
var router = express.Router();

const auditionList = [
  {
    id: 1,
    project: 'F&F',
    role: 'racer chick',
    castingDirector: 'Rachel Tenner',
    productionCompany: 'Universal Pictures',
    medium: 'feature film',
    source: 'manager',
    method: 'in-person',
    notes: 'Taped with assoc. Rick Messina. Went well. He gave me 5 takes.',
    callbacks: [],
  },
]

router.get('/auditions', (req, res, next) => {
  res.json(auditionList)
})

router.get('/auditions/:id', (req, res, next) => {
  const audition = auditionList.find(e => {
    return e.id == req.params.id
  })
  res.json(audition)
})

router.post('/auditions', (req, res, next) => {
  const audition = {
    id: auditionList.length,
    project: req.body.project,
    role: req.body.role,
    castingDirector: req.body.castingDirector,
    productionCompany: req.body.productionCompany,
    medium: req.body.medium,
    source: req.body.source,
    method: req.body.method,
    notes: req.body.notes
  }
  auditionList.push(audition)
  res.json(auditionList)
})

router.put('/auditions/:id', (req, res, next) => {
  if (req.body.project === undefined) {
    res.json('Please enter a project name.')
    return
  }
  if (Number.isInteger(req.params.id) == false) {
    res.json('Not a valid url.')
    return
  }
  const i = auditionList.findIndex(e => {
    return e.id == req.params.id
  })
  // CHECK IF AUDTION WAS NOT FOUND
  auditionList[i].project = req.body.project
  auditionList[i].role = req.body.role
  auditionList[i].castingDirector = req.body.castingDirector
  auditionList[i].productionCompany = req.body.productionCompany
  auditionList[i].medium = req.body.medium
  auditionList[i].source = req.body.source
  auditionList[i].notes = req.body.notes
  res.json(auditionList)
})

router.delete('/auditions/:id', (req, res, next) => {
  const i = auditionList.findIndex(e => {
    return e.id == req.params.id
  })
  auditionList.splice(i, 1)
  res.json(auditionList)
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
