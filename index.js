const express = require('express');
const {Client} = require('pg');

const conn = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"root",
    database:"apiDB",

})

conn.connect().then((
    console.log("connected!")
))
const dotenv = require('dotenv');
const e = require('express');
dotenv.config();

const app = express();
app.use(express.json())


//create a user
app.post('/createUser', (req, res) => {
    const { name1, email, password } = req.body;
    const insert_query = `INSERT INTO users (name1, email, password) VALUES($1, $2, $3)`;
  
    conn.query(insert_query, [name1, email, password], (err, result) => {
      if (!err) {
        console.log(result);
        res.send(" User created Successfully");
      } else {
        res.send(err);
      }
    });
  });
 
  
  //get all users
  app.get('/getUserData', (req, res) => {
    const select_query = `SELECT * from users`;
    conn.query(select_query, (err, result) => {
      if (!err) {
        console.log(result);
        res.send(result.rows);
      } else {
        res.send(err);
      }
    });
  });


  //get a user by name
  app.get('/getUserDataByName/:name1', (req, res) => {
    const name1= req.params.name1;
    const select_query = `SELECT * FROM users WHERE name1 = $1`;
    conn.query(select_query, [name1],(err, result) => {
      if (!err) {
        console.log(result);
        res.send(result.rows);
      } else {
        res.send(err);
      }
    });
  });


  //delete a user by name
app.delete('/deleteUser/:name1',(req,res)=>{
    const name1 = req.params.name1;
    const delete_query = `DELETE from users WHERE name1 = $1`;
    conn.query(delete_query,[name1],(err,result)=>{
        if(!err)
        {   
            console.log(result)
            res.send('User Deleted Succesfully!')
            
        }
        else
        {
            res.send(err)
        }
    })
})


//update a user
app.put('/updateUser/:name1',(req,res)=>{
  const name1 = req.params.name1;
const email= req.body.email;
const password= req.body.password;
const update_query = `UPDATE users SET email=$1,password=$2 WHERE name1=$3`;
conn.query(update_query,[email,password,name1],(err,result)=>{
  if(!err)
  {
    console.log(result)
    res.send("updated user successfully");
  }
  else{
    res.send(err)
  }
})
})




app.listen(process.env.PORT,()=>{
    console.log('SERver started!')
})