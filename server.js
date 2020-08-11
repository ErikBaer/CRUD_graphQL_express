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
        book: {
            type: BookType,
            description: 'A single Book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)//Here you query the database
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of Books',
            resolve: () => books //Here you query the database
        },
        author: {
            type: AuthorType,
            description: 'A single Author',
            args: {
                id: {type:GraphQLInt}
            },
            resolve: (parent, args) =>  authors.find(author => args.id ===author.id)
               //Here you query the database
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of authors',
            resolve: () => authors //Here you query the database
        } 
    })
})


const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
              name: { type: GraphQLNonNull(GraphQLString) },
              authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => { //this is where you do Database operations
              const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
              books.push(book)
              return book
            }
          },
          updateBook: {
            type: BookType,
            description: 'Update a book',
            args: {
                id: {type: GraphQLInt},
              name: { type: GraphQLNonNull(GraphQLString) },
              authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => { //this is where you do Database operations
              bookIndex = books.findIndex((book => book.id ==args.id))
              console.log ('Before update: ', books[bookIndex])
            
              books[bookIndex].name = args.name
              books[bookIndex].authorId = args.authorId

              console.log('After update: ', books[bookIndex])

              return books[bookIndex]
            }
          },
          addAuthor: {
            type: AuthorType,
            description: 'Add an Author',
            args: {
              name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => { //this is where you do Database operations
              const author = { id: authors.length + 1, name: args.name }
              authors.push(author)
              return author
            }
          },
          updateAuthor: {
            type: AuthorType,
            description: 'Update a Author',
            args: {
                id: {type: GraphQLInt},
              name: { type: GraphQLNonNull(GraphQLString) },
              authorId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => { //this is where you do Database operations
              authorIndex = authors.findIndex((author => author.id ==args.id))
              console.log ('Before update: ', authors[authorIndex])
            
              authors[authorIndex].name = args.name
              authors[authorIndex].authorId = args.authorId

              console.log('After update: ', authors[authorIndex])

              return authors[authorIndex]
            }
          }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use(
  '/graphql',
  graphqlHTTP({
      schema,
    graphiql: true,
  }),
);


app.listen(5000, () => console.log('Server Running on Port 5000'))