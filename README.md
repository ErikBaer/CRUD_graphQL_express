# CRUD-API

Organize all books from your favorite authors with this nested CRUD-API written in GraphQL and Express.

Create, Read, Update and Delete Books and Authors and make this Database your own.

## Usage

First install all the dependencies by running:
npm install
in the project folder.

To run the server, please execute: 
npm run devStart 


You can access the API via graphiql on localhost:5000/graphql.

## Queries

Query all authors or books and find your favorite one by id.

The RootQuery resolves to:

author: {
    id,
    name,
    books
}
and 

book: {
    id,
    name,
    author,
    authorId
}

Use the id to perform update or delete operations on objects.
To add an object, please provide:

author: {
    name
}

or

books: {
    name,
    author
}

Happy query! :)

P.S. Next step is to hook it up to MongoDB for persistance, and also to create a simple Frontend.