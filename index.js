const express = require('express');
const {Client} = require('pg');
const Joi = require('joi');
const {userSchema,userUpdateSchema} = require('./validator');

const conn = new Client({
    host:"localhost",
    user:"postgres",
    port:5432,
    password:"root",
    database:"LoginDB",

})

conn.connect().then((
    console.log("connected!")
))
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json())
app.post('/createUser',async (req, res) => {
    const{error,value } = userSchema.validate(req.body);
    if(error)
    {
      console.log(error);
      return res.send(error.details);
    }
    const { name, email, password } = req.body;
   try {
    const result = await  conn.query('INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *',
      [name,email,password]
    )
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }

    
  });
 
  
  //get all users
  app.get('/getUserData',async (req, res) => {
    
  try {
    const result = await conn.query('SELECT * from users')
    res.status(201).json(result.rows[0]);
    
  } catch (error) {
    res.status(500).send(err.message);
  }
    
    // const select_query = `SELECT * from users`;
    // conn.query(select_query, (err, result) => {
    //   if (!err) {
    //     console.log(result);
    //     res.send(result.rows);
    //   } else {
    //     res.send(err);
    //   }
    // });
  });

  //get a user by name
  app.get('/getUserDataByName/:name', async (req, res) => {
    const {name}= req.params;
   try {
    const result = await conn.query('SELECT * FROM users WHERE name = $1',[name]);
    if( result.rows.length === 0)
    {
       return res.send("User doesn't exist");
    }
    
      res.json(result.rows[0]);
    
    
   } catch (err) {
    res.status(500).send(err);
   }
    // const select_query = `SELECT * FROM users WHERE name = $1`;
    //  await conn.query(select_query, [name],(err, result) => {
    //   if (!err) {
    //     console.log(result);
    //     res.send(result.rows);
    //   } else {
    //     res.send(err);
    //   }
    // });
  });
  //delete a user by name
app.delete('/deleteUser/:name',(req,res)=>{
    const name = req.params.name;
    const delete_query = `DELETE from users WHERE name = $1`;
    conn.query(delete_query,[name],(err,result)=>{
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
app.put('/updateUser/:id1',(req,res)=>{
  const{error } = userUpdateSchema.validate(req.body);
    if(error)
    {
      console.log(error);
      return res.send(error.details);
    }

  const id1 = req.params.id1;
const name= req.body.name;
const password= req.body.password;
const update_query = `UPDATE users SET name=$1,password=$2 WHERE id1=$3`;
conn.query(update_query,[name,password,id1],(err,result)=>{
  if(!err)
  {
    console.log()
    res.send("user updated");
  }
  else{
    res.send(err)
  }
})


})

app.listen(process.env.PORT,()=>{
    console.log('SERver started!')
})

module.exports = app;