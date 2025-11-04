import express from "express";
import Todo from "./Config/model.js";
import mongoose from "./Config/config.js";
import cors from 'cors'


const app = express();
app.use(cors())
app.use(express.json());

app.post('/add', async (req, res) => {
  try {
    const todo = new Todo(req.body)
   const save = await todo.save()
  res.status(200).json(save)
  } catch (error) {
    console.log(error);
  }
})

app.get("/", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    console.log(error);
  }
});

app.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const update = await Todo.findByIdAndUpdate(id, req.body, {new: true})
    res.status(200).json(update)
  } catch (error) {
    console.log(error); 
  }
})

app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Todo.findByIdAndDelete(id)
    res.status(200).json(deleted)
  } catch (error) {
    console.log(error);
  }
})

mongoose.connection.on('open', () => {
  console.log('✅ Database connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Database connection error:', err);
});

app.listen(3000, () => {
  console.log("✅ Server running on port 3000");
});
