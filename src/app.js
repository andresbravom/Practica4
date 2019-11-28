import  {GraphQLServer} from 'graphql-yoga'
import { MongoClient, ObjectID} from "mongodb";
import "babel-polyfill";
import { resolve } from 'dns';


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
        quantity: Float!
        billHolder: String!
        id: ID!
    }

    type User{
        userName: String!
        password: String!
        bills: Bill!
        id:ID!
        token:ID!
    }

    type Query{
        user(id: ID!): User
    }

    type Mutation{
        addUser(userName: String!, password: String!): User
        
    }

`
const resolvers = {

    Mutation:{
        addUser: async(parent, args, ctx, info) => {
            const { userName, password } = args;
            const { client } = ctx;

            const db = client.db("API");
            const collection = db.collection("Users");
  
            const result = await collection.findOne({userName});
            if (!result){
                const s = await collection.insertOne({userName, password});
                return s.ops[0];
            }else{
                return null;
            }
            
        }
    }
}
const server = new GraphQLServer({typeDefs, resolvers, context});
server.start(() => console.log("Server started"));
};
const runApp = async function(){
    const client = await connectToDb(usr, pwd, url);
    console.log("Connect to Mongo DB");

    runGraphQLServer({client});
};

runApp();
