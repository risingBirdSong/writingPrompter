// const { Client } = require("pg");
import { Client } from "pg"
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
// import client from "../database/index.js";
const PORT = process.env.PORT || 5000;
const app = express();
// app.use(bodyParser);
app.use(express.json())

function randomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "writingprompter",
  user: "postgres",
  password: "datasaver",
});

client.connect().then(() => {
  console.log('connected');

  app.get('/test', (req, res) => {
    res.send('hello there testing');
  })

  app.get('/express_backend', (req, res) => {
    console.log('they requested data');
    res.json({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
  });

  app.get('/gettwowords', (req, res) => {
    client.query('select count(*) from likedwords').then(async (data) => {
      let amount = Number(data.rows[0].count)
      let first = randomNumber(1, amount);
      let second = first;
      while (second == first) {
        second = randomNumber(1, amount);
      }
      const grabFirst = (await client.query(`select likedword from likedwords where id = ${first};`)).rows[0].likedword as string;
      const grabSecond = (await client.query(`select likedword from likedwords where id = ${second};`)).rows[0].likedword as string;
      console.log('grabfirst', grabFirst);
      res.send([[grabFirst, first], [grabSecond, second]]);
    }).catch((err) => {
      let errMsg = `error from gettwowords! ${err}`;
      res.send(errMsg);
    })
  })


  app.post('/likedword', (req, res) => {
    //todo make sure if the word has already been added they cant add it again
    console.log('req body', req.body);
    let { word } = req.body;
    console.log('word', word);
    client.query(`select likedword from likedwords where likedword = '${word}'`).then((data) => {
      console.log('then data', data);
      if (!data.rowCount) {
        client.query(`insert into likedwords (likedword) VALUES ('${word}')`)
        res.send('your word has been added!');
      } else {
        res.send('your word was already in our database!');
      }
    })
    // res.send('word has been added!');
  })

  app.post('/sentence', (req, res) => {
    let sql = `INSERT INTO sentences (sentence, firstword, secondword) VALUES ($1 , $2 , $3)`
    let values = [req.body[0], req.body[1][0], req.body[1][1]];
    client.query(sql, values).then(() => {
      res.send('your sentence has been submitted');
    }).catch((err) => {
      res.send(`error! ${err}`);
    })
  })

  app.post('/addexpandedsentence', (req, res) => {
    let sql = `insert into expandedsentences (sentence) values ($1)`;
    let values = [req.body.data];
    client.query(sql, values).then((data) => {
      res.send('done inserting');
    })
  })

  app.get('/allsentences', (req, res) => {
    let sql = `select sentence, id from sentences`;
    client.query(sql).then((data) => {
      let cleaned = data.rows.map(d => [d.sentence, d.id])
      res.send(cleaned);
    })
  })

  app.get('/singlesentence', (req, res) => {
    let sql = `select sentence from sentences order by random() limit 1`
    client.query(sql).then((data) => {
      res.send(data.rows[0].sentence);
    })
  })

  app.get('/allextended', (req, res) => {
    client.query('select sentence from expandedsentences').then((data) => {
      let cleaned = data.rows.map((info) => info.sentence)
      res.send(cleaned);
    })
  })



  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  })

})




