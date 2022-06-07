exports.getPosts = (request, response) => {
    return response.status(200).json({
        posts: [
            {
                title: 'First Post',
                content: 'This is the first post!',
            }
        ]
    });
};
