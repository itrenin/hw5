import express from 'express'
import fs from 'fs'
import path from 'path'

import React from 'react'
import ReactDOMServer from 'react-dom/server'

import Appl from './src'

const PORT = 3000

const app = express()

app.use('^/$', (req, res, next) => {
  fs.readFile(path.join(__dirname, './build/index.html'), 'utf-8', (err, data) => {
    if (err) {
      console.log(err)
      return res.status(500).send('Some error happened')
    }
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(<Appl />)}</div>`
      )
    )
  })
})

app.use(express.static(path.join(__dirname, './build')))

app.listen(PORT, () => {
  console.log(`App launched on ${PORT}`)
})
