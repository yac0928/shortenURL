const express = require('express')
const { engine } = require('express-handlebars')
const fs = require('fs')
const app = express()
const port = 3000
const urls = require('./public/jsons/urls.json')

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/shorten', (req, res) => {
  const inputURL = req.query.url
  if (inputURL) {
    let shortURL = shorten(inputURL, urls)
    res.render('short', {shortURL})
  } else {
    res.redirect('/')
  }
})

app.get('/:id', (req, res) => {
  let id = req.params.id
  let url = urls.find((data) => data.id === id)
  if (!url) {
    res.redirect('/')
  }
  res.redirect(url.origin)
})

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:3000`)
})

//隨機ID
function randomID(num) {
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < num; i++) {
    id += char[Math.floor(Math.random() * char.length)]
  }
  //判斷是否重複
  if (urls.some((url) => url.id === id)) {
    return randomID(num)
  }
  return id
}

//Shorten
function shorten(input, datas) {
  if (datas.some(data => data.origin === input)) {
    id = datas.find(data => data.origin === input).id
  } else {
    id = randomID(5)
    datas.push({
      id: id,
      origin: input
    })
    const jsonData = JSON.stringify(datas, null, 2);
    // 寫入 JSON 檔案
    fs.writeFileSync('./public/jsons/urls.json', jsonData, 'utf-8');
  }
  return `http://localhost:3000/${id}`
}