const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdf = require('pdf-parse');
// const path = require('path');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


// Enable CORS
app.use(cors({
    origin: true
}));

// Parse JSON payloads
app.use(express.json());

// parse form data
app.use(express.urlencoded({ extended: false }));

// Multer configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads'); // Uploads will be stored in the 'uploads' directory
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

const upload = multer();

// Route to handle file upload
app.post('/analyse', upload.any(), async (req, res) => {
    if (!req.files && !req.files[0]) {
        return res.status(400).send('No file uploaded.');
    }

    // console.log(req.files[0])
    const file = req.files[0];

    if(!file.mimetype || file.mimetype !== "application/pdf"){
        return res.status(400).send('PDF not uploaded.');
    }

    if(!file.buffer){
        return res.status(400).send('no file uploaded.');
    }
    // Here you can process the uploaded file, e.g., analyze the PDF
    const text = await pdf(file.buffer);
    // console.log("hehe", text)

    res.status(201).json({msg: "success", data: text});
});

app.get('/hit', (req, res) => {
    res.status(200).json({msg:"ok"})
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
