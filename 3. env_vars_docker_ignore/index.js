const express = require("express")
const port = process.env.PORT || 3000
const app = express()

app.get("/", (req, res) => {
    
    res.send(`Hello from ${process.env.APP_NAME}`)
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});