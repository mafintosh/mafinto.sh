const posts = require('./index.json')
const fs = require('fs')
const marked = require('marked')
const path = require('path')

const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8')

marked.setOptions({
  highlight: function (code, lang) {
    // TODO: find highlighter
    return code
  }
})

posts.forEach(function (post, i) {
  if (post.published === false) return

  const source = marked(fs.readFileSync(path.join(__dirname, post.source), 'utf-8'))
  const link = post.source.replace('.md', '.html')
  const page = template
    .replace(/\{source\}/g, source)
    .replace(/\{permalink\}/g, '<a href="' + link + '">' + post.date + ', Mathias Buus</a>')
    .replace(/\{title\}/g, post.title)

  fs.writeFileSync(path.join(__dirname, link), page)
})

const links = posts.map(function (post) {
  if (post.published === false) return
  const link = post.source.replace('.md', '.html')
  return `<li><a href="${link}">${post.title}</a></li>`
})

const index = `<html>
<head>
  <title>Blog</title>
  <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet">
  <style>
    html {
      --black: #3B3737;
      --red: #991818;
      --white: #F7F7F7;
      --gray: #C9D1D3;
      --blue: #0086B3;
    }

    h1 {
      font-size: 100px;
      font-weight: normal;
      margin: 0;
      margin-bottom: 25px;
    }

    a {
      color: var(--blue);
      text-decoration: none;
    }

    ul, li {
      margin: 0;
    }

    li {
      margin-bottom: 20px;
    }

    body {
      font-family: 'Merriweather', serif;
      color: var(--black);
      background-color: var(--white);
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
    }

    main {
      margin: auto;
      max-width: 550px;
      display: flex;
      padding-top: 10%;
    }
  </style>
</head>
<body>
<main>
  <div>
    <div>
      <h1>Blog</h1>
    </div>
    <ul>
      ${links.join('\n')}
    <ul>
  </div>
</main>
</body>
</html>`

fs.writeFileSync(path.join(__dirname, 'index.html'), index)
