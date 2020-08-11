const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')

const app = express();

const {authors, books} = require ('./database')

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a Book written by an author',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt) },
        name: {type: GraphQLNonNull (GraphQLString) },
        authorId: {type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'Author of a book',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt) },
        name: {type: GraphQLNonNull (GraphQLString) },
        books: {
            type: GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => author.id === book.authorId)
            }
        }
       
    })
})


const RootQueryType = new GraphQLObjectType ({
    name: 'Query',
    description: ' Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of Books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of authors',
            resolve: () => authors
        } 
    })
})


const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use(
  '/graphql',
  graphqlHTTP({
      schema,
    graphiql: true,
  }),
);


app.listen(5000, () => console.log('Server Running on Port 5000'))