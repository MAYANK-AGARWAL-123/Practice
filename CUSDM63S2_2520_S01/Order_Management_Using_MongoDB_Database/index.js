const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb://127.0.0.1:27017/orderManagement";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("orderManagement");
    const orders = database.collection("orders");

    // 1. Insert sample data
    const sampleData = [
      {
        "order_id": 1,
        "customer_name": "John Doe",
        "items": ["Laptop", "Mouse"],
        "total_amount": 65000,
        "order_status": "pending"
      },
      {
        "order_id": 2,
        "customer_name": "Jane Smith",
        "items": ["Headphones", "Charger"],
        "total_amount": 3000,
        "order_status": "shipped"
      },
      {
        "order_id": 3,
        "customer_name": "Alice Johnson",
        "items": ["Mobile Phone"],
        "total_amount": 20000,
        "order_status": "delivered"
      },
      {
        "order_id": 4,
        "customer_name": "Bob Brown",
        "items": ["Tablet", "Keyboard"],
        "total_amount": 15000,
        "order_status": "pending"
      },
      {
        "order_id": 5,
        "customer_name": "Chris Green",
        "items": ["Smartwatch"],
        "total_amount": 7000,
        "order_status": "shipped"
      }
    ];

    await orders.insertMany(sampleData);
    console.log("Sample data inserted successfully");

    // 2. Retrieve all orders with order_status "shipped"
    const shippedOrders = await orders.find({ order_status: "shipped" }).toArray();
    console.log("\nShipped Orders:");
    console.log(shippedOrders);

    // 3. Update total_amount of order_id: 1 to 70000
    const updateAmountResult = await orders.updateOne(
      { order_id: 1 },
      { $set: { total_amount: 70000 } }
    );
    console.log(`\nUpdated ${updateAmountResult.modifiedCount} document(s)`);

    // 4. Delete order with order_id: 4
    const deleteResult = await orders.deleteOne({ order_id: 4 });
    console.log(`\nDeleted ${deleteResult.deletedCount} document(s)`);

    // 5. Retrieve order with customer_name: "Alice Johnson"
    const aliceOrder = await orders.findOne({ customer_name: "Alice Johnson" });
    console.log("\nAlice Johnson's Order:");
    console.log(aliceOrder);

    // 6. Update order_status of order_id: 2 to "delivered"
    const updateStatusResult = await orders.updateOne(
      { order_id: 2 },
      { $set: { order_status: "delivered" } }
    );
    console.log(`\nUpdated ${updateStatusResult.modifiedCount} document(s)`);

    // 7. Retrieve all orders with total_amount >= 15000
    const highValueOrders = await orders.find({ total_amount: { $gte: 15000 } }).toArray();
    console.log("\nHigh Value Orders (>= 15000):");
    console.log(highValueOrders);

  } finally {
    await client.close();
  }
}

main().catch(console.error);