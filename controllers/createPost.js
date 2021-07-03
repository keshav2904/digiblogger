module.exports = (req, res) => {
    if (req.session.userId) {
        res.render("create", {
            errors: req.flash('createpostError')
        })
    }
    else{
    res.redirect('/auth/login')
    }
}