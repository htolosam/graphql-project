const graphql = require('graphql');

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLFloat, GraphQLNonNull } = graphql;

//Los tipos scalar son tipos que no son objetos solo un tipo
//que por lo general tiene un valor, en otros lenguakes seria un primitivo, 
//como un entero, flotante etc
//Scalar Type
/*
String = GraphQLString
int
Float
Boolean
ID // es nativo teletipo representa un identificador unico que a menudo
//se utiliza para referirse a un objeto o como clave de una cache
*/


const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Represents a person type',
    // se pasan los campos donde vamos a obtener los datos
    // cada campo debe terner un tipo de dato especifico
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLInt},
        isMarried: {type: GraphQLBoolean},
        gpa: {type: GraphQLFloat},
        // se puede crearun nuevo tipo dentro del objeto GraphQL
        justAType: {
            type: Person,
            resolve(parent, args) {
                return parent;
            }
        }
    })
});


//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        person: {
            type: Person,
            //args: {id: {type: GraphQLString}}
            resolve(parent, args){
                let personObj = {
                    //id: {type: GraphQLID},
                    name: 'ANTONIO',
                    age: 34,
                    isMarried: true,
                    gps: 4.8,
                }
                return personObj;
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
});