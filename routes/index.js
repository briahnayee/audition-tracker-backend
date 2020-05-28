var express = require('express');
var router = express.Router();

const auditionList = [
  {
    id: 1,
    project: 'Herp',
    callbacks: []
  },
  {
    id: 2,
    project: 'Derp'
  },
  {
    id: 3,
    project: 'Fleep'
  },
  {
    id: 4,
    project: 'Floop'
  }
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
    project: req.body.project
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
    date: req.body.date
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
  console.log(i,j)
  auditionList[i].callbacks.splice(j, 1)
  res.json(auditionList[i].callbacks)
})



/*

ADD GET SINGLE / POST / PUT / DELETE ROUTES FOR CALLBACKS HERE

*/



module.exports = router;
