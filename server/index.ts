import express from "express";
import axios from "axios";
const app = express();

const PORT = process.env.PORT || 5000;

app.get('/test', (req, res) => {
  res.send('hello there testing');
})

app.get('/express_backend', (req, res) => {
  console.log('they requested data');
  res.json({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

console.log('hitting?');
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})