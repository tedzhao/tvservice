const express = require('express');
const fs = require('fs');
// const mysql = require('mysql');
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3002;

app.use(bodyParser.json());

app.engine(
  'html',
  handlebars.engine({
    defaultLayout: null,
  }),
);

app.get('/', (req, res) => {
  const text = fs.readFileSync('./data/data');
  res.render(path.join(__dirname, './public/index.html'), {
    text,
  });
});

app.post('/urls', (req, res) => {
  const text = req.body.text;
  console.log(req.body);
  try {
    fs.writeFileSync('./data/data', text);
    res.json({
      status: 200,
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: 500,
    });
  }
});

app.get('/urls', (req, res) => {
  const data = fs.readFileSync('./data/data');
  const urls = data.toString().replace('\r\n', '\n').split('\n');
  if (!urls[urls.length - 1]) {
    urls.pop();
  }
  const rows = urls.map(i => ({
    url: i,
  }));
  res.json(rows);
  res.end();
  // const connection = mysql.createConnection({
  //   host: 'dashboard-test-cn-2.grapecitydev.com',
  //   port: 3001,
  //   user: 'root',
  //   password: 'xA123456',
  //   database: 'wynTVTest',
  //   insecureAuth: true,
  // });
  // connection.connect();

  // connection.query(
  //   'select url FROM wynTVTest.testUrls',
  //   (err, rows, fields) => {
  //     if (err) {
  //       console.log(err);
  //       res.json([]);
  //       res.end();
  //       return;
  //     }
  //     console.log(rows);
  //     res.json(rows);
  //     res.end();
  //   },
  // );

  // connection.end();
});
server.listen(port, () => {
  console.log(`listening on *: ${port}`);
});
