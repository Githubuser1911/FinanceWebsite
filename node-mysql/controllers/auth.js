exports.register = (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;
  
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
      }
      if (results.length > 0) {
        return res.status(400).json({ message: 'That email is already in use' });
      } else if (password !== passwordConfirm) {
        return res.status(400).json({ message: 'The passwords do not match' });
      }
  
      let hashedPassword = await bcrypt.hash(password, 8);
      db.query('INSERT INTO users SET ?', { name, email, password: hashedPassword }, (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: "Error inserting user" });
        } else {
          return res.status(200).json({ message: 'User registered successfully' });
        }
      });
    });
  };
  

// auth.js
const db = require('./db'); // Adjust the path if needed

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  
  // Now you can use `db` here to query the database
  db.query('INSERT INTO users SET ?', { name, email, password }, (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(201).send('User registered successfully');
  });
};
