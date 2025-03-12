require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // Add this line
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Execute SQL query
async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Define a route to handle login requests
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT EmployeeUsername FROM employee WHERE EmployeeUsername = ? AND EmployeePassword = ?';
  try {
    const results = await executeQuery(query, [username, password]);
    if (results.length > 0) {
      const user = results[0];
      res.status(200).json({ username: user.EmployeeUsername, fullName: user.EmployeeUsername });
    } else {
      res.status(401).send('Invalid username or password');
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to get all products with category names
app.get('/api/products', async (req, res) => {
  const query = `
    SELECT p.ProductID, p.ProductName, p.Price, c.CategoryName, c.CategoryID
    FROM products p
    JOIN category c ON p.CategoryID = c.CategoryID
  `;
  try {
    const results = await executeQuery(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to add a new product
app.post('/api/products', async (req, res) => {
  const { name, category, price } = req.body;
  const query = 'INSERT INTO products (ProductName, CategoryID, Price) VALUES (?, ?, ?)';
  try {
    await executeQuery(query, [name, category, price]);
    res.status(201).send('Product added successfully');
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to update a product
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const query = 'UPDATE products SET ProductName = ?, Price = ? WHERE ProductID = ?';
  try {
    await executeQuery(query, [name, price, id]);
    res.status(200).send('Product updated successfully');
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to delete a product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE ProductID = ?';
  try {
    await executeQuery(query, [id]);
    res.status(200).send('Product deleted successfully');
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to get all events with schedule and event type details
app.get('/api/events', async (req, res) => {
  const query = `
    SELECT e.EventID, e.EventTitle, s.ScheduleID, s.ScheduleStartDate, s.ScheduleEndDate, e.EventTypeID
    FROM event e
    JOIN schedule s ON e.EventID = s.EventID
    JOIN eventtype et ON e.EventTypeID = et.EventTypeID
  `;
  try {
    const results = await executeQuery(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to get all event types
app.get('/api/eventtypes', async (req, res) => {
  const query = 'SELECT * FROM eventtype';
  try {
    const results = await executeQuery(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching event types:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to add a new event
app.post('/api/events', async (req, res) => {
  const { EventTitle, ScheduleStartDate, ScheduleEndDate, EventTypeID } = req.body;
  const eventQuery = 'INSERT INTO event (EventTitle, EventTypeID) VALUES (?, ?)';
  try {
    const eventResults = await executeQuery(eventQuery, [EventTitle, EventTypeID]);
    const eventID = eventResults.insertId;
    const scheduleQuery = 'INSERT INTO schedule (EventID, ScheduleStartDate, ScheduleEndDate) VALUES (?, ?, ?)';
    await executeQuery(scheduleQuery, [eventID, ScheduleStartDate, ScheduleEndDate]);
    res.status(201).send('Event added successfully');
  } catch (err) {
    console.error('Error adding event:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to delete an event
app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  const deleteScheduleQuery = 'DELETE FROM schedule WHERE EventID = ?';
  const deleteEventQuery = 'DELETE FROM event WHERE EventID = ?';
  try {
    await executeQuery(deleteScheduleQuery, [id]);
    await executeQuery(deleteEventQuery, [id]);
    res.status(200).send('Event deleted successfully');
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to get stock-in items
app.get('/api/stockin', async (req, res) => {
  const query = `
    SELECT s.StockID, s.Quantity, CAST(s.Price AS DECIMAL(10,2)) AS Price, 
           s.ExpiryDate, p.ProductName
    FROM stockin s
    JOIN products p ON s.ProductID = p.ProductID
  `;
  try {
    const results = await executeQuery(query);
    const formattedResults = results.map(item => ({
      StockID: item.StockID,
      Quantity: item.Quantity,
      Price: parseFloat(item.Price) || 0,
      ExpiryDate: item.ExpiryDate,
      ProductName: item.ProductName
    }));
    res.status(200).json(formattedResults);
  } catch (err) {
    console.error('Error fetching stock-in items:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.get('/api/eventdetails', async(req, res) => {

  const query = `
    SELECT e.EventID, e.EventTitle, et.EventCategory, 
           s.ScheduleID, s.ScheduleStartDate, s.ScheduleEndDate
    FROM event e
    JOIN schedule s ON e.EventID = s.EventID
    JOIN eventtype et ON e.EventTypeID = et.EventTypeID
  `;
  try {
    const results = await executeQuery(query);
    const formattedResults = results.map(item => ({
      EventID: item.EventID,
      EventTitle: item.EventTitle,
      EventCategory: item.EventCategory,
      ScheduleID: item.ScheduleID,
      ScheduleStartDate: item.ScheduleStartDate,
      ScheduleEndDate: item.ScheduleEndDate
    }));
    res.status(200).json(formattedResults);
  } catch (err) {
    console.error('Error fetching event details:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});


// Define a route to get stock-out items with employee details
app.get('/api/stockout', async (req, res) => {
  const query = `
    SELECT so.StockOutID, so.Date, e.EmployeeUsername, sod.Quantity, sod.Remarks, sod.SubTotal, p.ProductName
    FROM stockout so
    JOIN stockoutdetails sod ON so.StockOutID = sod.StockOutID
    JOIN employee e ON so.EmployeeID = e.EmployeeID
    JOIN stockin si ON sod.StockID = si.StockID
    JOIN products p ON si.ProductID = p.ProductID
  `;
  try {
    const results = await executeQuery(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching stock-out items:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Define a route to create a transaction and order details
app.post('/api/transactions', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { EmployeeID, ScheduleID, TotalCost, DiscountedPrice, TransactionDate, CashPayment, items } = req.body;
    
    // Log the received data
    console.log('Received transaction data:', req.body);
    
    if (!EmployeeID || !ScheduleID || !TotalCost || DiscountedPrice === undefined || !TransactionDate || !CashPayment || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await connection.beginTransaction();

    // Insert transaction
    const transactionQuery = `
      INSERT INTO transactions (EmployeeID, ScheduleID, TotalCost, DiscountedPrice, TransactionDate, CashPayment)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [transactionResult] = await connection.execute(transactionQuery, [EmployeeID, ScheduleID, TotalCost, DiscountedPrice, TransactionDate, CashPayment]);
    const transactionID = transactionResult.insertId;

    // Insert order details
    const orderDetailQuery = `
      INSERT INTO orderdetails (TransactionID, StockID, Subtotal, Quantity)
      VALUES (?, ?, ?, ?)
    `;
    for (const item of items) {
      const { ProductID, quantity, Price } = item;

      // Fetch the StockID for the product
      const [stockResult] = await connection.execute('SELECT StockID FROM stockin WHERE ProductID = ? LIMIT 1', [ProductID]);
      if (stockResult.length === 0) {
        throw new Error(`Stock not found for ProductID ${ProductID}`);
      }
      const stockID = stockResult[0].StockID;

      const orderDetailData = [transactionID, stockID, quantity * Price, quantity];
      await connection.execute(orderDetailQuery, orderDetailData);

      // Update stock quantity
      const updateStockQuery = `UPDATE stockin SET Quantity = Quantity - ? WHERE StockID = ?`;
      await connection.execute(updateStockQuery, [quantity, stockID]);
    }

    await connection.commit();
    res.status(201).json({ message: 'Transaction created successfully', TransactionID: transactionID });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Error creating transaction' });
  } finally {
    connection.release();
  }
});

// Define a route to create order details
app.post('/api/orderdetails', async (req, res) => {
  try {
    const { TransactionID, StockID, Subtotal, DiscountedPrice, Quantity } = req.body;
    
    // Log the received data
    console.log('Received order detail data:', req.body);
    
    if (!TransactionID || !StockID || !Subtotal || DiscountedPrice === undefined || !Quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO orderdetails (TransactionID, StockID, Subtotal, DiscountedPrice, Quantity)
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await executeQuery(query, [TransactionID, StockID, Subtotal, DiscountedPrice, Quantity]);

    // Update stock quantity
    const updateStockQuery = `UPDATE stockin SET Quantity = Quantity - ? WHERE StockID = ?`;
    await executeQuery(updateStockQuery, [Quantity, StockID]);

    res.status(201).json({ message: 'Order details created successfully', OrderDetailsID: result.insertId });
  } catch (error) {
    console.error('Error creating order details:', error);
    res.status(500).json({ error: 'Error creating order details' });
  }
});

// Define a route to record payment method
app.post('/api/paymentmethod', async (req, res) => {
  try {
    const { TransactionID, PaymentMethodID, ReferenceNumber } = req.body;
    if (!TransactionID || !PaymentMethodID || !ReferenceNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO paymentmethod (TransactionID, PaymentMethodID, ReferenceNumber)
      VALUES (?, ?, ?)
    `;
    const result = await executeQuery(query, [TransactionID, PaymentMethodID, ReferenceNumber]);

    res.status(201).json({ message: 'Payment method recorded successfully', PaymentID: result.insertId });
  } catch (error) {
    console.error('Error recording payment method:', error);
    res.status(500).json({ error: 'Error recording payment method' });
  }
});

// Define a route to update a stock-in item
app.put('/api/stockin/:id', async (req, res) => {
  const { id } = req.params;
  const { Quantity, ExpiryDate } = req.body;
  const query = 'UPDATE stockin SET Quantity = ?, ExpiryDate = ? WHERE StockID = ?';
  try {
    await executeQuery(query, [Quantity, ExpiryDate, id]);
    res.status(200).send('Stock-in item updated successfully');
  } catch (err) {
    console.error('Error updating stock-in item:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to delete a stock-in item
app.delete('/api/stockin/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM stockin WHERE StockID = ?';
  try {
    await executeQuery(query, [id]);
    res.status(200).send('Stock-in item deleted successfully');
  } catch (err) {
    console.error('Error deleting stock-in item:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to add a stock-in item
app.post('/api/stockin', async (req, res) => {
  const { ProductID, Quantity, ExpiryDate } = req.body;
  const query = 'INSERT INTO stockin (ProductID, Quantity, ExpiryDate) VALUES (?, ?, ?)';
  try {
    await executeQuery(query, [ProductID, Quantity, ExpiryDate]);
    res.status(201).send('Stock-in item added successfully');
  } catch (err) {
    console.error('Error adding stock-in item:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to add a stock-out item
app.post('/api/stockout', async (req, res) => {
  const { Date, EmployeeID, stockoutDetails } = req.body;
  const stockoutQuery = 'INSERT INTO stockout (Date, EmployeeID) VALUES (?, ?)';
  try {
    const stockoutResult = await executeQuery(stockoutQuery, [Date, EmployeeID]);
    const StockOutID = stockoutResult.insertId;

    for (const detail of stockoutDetails) {
      const { StockID, Quantity, Remarks } = detail;
      const stockoutDetailsQuery = 'INSERT INTO stockoutdetails (StockOutID, StockID, Quantity, Remarks) VALUES (?, ?, ?, ?)';
      await executeQuery(stockoutDetailsQuery, [StockOutID, StockID, Quantity, Remarks]);
    }

    res.status(201).send('Stock-out item added successfully');
  } catch (err) {
    console.error('Error adding stock-out item:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to delete a stock-out item
app.delete('/api/stockout/:id', async (req, res) => {
  const { id } = req.params;
  const deleteStockoutDetailsQuery = 'DELETE FROM stockoutdetails WHERE StockOutID = ?';
  const deleteStockoutQuery = 'DELETE FROM stockout WHERE StockOutID = ?';
  try {
    await executeQuery(deleteStockoutDetailsQuery, [id]);
    await executeQuery(deleteStockoutQuery, [id]);
    res.status(200).send('Stock-out item deleted successfully');
  } catch (err) {
    console.error('Error deleting stock-out item:', err);
    res.status(500).send('Server error');
  }
});

// KANI AKONG GI DAGDAG MEL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Get transaction by ID
app.get('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT t.TransactionID, t.CustomerID, t.EmployeeID, 
           t.ScheduleID, t.TotalCost, t.TransactionDate, 
           t.CashPayment, e.EmployeeUsername
    FROM transactions t
    JOIN employee e ON t.EmployeeID = e.EmployeeID
    WHERE t.TransactionID = ?
  `;
  try {
    const results = await executeQuery(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error fetching transaction:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get order details for a transaction
app.get('/api/transactions/:id/orderdetails', async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT od.OrderDetailsID, od.TransactionID, od.StockID, 
           od.Subtotal, od.DiscountedPrice, od.Quantity,
           p.ProductName, si.Price
    FROM orderdetails od
    JOIN stockin si ON od.StockID = si.StockID
    JOIN products p ON si.ProductID = p.ProductID
    WHERE od.TransactionID = ?
  `;
  try {
    const results = await executeQuery(query, [id]);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching order details:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Create a new checkout transaction
app.post('/api/checkout', async (req, res) => {
  const { 
    employeeID, 
    items, // Array of {stockID, quantity, price, subtotal}
    totalAmount,
    discount = 0,
    paymentMethod = 'Cash',
    cashReceived
  } = req.body;

  // Validate required fields
  if (!employeeID || !items || !totalAmount || !cashReceived) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Start a transaction to ensure data integrity
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Create transaction record
      const transactionDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const createTransactionQuery = `
        INSERT INTO transaction (EmployeeID, TotalCost, TransactionDate, CashPayment)
        VALUES (?, ?, ?, ?)
      `;
      const transactionResult = await connection.execute(
        createTransactionQuery, 
        [employeeID, totalAmount, transactionDate, cashReceived]
      );
      
      const transactionID = transactionResult[0].insertId;
      
      // 2. Create order details for each item
      for (const item of items) {
        const { stockID, quantity, price, subtotal } = item;
        const discountedPrice = price - (price * (discount / 100));
        
        // Create order detail record
        const createOrderDetailQuery = `
          INSERT INTO orderdetails (TransactionID, StockID, Subtotal, DiscountedPrice, Quantity)
          VALUES (?, ?, ?, ?, ?)
        `;
        await connection.execute(
          createOrderDetailQuery, 
          [transactionID, stockID, subtotal, discountedPrice, quantity]
        );
        
        // Update inventory quantity
        const updateStockQuery = `
          UPDATE stockin 
          SET Quantity = Quantity - ? 
          WHERE StockID = ? AND Quantity >= ?
        `;
        const updateResult = await connection.execute(
          updateStockQuery, 
          [quantity, stockID, quantity]
        );
        
        // Check if update was successful (affected rows should be 1)
        if (updateResult[0].affectedRows !== 1) {
          // Item might be out of stock
          throw new Error(`Insufficient quantity for stock ID ${stockID}`);
        }
      }
      
      // 3. Record payment method if not cash
      if (paymentMethod !== 'Cash') {
        const paymentMethodID = paymentMethod === 'Card' ? 1 : 2; // Assuming: 1=Card, 2=Other
        const referenceNumber = `REF-${Date.now()}`;
        
        const recordPaymentQuery = `
          INSERT INTO paymentmethod (TransactionID, PaymentMethodID, ReferenceNumber)
          VALUES (?, ?, ?)
        `;
        await connection.execute(
          recordPaymentQuery, 
          [transactionID, paymentMethodID, referenceNumber]
        );
      }
      
      // Commit the transaction
      await connection.commit();
      
      // Calculate change
      const change = cashReceived - totalAmount;
      
      res.status(201).json({ 
        success: true, 
        message: 'Checkout completed successfully',
        transactionID,
        totalAmount,
        cashReceived,
        change,
        date: transactionDate
      });
      
    } catch (error) {
      // If there's an error, roll back the transaction
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error processing checkout', 
      details: error.message 
    });
  }
});

// Cancel a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Start a transaction to ensure data integrity
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // 1. Get all order details to restore inventory
      const getOrderDetailsQuery = `
        SELECT StockID, Quantity FROM orderdetails WHERE TransactionID = ?
      `;
      const [orderDetails] = await connection.execute(getOrderDetailsQuery, [id]);
      
      // 2. Restore inventory quantities
      for (const item of orderDetails) {
        const restoreStockQuery = `
          UPDATE stockin SET Quantity = Quantity + ? WHERE StockID = ?
        `;
        await connection.execute(restoreStockQuery, [item.Quantity, item.StockID]);
      }
      
      // 3. Delete payment method records if any
      const deletePaymentQuery = `DELETE FROM paymentmethod WHERE TransactionID = ?`;
      await connection.execute(deletePaymentQuery, [id]);
      
      // 4. Delete order details
      const deleteOrderDetailsQuery = `DELETE FROM orderdetails WHERE TransactionID = ?`;
      await connection.execute(deleteOrderDetailsQuery, [id]);
      
      // 5. Delete transaction record
      const deleteTransactionQuery = `DELETE FROM transaction WHERE TransactionID = ?`;
      await connection.execute(deleteTransactionQuery, [id]);
      
      // Commit the transaction
      await connection.commit();
      
      res.status(200).json({ 
        success: true, 
        message: 'Transaction cancelled successfully' 
      });
      
    } catch (error) {
      // If there's an error, roll back the transaction
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error cancelling transaction:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error cancelling transaction', 
      details: error.message 
    });
  }
});

// Get current transaction ID (for display purposes)
app.get('/api/transactions/next', async (req, res) => {
  const query = `
    SELECT AUTO_INCREMENT 
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = "db_lylas" 
    AND TABLE_NAME = "transactions"
  `;
  try {
    const results = await executeQuery(query);
    if (results.length === 0) {
      return res.status(404).json({ error: 'No transaction ID found' });
    }
    res.status(200).json({ transactionID: results[0].AUTO_INCREMENT });
  } catch (err) {
    console.error('Error fetching next transaction ID:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get employee information
app.get('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT EmployeeID, EmployeeUsername, EmployeeFullName
    FROM employee
    WHERE EmployeeID = ?
  `;
  try {
    const results = await executeQuery(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get available stock for checkout
app.get('/api/available-stock', async (req, res) => {
  const query = `
    SELECT s.StockID, p.ProductName, p.ProductID, s.Quantity, 
           CAST(s.Price AS DECIMAL(10,2)) AS Price, s.ExpiryDate,
           c.CategoryName
    FROM stockin s
    JOIN products p ON s.ProductID = p.ProductID
    JOIN category c ON p.CategoryID = c.CategoryID
    WHERE s.Quantity > 0 AND s.ExpiryDate > NOW()
    ORDER BY p.ProductName ASC
  `;
  try {
    const results = await executeQuery(query);
    const formattedResults = results.map(item => ({
      stockID: item.StockID,
      productID: item.ProductID,
      productName: item.ProductName,
      quantity: item.Quantity,
      price: parseFloat(item.Price),
      expiryDate: item.ExpiryDate,
      category: item.CategoryName
    }));
    res.status(200).json(formattedResults);
  } catch (err) {
    console.error('Error fetching available stock:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Generate receipt
app.get('/api/transactions/:id/receipt', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get transaction details
    const transactionQuery = `
      SELECT t.TransactionID, t.CustomerID, t.EmployeeID, 
             t.TotalCost, t.TransactionDate, t.CashPayment,
             e.EmployeeUsername
      FROM transactions t
      JOIN employee e ON t.EmployeeID = e.EmployeeID
      WHERE t.TransactionID = ?
    `;
    const transactionResults = await executeQuery(transactionQuery, [id]);
    
    if (transactionResults.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const transaction = transactionResults[0];
    
    const orderDetailsQuery = `
      SELECT od.OrderDetailsID, od.Quantity, od.Subtotal, od.DiscountedPrice,
             p.ProductName, CAST(si.Price AS DECIMAL(10,2)) AS Price
      FROM orderdetails od
      JOIN stockin si ON od.StockID = si.StockID
      JOIN products p ON si.ProductID = p.ProductID
      JOIN products p ON si.ProductID = p.ProductID
      WHERE od.TransactionID = ?
    `;
    const orderDetails = await executeQuery(orderDetailsQuery, [id]);
    
    // Calculate change
    const change = transaction.CashPayment - transaction.TotalCost;
    
    // Format date
    const date = new Date(transaction.TransactionDate);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    
    // Build receipt data
    const receipt = {
      transactionID: transaction.TransactionID,
      date: formattedDate,
      time: formattedTime,
      employeeID: transaction.EmployeeID,
      employeeName: transaction.EmployeeUsername,
      items: orderDetails.map(item => ({
        productName: item.ProductName,
        price: parseFloat(item.Price),
        quantity: item.Quantity,
        subtotal: parseFloat(item.Subtotal)
      })),
      totalAmount: parseFloat(transaction.TotalCost),
      cashReceived: parseFloat(transaction.CashPayment),
      change: change,
      paymentMethod: 'Cash' // You can extend this to fetch from paymentmethod table
    };
    
    res.status(200).json(receipt);
    
  } catch (err) {
    console.error('Error generating receipt:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Define a route to get all employees
app.get('/api/employees', async (req, res) => {
  const { username } = req.query;
  const query = 'SELECT EmployeeID, EmployeeUsername FROM employee WHERE EmployeeUsername = ?';
  try {
    const results = await executeQuery(query, [username]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Define a route to get available stock-in items
app.get('/api/available-stockin', async (req, res) => {
  const query = `
    SELECT s.StockID, p.ProductName, s.Quantity
    FROM stockin s
    JOIN products p ON s.ProductID = p.ProductID
    WHERE s.Quantity > 0
  `;
  try {
    const results = await executeQuery(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching available stock-in items:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to get all products for dropdown
app.get('/api/products-dropdown', async (req, res) => {
  const query = 'SELECT ProductID, ProductName FROM products';
  try {
    const results = await executeQuery(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching products for dropdown:', err);
    res.status(500).send('Server error');
  }
});

// Define a route to get the top value of the schedule table
app.get('/api/schedule/top', async (req, res) => {
  const query = 'SELECT ScheduleID FROM schedule ORDER BY ScheduleID DESC LIMIT 1';
  try {
    const results = await executeQuery(query);
    if (results.length === 0) {
      return res.status(404).json({ error: 'No schedule found' });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error fetching top schedule:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Define a route to get stock-in item by product ID
app.get('/api/stockin', async (req, res) => {
  const { productID } = req.query;
  const query = 'SELECT StockID FROM stockin WHERE ProductID = ? LIMIT 1';
  try {
    const results = await executeQuery(query, [productID]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error fetching stock:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Fetch transaction data for sales tracking
app.get('/api/transactions', async (req, res) => {
  const query = `
    SELECT 
      TransactionID, 
      EmployeeID, 
      ScheduleID, 
      TransactionDate, 
      TotalCost 
    FROM transactions
  `;
  try {
    const results = await executeQuery(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// diri ko nag edit mell
app.get('/api/monthly-sales', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  
  
  const query = `
    SELECT 
      MONTH(TransactionDate) AS month,
      DATE_FORMAT(TransactionDate, '%b') AS monthName,
      SUM(TotalCost) AS totalSales
    FROM transactions
    WHERE YEAR(TransactionDate) = ?
    GROUP BY MONTH(TransactionDate), monthName
    ORDER BY MONTH(TransactionDate)
  `;
  
  try {
    const results = await executeQuery(query, [year]);
    
    // Create a complete dataset with all months (even those with no sales)
    const monthlyData = Array(12).fill().map((_, i) => ({
      month: i + 1,
      monthName: new Date(2000, i, 1).toLocaleString('default', { month: 'short' }),
      totalSales: 0
    }));
    
    // Fill in the actual data we have
    results.forEach(row => {
      const monthIndex = row.month - 1;
      monthlyData[monthIndex].totalSales = parseFloat(row.totalSales) || 0;
    });
    
     res.status(200).json(monthlyData);
  } catch (err) {
    console.error('Error fetching monthly sales data:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});


// Define a route to get today's sale
app.get('/api/sales/today', async (req, res) => {
  const query = `
    SELECT SUM(TotalCost) AS totalSales
    FROM transactions
    WHERE DATE(TransactionDate) = CURDATE()
  `;
  
  try {
    const results = await executeQuery(query);
    const totalSales = results[0].totalSales || 0;
    res.status(200).json({ totalSales });
  } catch (err) {
    console.error('Error fetching today\'s sale:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Define a route to get yearly total sale
app.get('/api/sales/yearly', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  
  const query = `
    SELECT SUM(TotalCost) AS totalSales
    FROM transactions
    WHERE YEAR(TransactionDate) = ?
  `;
  
  try {
    const results = await executeQuery(query, [year]);
    const totalSales = results[0].totalSales || 0;
    res.status(200).json({ totalSales });
  } catch (err) {
    console.error('Error fetching yearly total sale:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Define a route to get net income
app.get('/api/income/net', async (req, res) => {
  const year = req.query.year || new Date().getFullYear();
  
  const query = `
    SELECT SUM(TotalCost) AS netIncome
    FROM transactions
    WHERE YEAR(TransactionDate) = ?
  `;
  
  try {
    const results = await executeQuery(query, [year]);
    const netIncome = results[0].netIncome || 0;
    res.status(200).json({ netIncome });
  } catch (err) {
    console.error('Error fetching net income:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Define a route to get the number of products
app.get('/api/products/count', async (req, res) => {
  const query = `
    SELECT COUNT(*) AS productCount
    FROM products
  `;
  
  try {
    const results = await executeQuery(query);
    const productCount = results[0].productCount || 0;
    res.status(200).json({ productCount });
  } catch (err) {
    console.error('Error fetching product count:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});


app.get('/api/products/best-selling', async (req, res) => {
  const { range } = req.query;
  let interval;

  switch (range) {
    case '7days':
      interval = '7 DAY';
      break;
    case '1month':
      interval = '1 MONTH';
      break;
    case '1year':
      interval = '1 YEAR';
      break;
    default:
      return res.status(400).json({ error: 'Invalid range' });
  }

  const query = `
    SELECT 
      p.ProductName,
      SUM(od.Quantity) AS totalSales
    FROM orderdetails od
    JOIN stockin si ON od.StockID = si.StockID
    JOIN products p ON si.ProductID = p.ProductID
    JOIN transactions t ON od.TransactionID = t.TransactionID
    WHERE t.TransactionDate >= DATE_SUB(CURDATE(), INTERVAL ${interval})
    GROUP BY p.ProductName
    ORDER BY totalSales DESC
    LIMIT 10
  `;

  try {
    const results = await executeQuery(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching best-selling products:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});