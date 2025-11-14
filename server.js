const express = require('express')
const bodyParser = require('body-parser');
const path = require('path')
const mongoose = require('mongoose')

const app = express();

// Middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(express.json())

// set ejs as template engine
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'));

// Serve static files from the 'public' directory
app.use(express.static('public')); 


async function connectDB() {
    try{
     const conn = await mongoose.connect(
        "mongodb+srv://abhiapatil2028:1eNH058L7BwzN9Dk@thor.d6qopcg.mongodb.net/"
     );
     console.log("MongoDB connected");
     console.log("connected DB:",conn.connection.name)
    }catch(error){
        console.log("MongoDB connection error:",error)
    }
}
connectDB();



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
    pricePerNight:Number


})

const Hotel = mongoose.model('Hotel',hotelschema)

app.post('/hotel',async(req,res)=>{
    await Hotel.create(req.body)
    res.send("Hotel added succesfully")
})


app.get('/',async(req,res)=>{
    const hotels = await Hotel.find()
    // console.log(hotels)
    res.render('home', {hotels});
});



app.post('/hotel',async(req,res)=>{
    await Hotel.create(req.body)
    // res.send("Hotel added succesfully");
    res.redirect("/")
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


 app.put('/hotel/:id',async(req,res)=>{
    const hotelId = req.params.id;
    await Hotel.findByIdAndUpdate(hotelId,req.body);
    res.send("Update data Successfully ")
 })

 app.delete('/hotel/:id',async(req,res)=>{
    const hotelId = req.params.id;
    await Hotel.findByIdAndDelete(hotelId);
    res.send("Delete Data Successfully")
 })

// // form

// userSchema

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        maxlength:[100,'Name cannot exceed 100 charaters']
    },
    email:{

        type:String,
        required:[true,'Password is required'],
        minlength:[6,'Password must be at least characters']
    },
   password:String
    
});
const User = mongoose.model('User',userSchema)



// form
// route to display form

// home Page
app.get('/RegisterNow',(req,res)=>{
    res.render('index');
});

// show login form
app.get('/login',(req,res)=>{
    res.render('login',{error:null});
});

// handle login
app.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    // find user by email

    const user = await User.findOne({ email:email});

    if(user && user.password === password){
        res.send(`Login successfull ${user.username}`)
    }else{
        res.render('login',{error:'Invalid email or password'});
    }
});

// Show register Form

app.get('/register',async (req,res)=>{
    res.render('register',{error:null});
});

// Handle Registration

app.post('/register',async(req,res)=>{
    const {username,email,password} = req.body;

    // check if user already exists

    const existingUser = await User.findOne({email:email});
    if(existingUser){
        return res.render('register',{error:'User already exists'});
    }

    // Create new user 
    const newUser = new User({
        username:username,
        email:email,
        password:password
    });
    await newUser.save();
    res.send(`Registration Successsful Welcome ${username}`);

});
    
   
// 
app.get('/layout',(req,res)=>{
    // res.send("hii")
    res.render("layout")
})


// Booking model

const bookingSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    hotelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel",
        required:true
    },
    checkIn:{
        type:Date,
        required:true
    },
    checkOut:{
        type:Date,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"confirmed"
    }

});

console.log("Connected DB:", mongoose.connection.name);

const Booking = mongoose.model("Booking",bookingSchema);



app.post('/booking',async (req,res)=>{
    console.log("abhi")
    try{
   const {userId,hotelId,checkIn,checkOut} = req.body;
console.log("hotel ",Hotel)
const hotel = await Hotel.findById(hotelId);
console.log("FOUND HOTEL:", hotel);

//    const hotel = await Hotel.findById(hotelId);
//    if(!hotel) return res.send("Hotel not found");

   const start = new Date(checkIn);
   const end = new Date(checkOut);

   const diffTime = end - start;
   const nights = Math.ceil(diffTime /(1000*60*60*24));

   if(nights <= 0){
    return res.send("Invalid Date range")
   }

   const totalPrice = hotel.pricePerNight * nights;

   const booking = await Booking.create({

    userId,
    hotelId,
    checkIn,
    checkOut,
    totalPrice
   });

   res.json({
    message:"Booking successful",
    booking
   });

    }catch(error){
    res.json({message:error.message})
    // res.send("error")
    }
})


app.get('/bookings',async(req,res)=>{
    const booking = await Booking.find().populate('userId').populate("hotelId");
    res.json(booking);
})

app.listen(3500,()=>{
    console.log("server  start at 3500")
});
