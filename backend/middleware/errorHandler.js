
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Postgres unique violation error
  if (err.code === '23505') {
    return res.status(400).json({ message: 'This email is already registered' });
  }

  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
  });
};
