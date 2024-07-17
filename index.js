const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express =require ("express");
const app = express();
const path=require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views", path.join(__dirname ,"/views"));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sql_practice',
    password: '1234567890'
  });

app.get("/",(req,res) => {
    let q='SELECT count(*) FROM user';
    try{
        connection.query(q, (err, result) => {
            if(err) throw err;
            let count = result[0]["count(*)"];
            res.render("hpmepage.ejs" , {count});
        });
    }catch (err){
        console.log(err);
        res.send("some error is database");
    } 
});

//all users list
app.get("/users",(req,res) =>{
    let q='SELECT * FROM user';
    try{
        connection.query(q, (err, users) => {
            if(err) throw err;
           //console.log(result);
           res.render("showUsers.ejs",{users});
        });
    }catch (err){
        console.log(err);
        res.send("some error is database");
    } 
});

//edit user
app.get("/users/:id/edit",(req,res) => {
    let {id} = req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q, (err, result) => {
            if(err) throw err;
           let user =result[0];
           res.render("edit.ejs",{user});
        });
    }catch (err){
        console.log(err);
        res.send("some error is database");
    }
});

//UPDATE ROUTE
app.patch("/users/:id",(req,res)=>{
  let {id} = req.params;
  let {password:formPass , username:newUsername} = req.body;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    try{
        connection.query(q, (err, result) => {
           if(err) throw err;
           let user =result[0];
           if(formPass != user.password){
            res.send("WRONG PASSWORD")
           }else{
            q2 =`UPDATE user SET username ='${newUsername}' WHERE id='${id}'`;
            connection.query(q2 , (err, result) =>{
              if (err) throw err;
              res.redirect("/users");
            });  
           }
        });
    }catch (err){ 
        console.log(err);
        res.send("some error is database");
    }
});

//DELETE ROUTE 
app.delete("/users/:id",(req , res) => {
  let {id} = req.params;
    let q3=`DELETE FROM user WHERE id='${id}'`;
    try{
        connection.query(q3, (err, result) => {
            if(err) throw err;
           let user =result[0];
           res.redirect("/users");
        });
    }catch (err){
        console.log(err);
        res.send("some error is database");
    }

});

//details of NEW USER 
app.post("/users/newuser",(req,res) =>{
  res.render("newUser.ejs");
});

//adding new user to list
app.post("/users/adduser",(req,res) =>{
  let {id:form_id , username:form_username , email:form_email , password:form_password} = req.body;
    let q4=`INSERT INTO user (id , email ,username , password) VALUES (?, ? ,?, ?)`;
    let data=[form_id , form_email , form_username , form_password];
    try{
        connection.query(q4,data, (err, result) => {
            if(err) throw err;
           let user =result[0];
           res.redirect("/users");
        });
    }catch (err){
        console.log(err);
        res.send("some error is database");
    }
});

app.listen("3000", () => {
    console.log("listening to port 3000")
});





/*

//query and array for data storation  
  let q="INSERT INTO user (id , username , email , password) VALUES ?";
  let data = [];
//faker function to create random user data in array
  let getRandomUser = () => {
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  };
//for loop used here to push data in bulk
  for(let i=0;i<100;i++){
    data.push(getRandomUser());
  }
//adding data through query
  try{
    connection.query(q,[data], (err, result) => {
        if(err) throw err;
        console.log(result);
    });
  }catch (err){
    console.log(err);
  }

*/