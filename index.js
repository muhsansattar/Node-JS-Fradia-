// modules 
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const app = express();


app.use(bodyParser.urlencoded({extended: true}));
 app.set('view engine', 'ejs');
app.use(express.static("public"));


// mongoDB connection

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Products', { useNewUrlParser: true, useUnifiedTopology: true });
const productSchema = new mongoose.Schema({
  name: String,
  size: String,
  price: Number,
  image: String,
  category : String 
});
const Products = mongoose.model('products', productSchema);



// Products page

let productArray = [];

app.post("/products", async (req, res) => {
  let category = req.body.category;
  // add this line to check if category is received

  category = category.charAt(0).toUpperCase() + category.slice(1);

  // Query the database to retrieve products by category
  const product = await Products.find({ category });

  productArray = product;

  res.render("products", { productArray });
});


// Login authentication JUGAAR 


 app.post("/login", (req, res) => {
  
   const { username, password } = req.body;

   if (username === "admin" && password === "123") {
    // set the user object in the session
    res.render("compose");
  } else {
    res.redirect("/");
  }
});

// Part of compose section only for Admin

app.post('/updateproduct', (req, res) => {
  let updateFields = {};
  
  if (req.body.name) {
    updateFields.name = req.body.name;
  }
  
  if (req.body.size) {
    updateFields.size = req.body.size;
  }
  
  if (req.body.price) {
    updateFields.price = Number(req.body.price);
  }
  
  if (req.body.image) {
    updateFields.image = req.body.image;
  }
  
  if (req.body.category) {
    updateFields.category = req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1);
  }
  
  Products.findByIdAndUpdate(req.body.id, { $set: updateFields })
    .then(() => {
      console.log('Product updated');
      res.redirect('/');
    })
    .catch(err => console.log(err));
});

// part of compose section

app.post("/addproduct",(req,res)=>{

   
  let type = req.body.category;
 

  type = type.charAt(0).toUpperCase() + type.slice(1);
  
  const newProduct = new Products({
    name: req.body.name,
    size: req.body.size,
    price: Number(req.body.price),
    image: "media/" + req.body.image,
    category: type
  });

  newProduct.save()
    .then(() => {
      console.log('Product saved to database');
      res.redirect("/compose");
    })
    .catch(err => console.log(err));


  res.redirect("/products");
});




app.post('/compose', (req, res) => {
  const action = req.body.action;
  if (action === 'addproduct') {
    res.render('addproduct');
  } else if (action === 'deleteproduct') {
    res.render('deleteproduct');
  } else if (action === 'updateproduct') {
    res.render('updateproduct');
  }
});

app.post("/deleteproduct", (req, res) => {
  Products.findByIdAndDelete(req.body.id)
    .then(() => {
      console.log('Product deleted');
      res.redirect("/");
    })
    .catch(err => console.log(err));
});








app.get("/", (req, res) => {
  res.render("home"  );
});



app.get("/about" , (req,res) => {
  res.render("about");
})

app.get("/login" , (req,res) => {
  res.render("login");
})

app.get("/contact" , (req,res) =>{

  res.render("contact");
})

app.get("/signup" , (req,res) => {
  res.render("signup");
})


app.get("/products" , (req,res) => {
  res.render("products" , {productArray : productArray});
})
 

app.listen("3000", () =>{

  console.log("server started ");

});