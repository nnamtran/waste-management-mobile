const axios = require('axios')
PORT = 8000

const express = require('express')
const {MongoClient} = require('mongodb')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const uri = "mongodb+srv://nnamtran:87422491243Nam@cluster0.y6iye3s.mongodb.net/?retryWrites=true&w=majority";

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json('Hello to my app')
})

app.get('/barcode', async (req, res) => {
    const client = new MongoClient(uri)
    const barcode = req.query.barcode

    try {
        await client.connect()
        const database = client.db('recycling-data')
        const barcodes = database.collection('recycling')

        const query = {barcode: barcode}
        const item = await barcodes.findOne(query)
        if (item === null) {
            const options = {
                method: 'GET',
                url: 'https://barcodes1.p.rapidapi.com/',
                params: {query: query.barcode},
                headers: {
                  'X-RapidAPI-Key': '51b32748f3msh07d3784cff8ad81p1046f7jsn6a0721dbdce1',
                  'X-RapidAPI-Host': 'barcodes1.p.rapidapi.com'
                }
              };
              
              axios.request(options).then(function (response) {
                //   console.log(response.data.product.title);
                const APIitem = {
                    title: response.data.product.title,
                    image: response.data.product.images[0],
                    isRecyclable: null
                }
                res.send(APIitem)
              }).catch(function (error) {
                  console.error(error);
              });
        } else {
            res.send(item)
        }
    } finally {
        await client.close()
    }
})

app.post('/additem', async (req, res) => {
    const client = new MongoClient(uri)
    const {title, barcode, image, recycle} = req.body
    try {
        await client.connect()
        const database = client.db('recycling-data')
        const barcodes = database.collection('recycling')
        if (title != '' && recycle!=null) {
            const data = {
                title: title,
                barcode: barcode,
                image: image,
                isRecyclable: recycle
            }
            const insertedItem = await barcodes.insertOne(data)
            res.send(insertedItem)
        }
        
    } finally {
        await client.close()
    }
})

app.listen(PORT, () => console.log('Server running on PORT ' + PORT))