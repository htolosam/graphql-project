const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;
var _ = require('lodash');

const User = require("../model/user");
const Post = require("../model/post");
const Hobby = require("../model/hobby");
const { comments } = require('moongose/models');

//dummy data
var usersData = [
    { id: '1', name: 'Bond', age: 36, profession: 'Programmer' },
    { id: '2', name: 'Anna', age: 26, profession: 'Baker' },
    { id: '3', name: 'Bella', age: 16, profession: 'Mechanic' },
    { id: '4', name: 'Gina', age: 26, profession: 'Painter' },
    { id: '5', name: 'Georgina', age: 36, profession: 'Teahcer' },
    { id: '6', name: 'Linda', age: 16, profession: 'QA' }
];

var hobbiesData = [
    { id: '1', title: 'Programming', description: 'Using computers to make the world a better place', userId: '1' },
    { id: '2', title: 'Rowing', description: 'Sweat and feel better before eating donuts', userId: '1' },
    { id: '3', title: 'Swimming', description: 'Get in the water and learn to become the water', userId: '2' },
    { id: '4', title: 'Fencing', description: 'A hobby for fency people', userId: '3' },
    { id: '5', title: 'Hiking', description: 'Wear hiking boots and explore the world', userId: '5' }
];

var postsData = [
    { id: '1', comment: 'Building a Mind', userId: '1'},
    { id: '2', comment: 'GraphQL is Amazing', userId: '2' },
    { id: '3', comment: 'How to Change the World', userId: '1' },
    { id: '4', comment: 'How to Change the World', userId: '3' },
    { id: '5', comment: 'How to Change the World', userId: '1' },
    { id: '6', comment: 'How to Change the World', userId: '4' }
];

//end dummy data

const UserType = new GraphQLObjectType({
    name: 'User',
    description: "Documentation for user ...",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString },
        posts: { 
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return Post.find({userId: parent.id});
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return Hobby.find({userId: parent.id});
            }
        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: "Hobby",
    description: "Hobby description...",
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args){
                return _.find(usersData, {id: parent.userId});
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: "Post",
    description: "Post description ...",
    fields: () => ({
        id: { type: GraphQLID },
        comment: { type: GraphQLString },
        user: {
            type: UserType,
            resolve(parent, args){
                return _.find(usersData, {id: parent.userId});
            }
        }
    })
});

//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        /*
        Pasamos el usuario en el type
        en el argumento los datos de busqueda
        y el resolver donde lo queremos buscar y que vamos a devolver
        */
        user: {
            type: UserType,
            args: {//argumentos que queremos pasar para la consulta
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                console.log("args.id :: ", args.id);
                // parent se refiere al padre o en este casoa l tipo de usuario
                // resolvemos con datos de una fuente de datos, obtener y retornar
                let user = User.findById(args.id);
                console.log("user: ", user);
                return user;
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find();
            }
        },
        hobby: {
            type: HobbyType,
            args: {
                id: { type: GraphQLString }
            },
            resolve(parent, args) {
                //let hobby = _.find(hobbiesData, {id: args.id});
                let hobby = Hobby.find({id: args.id});
                return hobby;
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            args: {
                userId: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Hobby.find({userId: args.userId});
            }
        },
        post: {
            type: PostType,
            args: { 
                id: {type: GraphQLID }
            },
            resolve(parent, args){
                let post = _.find(postsData, {id: args.id});
                return post;
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
                return Post.find({userId: parent.id});
            }
        }
    }
});



// Mutations
// Modificar los datos obtenidos
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                // id: {type: GraphQLID},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString},
            },
            resolve(parent, args){
                //crear un objeto mongoose User
                let user = User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                });
                //guardamos en la bd y devovemos el user
                return user.save();
            }
        },
        updateUser:{
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString},
            },
            resolve(parent, args){
                return updateUser = User.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession,
                        }
                    },
                    // en true deviuelve el objeto actualizado, en false el objeto antes de ser actualizado
                    { new: true }
                );
            }
        },
        removeUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                removedUser = User.findByIdAndRemove(args.id).exec();
                if(!removedUser){
                    throw new "Error"();
                }
                return removedUser;
            }
        },
        createPost: {
            type: PostType,
            args: {
                // id: {type: GraphQLID},
                comment: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                let post = Post({
                    comment: args.comment,
                    userId: args.userId
                });
                return post.save();
            }
        },
        updatePost: {
            type: PostType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)},
                comment: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args) {
                return updatePost = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            comment: args.comment,
                        }
                    },
                    { new:  true }
                );
            }
        },
        removePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args){
                let removedPost = Post.findByIdAndRemove(args.id).exec();
                if(!removedPost){
                    throw new "Error"()
                }
                return removePost;
            }
        },
        createHobby: {
            type: HobbyType,
            args: {
                //id: {type: GraphQLID}
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let hobby = Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                });
                return hobby.save();
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args) {
                return updateHobby = Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title: args.title,
                            description: args.description
                        }
                    },
                    { new: true }
                );
            }
        },
        removeHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let removedHobby = Post.findByIdAndRemove(args.id).exec();
                if(!removedHobby){
                    throw new "Error"();
                }
                return removedHobby;
            }
        },
    }
});


// exportamos solo el módulo de la consulta
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

                
