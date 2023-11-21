// Import Apollo Server and graphql-import to set up the GraphQL server
const { ApolloServer } = require("apollo-server"); 
const { importSchema } = require("graphql-import");

// Import the custom EtherDataSource 
const EtherDataSource = require("./datasource/ethDatasource");

// Import the GraphQL schema
const typeDefs = importSchema("./schema.graphql"); 

// Load environment variables from .env file
require("dotenv").config();

// Define the query resolvers
const resolvers = {
  Query: {
    // Resolver for etherBalanceByAddress query
    etherBalanceByAddress: (root, _args, { dataSources }) =>  
      dataSources.ethDataSource.etherBalanceByAddress(),

    // Resolver for totalSupplyOfEther query      
    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    // Resolver for latestEthereumPrice query
    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    // Resolver for blockConfirmationTime query
    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  
  // Pass EtherDataSource instance to dataSources
  dataSources: () => ({
    ethDataSource: new EtherDataSource(),
  }), 
});

// Set timeout to 0 to disable timeouts
server.timeout = 0;

// Start the server
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`); 
});