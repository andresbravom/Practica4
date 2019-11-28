import  {GraphQLServer} from 'graphql-yoga'
import { MongoClient, ObjectID} from "mongodb";
import "babel-polyfill";
//import { resolve } from 'dns';
import * as uuid from 'uuid'


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
        user: User!
        amount: Float!
        concept: String!
        date: String!
        _id: ID!  
    }

    type User{
        userName: String!
        password: String!
        bills: [Bill]!
        _id: ID!
        token: ID!
    }

    type Query{
        user(_id: ID!): User
        bill(_id: ID!): Bill
    }

    type Mutation{
        addUser(userName: String!, password: String!): User
        addBill(userName: String!, token: ID!, amount: Float, concept: String, date: String): Bill
        login(userName: String!, password: String!): String
        
    }
`
const resolvers = {

    User:{
        bills: async(parent, args, ctx, info) => {
            const billsID = ObjectID(parent._id);
            const{ client } = ctx;

            const db = client.db("API");
            const collection = db.collection("Bills");
            const result = await collection.find({user: billsID}).toArray();
            return result;
        }, 
        _id(parent, args, ctx, info){
            const result = parent._id;
            return result;
        }
    },

    Bill:{
        user: async(parent, args, ctx, info) =>{
            const userID = parent.user;
            const { client } = ctx;

            const db = client.db("API");
            const collection = db.collection("Users");
            const result = await collection.findOne({_id: ObjectID(userID)});
            return result;
        }, 
        _id(parent, args, ctx, info){
            const result = parent._id;
            return result;
        }
    },
    Mutation:{
        addUser: async(parent, args, ctx, info) => {
            const { userName, password } = args;
            const { client } = ctx;

            const db = client.db("API");
            const collection = db.collection("Users");
  
            const result = await collection.findOne({userName});
            if (!result){
                const object = await collection.insertOne({userName, password});
                return object.ops[0];
            }else{
                return null;
            }
        },

        addBill: async(parent, args, ctx, info) => {
            const { userName, token, amount, concept, date } = args;
           
            const { client } = ctx;
          

            const db = client.db("API");
            const collection = db.collection("Bills");
            const collectionUsers = db.collection("Users");

          
            const result = await collectionUsers.findOne({token, userName});
        

            if(result){
                const user = result._id;
          
                const object = await collection.insertOne({user, amount, concept, date});
                return object.ops[0];
            }else{
                return null;
            }         
        },

        login: async(parent, args, ctx, info) => {
            const { userName, password } = args;
            const { client } = ctx;
           

            const db = client.db("API");
            const collection = db.collection("Users");

            const result = await collection.findOne({userName, password});

            if(result){
               const token = uuid.v4();
               await collection.updateOne({userName: userName}, {$set: {token: token}});
               return token;
            }else{
                return null;
            }
        },
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
