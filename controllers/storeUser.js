const User = require('../database/models/User')

module.exports = (req, res) => {
    User.findOne({ email: req.body.email}, (error, user) => {
        if (user){
            const registrationErrors = [ 'Email already registered !' ];
            req.flash('registrationErrors', registrationErrors)
            return res.redirect('/auth/register')
        }
        else {
            User.create(req.body, (error, user) => {
                if (error) {
                    const registrationErrors = Object.keys(error.errors).map(key => error.errors[key].message)
                    req.flash('registrationErrors', registrationErrors)
                    return res.redirect('/auth/register')
                }
                res.redirect('/')
            })
        }
    })
}
