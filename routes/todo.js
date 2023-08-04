const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')

//FETCH TODOS
router.get('/getTodos/:_id', async (req, res) => {
    const { _id } = req.params
    try {
        const todolist = await Todo.find({ user: _id })
        if (todolist) {
            res.status(200).json({ "success": true, todolist })
        }
    } catch {
        res.status(500).json({ success: false, message: "Internal server error" })
    }

})

//ADD A NEW TODO
router.post('/addTodo', async (req, res) => {
    // console.log(req.body)
    const { user,name, desc, status } = req.body
    try {
        const newTodo = await Todo.create({
            user,
            name,
            desc,
            status
        })
        res.status(200).json({ "success": true, newTodo })

    } catch {
        res.status(500).json({ success: false, message: "Internal server error" })
    }

})

//UPDATE STATUS OF A TODO
router.patch('/updateTodo', async (req, res) => {
    const { status, _id } = req.body
    try {
        const oldTodo = await Todo.findByIdAndUpdate(_id, { status }, { new: true })
    
        res.status(200).json({ "success": true, oldTodo })
    } catch {
        
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

//DELETE A TODO
router.delete('/deleteTodo', async (req, res) => {
    
    const { _id } = req.body
    try {        
        const todo = await Todo.findByIdAndDelete({ _id })
        res.status(200).json({ "success": true, "message": "succesfully deleted" })
    } catch {
        res.status(500).json({ success: false, message: "Internal server error" })
        
    }
})
module.exports = router