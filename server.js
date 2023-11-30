
const express = require('express')
var cors = require('cors')
require('dotenv').config()
const STRIPE_API_KEY = process.env.STRIPE_API_KEY

const stripe = require('stripe')(STRIPE_API_KEY)


const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json())

app.post("/checkout", async (request, response) => {
  
    const items = request.body.items;
    let line_items = [];
    items.forEach((item) => {
        line_items.push(
            {
                price: item.id,
                quantity: item.quantity
            }
        )
    });

    const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url : "http://localhost:3000/success",
        cancel_url  : "http://localhost:3000/cancel"
    });

    response.send(JSON.stringify({
        url : session.url
    }));
});


app.listen(4000, () => console.log("Server Listening on Port 4000......."))
