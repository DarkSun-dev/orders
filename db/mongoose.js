const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
mongoose.connect(process.env.URL_DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connected successful!'))
