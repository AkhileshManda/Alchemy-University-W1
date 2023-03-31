const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04a2eb1c23f48c9bc1ec7e3d3848b97b3c92bc9171b72397cb01a8ee339faba7cb5d082dc6926c2dec414380c33db0a65cccebf562750d35e565d2fdba08508664": 100,
  "040782fc2b2c401031a1ec1578e368841d9cab5c3d14b9fa60dd17748ec2f9ff92869a2e5e1039c3609587220018777bb4fa25225e288a4136e997914e5972875b": 50,
  "04bfffc5ec20e6863834082e04a3615c1af516cf045a2839a8c03e06a7d262041a7ef9671d3d82c18ccb368d5942e5174ed32bdc28ffdbb94d0f30cdb24a7aeae0": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
