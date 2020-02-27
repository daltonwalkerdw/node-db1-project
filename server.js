const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.post("/accounts", async (req, res, next) => {
    try{
     const payload = {
         name: req.body.name,
         budget: req.body.budget
     };

     const [id] = await db.insert(payload).into("accounts");
     const newAccount = await db("accounts").where("id", id).first();

     res.json(newAccount);
    } catch(err) {
        next(err)
    } 
})

server.delete("/accounts/:id", async (req, res, next) => {
    try{
     await db("accounts").where("id", req.params.id).del()
     res.status(204).end()
    } catch(err) {
        next(err)
    } 
})

server.put("/accounts/:id", async (req, res, next) => {
    try{
        const payload = {
            name: req.body.name,
            budget: req.body.budget
        };

        await db("accounts").where("id", req.params.id).update(payload)
        const account = await db("accounts").where("id", req.params.id).first()

        res.json(account)
    } catch(err) {
        next(err)
    } 
})

server.get("/accounts", async (req, res, next) => {
    try{
    const query = {
            limit: req.query.limit,
            sortBy: req.query.sortBy,
            sortDir: req.query.sortDir
          }

     const accounts = await db.select("*").from("accounts").orderBy(query.sortBy, query.sortDir).limit(query.limit)
     res.json(accounts)
    } catch(err) {
        next(err)
    } 
})
server.get("/accounts/:id", async (req, res, next) => {
    try{
     const account = await db.select("*").from("accounts").where("id", req.params.id).first()
     res.json(account)
    } catch(err) {
        next(err)
    } 
})

// function validateBody (req, res, next){
//     if(req.body.name){
//         next()
//     } else {
//         res.status(400).json({
//             message: "Body required"
//         })
//     }
// }

module.exports = server;