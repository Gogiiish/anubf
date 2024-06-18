import express from 'express';
import { connect, Schema, model } from 'mongoose';
import bodyParser from 'body-parser';

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
connect('mongodb+srv://gauravghule455:iPyd6uFwNHj1VvWC@cluster0.1czgwif.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Define a simple schema and model
const ItemSchema = new Schema({
  name: String,
  quantity: Number
});

const Item = model('Item', ItemSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Create
app.post('/items', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).send(item);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Read
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update
app.put('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).send();
    }
    res.status(200).send(item);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete
app.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).send();
    }
    res.status(200).send(item);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
