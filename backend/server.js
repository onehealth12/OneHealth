const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const articleRoutes = require('./routes/articleRoutes')
const adminRoutes = require('./routes/adminRoutes')
const doctorRoutes = require('./routes/doctorRoutes')
const patientRoutes = require('./routes/patientRoutes')
const departmentRoutes = require('./routes/departmentRoutes')
const nurseRoutes = require('./routes/nurseRoutes')
const receptionistRoutes = require('./routes/receptionistRoutes')
const medTechRoutes = require('./routes/medTechRoutes')
const radTechRoutes = require('./routes/radTechRoutes')


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// mogodb connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection is established.");
});

// Model Routes
app.use("/api/article", articleRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/patient', patientRoutes)
app.use('/api/department', departmentRoutes)
app.use('/api/nurse', nurseRoutes)
app.use('/api/medTech', medTechRoutes)
app.use('/api/radTech', radTechRoutes)
app.use('/api/receptionist', receptionistRoutes)


const server = app.listen(port, () => {
  console.log(`Server is running in port : ${port}`);
});

io = require ('socket.io')(server, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {


  socket.emit("Data", "First Emit")
})