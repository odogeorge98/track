const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();

// Use CORS middleware
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create connection to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // use your MySQL username
  password: 'rocketpower', // use your MySQL password
  database: 'parcel_tracking'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
  console.log('MySQL Connected...');
});

// Route to add a new user
app.post('/add-user', (req, res) => {
  const { full_name, address, phone_number, email } = req.body;
  console.log('Received request to add user:', { full_name, address, phone_number, email });

  const sql = 'INSERT INTO users (full_name, address, phone_number, email) VALUES (?, ?, ?, ?)';
  db.query(sql, [full_name, address, phone_number, email], (err, result) => {
    if (err) {
      console.error('Error adding user:', err);
      return res.status(500).json({ success: false, message: 'Failed to add user' });
    }
    console.log('User added successfully:', result);
    res.json({ 
      success: true, 
      message: 'User added successfully!',
      userId: result.insertId // Include the user ID in the response
    });
  });
});

// Route to add tracking info
app.post('/add-tracking', (req, res) => {
  const {
    user_id,
    tracking_code,
    parcel_info,
    contents = 'No content specified.',
    status = 'undefined',
    estimated_delivery = 'undefined',
    last_location = 'undefined',
    notes = 'No additional notes available.',
    amount_to_be_paid = 0.00,
    payment_agent = 'N/A',
    payment_reason = 'Service fee'
  } = req.body;

  console.log('Received request to add tracking info:', {
    user_id,
    tracking_code,
    parcel_info,
    contents,
    status,
    estimated_delivery,
    last_location,
    notes,
    amount_to_be_paid,
    payment_agent,
    payment_reason
  });

  const sql = `
    INSERT INTO tracking_codes (user_id, tracking_code, parcel_info, contents, status, estimated_delivery, last_location, notes, amount_to_be_paid, payment_agent, payment_reason) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    user_id,
    tracking_code,
    parcel_info,
    contents,
    status,
    estimated_delivery,
    last_location,
    notes,
    amount_to_be_paid,
    payment_agent,
    payment_reason
  ], (err, result) => {
    if (err) {
      console.error('Error adding tracking code:', err);
      return res.status(500).json({ success: false, message: 'Failed to add tracking code' });
    }
    console.log('Tracking code added successfully:', result);
    res.json({ success: true, message: 'Tracking code added successfully!' });
  });
});

// Route to track a parcel 
app.post('/track-parcel', (req, res) => {
  const { tracking_code } = req.body;
  console.log('Received request to track parcel with tracking code:', tracking_code);

  // Check if tracking_code is provided
  if (!tracking_code) {
    return res.status(400).json({ success: false, message: 'Tracking code is required.' });
  }

  const sql = `
    SELECT u.full_name, u.address, t.parcel_info, t.contents, t.status, t.estimated_delivery, t.last_location, t.notes, t.amount_to_be_paid, t.payment_agent, t.payment_reason
    FROM tracking_codes t
    JOIN users u ON t.user_id = u.id
    WHERE t.tracking_code = ?
  `;
  db.query(sql, [tracking_code], (err, result) => {
    if (err) {
      console.error('Database error while tracking parcel:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    } else if (result.length > 0) {
      const {
        full_name,
        address,
        parcel_info,
        contents,
        status,
        estimated_delivery,
        last_location,
        notes,
        amount_to_be_paid,
        payment_agent,
        payment_reason
      } = result[0];
      console.log('Parcel tracking found:', {
        full_name,
        address,
        parcel_info,
        contents,
        status,
        estimated_delivery,
        last_location,
        notes,
        amount_to_be_paid,
        payment_agent,
        payment_reason
      });
      res.json({
        success: true,
        customer: full_name,
        address: address,
        parcel_info: parcel_info,
        contents: contents,
        status: status,
        estimated_delivery: estimated_delivery,
        last_location: last_location,
        notes: notes,
        amount_to_be_paid: amount_to_be_paid,
        payment_agent: payment_agent,
        payment_reason: payment_reason
      });
    } else {
      console.log('Tracking code not found:', tracking_code);
      res.status(404).json({ success: false, message: 'Tracking code not found' });
    }
  });
});


// Endpoint to get all users
app.get('/get-users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying users:', err);
            return res.status(500).json({ success: false, message: 'Database query error.' });
        }
        return res.json({ success: true, users: results });
    });
});

// Start the server
app.listen(8080, () => {
  console.log('Server running on port 8080');
});
