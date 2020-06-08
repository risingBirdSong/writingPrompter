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

      console.log('here');
      res.send([grabFirst, grabSecond])
    }).catch((err) => {
      res.send('error fromget two words!');
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


  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  })

})




