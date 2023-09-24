const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require ('./app');

// console.log(app.get('env'))

// console.log(process.env) //these comes from the process module - core module of nodejs/available globally

const port = process.env.PORT || 3000

app.listen (port, () => {
  console.log(`server is running on port ${port}`)
});
