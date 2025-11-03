import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  text: String,
  number: Number
});

const Todo = mongoose.model("Todo", TodoSchema);
export default Todo;
