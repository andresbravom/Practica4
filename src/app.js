import  {GraphQLServer} from 'graphql-yoga'
import { MongoClient, ObjectID} from "mongodb";
import "babel-polyfill";
import { resolve } from 'dns';
import { json } from 'body-parser';

const usr = "andresBM";
const pwd = "qwerty123";
const url = "cluster0-k7hro.gcp.mongodb.net/test?retryWrites=true&w=majority";

/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */

const connectToDb = async function(usr, pwd, url) {
    const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  
    await client.connect();
    return client;
  };

/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {client: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */

const runGraphQLServer = function(context){
const typeDefs = `
    type Bill{
        date: Int!
        concept: String!
        quantity: double!
        bill holder: String!
    }

    type BillHolder{
        userName: String!
        password: String!
        bills: Bill!
    }

    type Query{
        getBills(userName: String!, ): Bill!
    }

    type Mutation{
        addUser(userName: String!, password: String!): BillHolder!
        login(userName: String!, password: String!): BillHolder!
        logout(userName: String!, ): BillHolder!
        removeUser(userName: String, ): BillHolder!
    }

`
}
const runApp = async function(){
    const client = await connectToDb(usr, pwd, url);
    console.log("Connect to Mongo DB");

    runGraphQLServer({client});
};

runApp();
