import app from './index';

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to the Library Management API")
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
