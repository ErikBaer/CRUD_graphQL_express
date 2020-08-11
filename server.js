const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} = require('graphql')

const {authors, books} = require ('./database')


const app = express();

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'HelloWorld',
         fields: () => ({
             message: {type: GraphQLString,
             resolve: () => 'Hello World'
             }
         })
    })
})

app.use(
  '/graphql',
  graphqlHTTP({
      schema,
    graphiql: true,
  }),
);


app.listen(5000, () => console.log('Server Running on Port 5000'))