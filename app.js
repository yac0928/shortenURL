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
  const inputurl = req.query.url
  if (inputurl) {
    res.render('short', {})
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//隨機ID
function randomID(num) {
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let id = ''
  for (let i = 0; i < num; i++) {
    id += Math.floor(Math.random() * char.length)
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
    fs.writeFileSync('./public/jsons/url.json', jsonData, 'utf-8');
  }
  return `http://localhost:3000/${id}`
}


//複製連結
const urlField = document.getElementById("urlField")
const copyBtn = document.getElementById("copyBtn")
copyBtn.addEventListener("click", function() {
  urlField.ariaSelected()
  navigator.clipboard.writeText(urlField.value)
    .then(function() {
      alert("Copied: " + urlField.value)
    })
    .catch(function(err) {
      console.log("Failed: " + err)
    })
})