const graphql = require('graphql');
const mongoose = require('mongoose');

const {
    GraphQLID,
    GraphQLString
} = graphql;

const Note = mongoose.model('note');
const Comment = mongoose.model('comment');

const NoteType = require('../types/note');

const noteMutation = {
    addNote: {
        type: NoteType,
        args: {
            name: {type: GraphQLString},
            description: {type: GraphQLString},
            board: {type: GraphQLID},
            editor: {type: GraphQLString},
            owner: {type: GraphQLID}
        },
        resolve(parentValue, args) {
            return (new Note({
                ...args,
                time: Date.now()
            })).save();
        }
    },
    updateNote: {
        type: NoteType,
        args: {
            name: {type: GraphQLString},
            description: {type: GraphQLString},
            id: {type: GraphQLID},
            editor: {type: GraphQLString}
        },
        resolve(parentValue, {
            id,
            name,
            description,
            editor
        }) {
            return Note.findByIdAndUpdate(id, {
                $set: {
                    name,
                    description,
                    editor,
                    time: Date.now()
                }
            }, {'new': true});
        }
    },
    moveNote: {
        type: NoteType,
        args: {
            board: {type: GraphQLString},
            id: {type: GraphQLString}
        },
        resolve(parentValue, {
            id,
            board
        }) {
            return Note.findByIdAndUpdate(id, {
                $set: {
                    board
                }
            }, {'new': true});
        }
    },
    deleteNote: {
        type: NoteType,
        args: {
            id: {type: GraphQLID}
        },
        resolve(parentValue, {id}) {
            return Note.findById(id, function(err, note) {
                // eslint-disable-next-line no-underscore-dangle
                Comment.deleteMany({note: note._id});
                note.deleteOne();
            });
        }
    }
};

module.exports = noteMutation;