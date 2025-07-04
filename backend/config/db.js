const mongoose = require('mongoose');  

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
    } catch (error) {
        process.exit(1);
    }
};

module.exports = connectDB;  

