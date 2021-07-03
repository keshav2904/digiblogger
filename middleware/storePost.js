module.exports = (req, res, next) => {
    if (!req.files || !req.body.username || !req.body.title || !req.body.description || !req.body.content) {
        const createpostError = ['Error creating post !'];
        req.flash('createpostError', createpostError);
        return res.redirect('/posts/new')
    }

    next()
}