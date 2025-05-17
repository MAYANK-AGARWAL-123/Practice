const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://127.0.0.1:27017/recipeDB";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    
    const database = client.db();
    const recipes = database.collection("recipes");

    const count = await recipes.countDocuments();
    if (count === 0) {
      const sampleData = [
        {
          "recipe_id": 1,
          "name": "Spaghetti Carbonara",
          "ingredients": ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Black Pepper"],
          "cuisine": "Italian",
          "prep_time": 20,
          "difficulty": "easy",
          "price": 500
        },
      ];
      await recipes.insertMany(sampleData);
      console.log("Inserted sample data");
    }

    console.log("\nItalian Recipes:");
    console.log(await recipes.find({ cuisine: "Italian" }).toArray());

    console.log("\nQuick Recipes (<30 min):");
    console.log(await recipes.find({ prep_time: { $lt: 30 } }).toArray());

    console.log("\nExpensive Recipes (>500):");
    console.log(await recipes.find({ price: { $gt: 500 } }).toArray());

    console.log("\nRecipes by Price (Asc):");
    console.log(await recipes.find().sort({ price: 1 }).toArray());

    await recipes.updateOne(
      { recipe_id: 2 },
      { $set: { price: 900 } }
    );
    console.log("\nUpdated Chicken Biryani price to 900");

    console.log("\nRecipe Names and Prices:");
    console.log(await recipes.find({}, { projection: { name: 1, price: 1, _id: 0 } }).toArray());

    console.log("\nAffordable Medium Difficulty Recipes:");
    console.log(await recipes.find({ difficulty: "medium", price: { $lt: 600 } }).toArray());

    console.log("\nRecipes by Prep Time (Desc):");
    console.log(await recipes.find().sort({ prep_time: -1 }).toArray());

    await recipes.insertOne({
      recipe_id: 11,
      name: "Chocolate Cake",
      ingredients: ["Flour", "Sugar", "Cocoa Powder", "Eggs", "Butter"],
      cuisine: "American",
      prep_time: 50,
      difficulty: "medium",
      price: 750
    });
    console.log("\nInserted Chocolate Cake recipe");

    await recipes.deleteOne({ recipe_id: 4 });
    console.log("\nDeleted Caesar Salad recipe");

    console.log("\nJapanese or Thai Recipes:");
    console.log(await recipes.find({ cuisine: { $in: ["Japanese", "Thai"] } }).toArray());

    console.log("\nRecipes with Egg:");
    console.log(await recipes.find({ ingredients: "Egg" }).toArray());

    await recipes.updateOne(
      { recipe_id: 7 },
      { $set: { prep_time: 35 } }
    );
    console.log("\nUpdated Pad Thai prep time to 35 minutes");

    await recipes.deleteMany({ price: { $gt: 1000 } });
    console.log("\nDeleted expensive recipes (>1000)");

    console.log("\nFirst 3 Recipes:");
    console.log(await recipes.find().limit(3).toArray());

    console.log("\nRecipes (skip first 2):");
    console.log(await recipes.find().skip(2).toArray());

    console.log("\nThai Recipes by Price (Desc):");
    console.log(await recipes.find({ cuisine: "Thai" }).sort({ price: -1 }).toArray());

    await recipes.insertOne({
      recipe_id: 12,
      name: "Hummus",
      ingredients: ["Chickpeas", "Tahini", "Garlic", "Olive Oil", "Lemon Juice"],
      cuisine: "Middle Eastern",
      prep_time: 15,
      difficulty: "easy",
      price: 300
    });
    console.log("\nInserted Hummus recipe");

    const easyCount = await recipes.countDocuments({ difficulty: "easy" });
    console.log(`\nNumber of easy recipes: ${easyCount}`);

    console.log("\nLong Prep Recipes (>40 min):");
    console.log(await recipes.find({ prep_time: { $gt: 40 } }).toArray());

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

main().catch(console.error);