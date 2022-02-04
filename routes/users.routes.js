const express = require('express')
const bcrypt = require('bcrypt');
const { getUser, createUser, deleteUsers, updateUserCompositions } = require('../DBConnection/users.connection');

const usersRouter = express.Router()

usersRouter.get('/:username&:password',  async (req, res) => {
    try {
        const getUserResponse = await getUser(req.params.username, req.params.password)
        res.status(200).json(getUserResponse) 
    } catch (error) {        
        res.status(401).json({message : error})
    }
})

usersRouter.post('/', async (req, res) => {    
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const createUserResponse = await createUser(req.body.username, hashedPassword)
        res.status(201).json(createUserResponse) 
    } catch (error) {        
        res.status(error.status).json({ message: error.message })
    }
})

usersRouter.put('/', async (req, res) => {
    try {        
        const updateResponse = await updateUserCompositions(req.body.id, req.body.compositions);
        res.status(200).json(updateResponse)
    } catch (error) { 
        res.status(503).json({ message: error })         
    }
})

usersRouter.delete('/', async (req, res) => {
    try {
        const deleteResponse = await deleteUsers();
        res.status(200).json(deleteResponse)
    } catch (error) {
        res.status(503).json({ message: error })        
    }
})

module.exports = {usersRouter}
