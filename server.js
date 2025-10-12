const express = require('express')
const mongoose = require('mongoose')

const app = express();

// Serve static files from the 'public' directory
app.use(express.static('public')); 


app.use(express.json())

app.set('view engine','ejs')

mongoose.connect('mongodb+srv://abhiapatil2028:d1rCGg6sjNW4rDSJ@thor.d6qopcg.mongodb.net/')
.then(()=>{console.log('Mongodb Connect')})
.catch((err)=>{console.log(err)});



const hotelschema = new mongoose.Schema({
    title:String,
    images:[
    String
    ],
    price:Number,
    host:String,
    guests:Number,
    bedroom:Number,
    beds:Number,
    bathroom:Number,
    rating:Number,


})

const Hotel = mongoose.model('hotel',hotelschema)

app.post('/hotel',async(req,res)=>{
    await Hotel.create(req.body)
    res.send("Hotel added succesfully")
})


app.get('/',async(req,res)=>{
    const hotels = await Hotel.find()
    // console.log(hotels)
    res.render('home', {hotels});
})

app.get('/hotel',async (req,res)=>{
   const data = await Hotel.find();
   res.send(req.body);
 })

 app.get('/hotels/:id',async (req,res)=>{
   const hotelId = req.params.id;
   const hotel = await Hotel.findById(hotelId)
   console.log(hotel)
   console.log('hiii')
   res.render('hoteldata',{hotel});
 })

app.listen(3500,()=>{
    console.log("server  start at 3500")
})