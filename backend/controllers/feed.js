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
    const title = request.body.title;
    const content = request.body.content;

    // Create post in db
    response.status(201).json({
        message: 'Post created successfully!',
        post: {
            _id: new Date().toISOString(),
            title,
            content,
            creator: {
                name: 'Necrobone',
            },
            createdAt: new Date(),
        }
    })
};
