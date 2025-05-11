const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ dishes: [] }, null, 2));
}

const readDishes = () => {
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data).dishes;
};

const writeDishes = (dishes) => {
  fs.writeFileSync(DB_PATH, JSON.stringify({ dishes }, null, 2));
};

app.post('/dishes', (req, res) => {
  try {
    const dishes = readDishes();
    const newDish = {
      id: dishes.length > 0 ? Math.max(...dishes.map(d => d.id)) + 1 : 1,
      ...req.body
    };
    dishes.push(newDish);
    writeDishes(dishes);
    res.status(201).json(newDish);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/dishes', (req, res) => {
  try {
    const dishes = readDishes();
    res.status(200).json(dishes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/dishes/:id', (req, res) => {
  try {
    const dishes = readDishes();
    const dish = dishes.find(d => d.id === parseInt(req.params.id));
    if (dish) {
      res.status(200).json(dish);
    } else {
      res.status(404).json({ message: "Dish not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put('/dishes/:id', (req, res) => {
  try {
    const dishes = readDishes();
    const index = dishes.findIndex(d => d.id === parseInt(req.params.id));
    if (index !== -1) {
      dishes[index] = { ...dishes[index], ...req.body };
      writeDishes(dishes);
      res.status(200).json(dishes[index]);
    } else {
      res.status(404).json({ message: "Dish not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete('/dishes/:id', (req, res) => {
  try {
    const dishes = readDishes();
    const filteredDishes = dishes.filter(d => d.id !== parseInt(req.params.id));
    if (filteredDishes.length < dishes.length) {
      writeDishes(filteredDishes);
      res.status(200).json({ message: "Dish deleted successfully" });
    } else {
      res.status(404).json({ message: "Dish not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/dishes/get', (req, res) => {
  try {
    const nameQuery = req.query.name?.toLowerCase();
    if (!nameQuery) {
      return res.status(400).json({ message: "Name query parameter is required" });
    }

    const dishes = readDishes();
    const matchedDishes = dishes.filter(d => 
      d.name.toLowerCase().includes(nameQuery)
    );

    if (matchedDishes.length > 0) {
      res.status(200).json(matchedDishes);
    } else {
      res.status(404).json({ message: "No dishes found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('POST /dishes - Add new dish');
  console.log('GET /dishes - Get all dishes');
  console.log('GET /dishes/:id - Get dish by ID');
  console.log('PUT /dishes/:id - Update dish by ID');
  console.log('DELETE /dishes/:id - Delete dish by ID');
  console.log('GET /dishes/get?name=<name> - Search dishes by name');
});