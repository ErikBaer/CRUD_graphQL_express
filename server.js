const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require('graphql')

const {authors, books} = require ('./database')


const app = express();

const RootQueryType = new GraphQLObjectType ({
    name: 'Query',
    description: ' Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of Books',
            resolve: () => books
        }
    })
})

app.use(
  '/graphql',
  graphqlHTTP({
      RootQueryType,
    graphiql: true,
  }),
);


app.listen(5000, () => console.log('Server Running on Port 5000'))