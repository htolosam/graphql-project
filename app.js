const express = require('express');
const {graphqlHTTP} = require('express-graphql');

// schemas
const schema = require('./server/schema/schema');
const testSchema = require('./server/schema/types_schema');
const mongoose = require("mongoose");
const port = process.env.PORT || 4000;

const app = express();


//app.use(cors());
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
}))

mongoose.connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphqlcluster.q5mi4eq.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority&appName=GraphqlCluster`, 
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(()=>{
    console.log(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphqlcluster.q5mi4eq.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority&appName=GraphqlCluster`);
    app.listen({port: port}, () => {
        console.log('Server is running on port ', port);
    });
}).catch((e) => console.log("Error ::: ", e));

