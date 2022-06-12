const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (request, response) => {
    return response.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First Post',
                content: 'This is the first post!',
                image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
                creator: {
                    name: 'Necrobone',
                },
                createdAt: new Date(),
            }
        ]
    });
};

exports.createPost = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({
            message: 'Validation failed, entered data is incorrect',
            errors: errors.array(),
        })
    }

    const title = request.body.title;
    const content = request.body.content;

    const post = new Post({
        title,
        content,
        imageUrl: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
        creator: {
            name: 'Necrobone',
        }
    });

    post.save()
        .then(result => {
            response.status(201).json({
                message: 'Post created successfully!',
                post: result
            })
        })
        .catch(error => console.log(error));
};
