import jwt  from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from  '../config';
import user from '../models/user'

class Authentication{

static auth (req, res) {

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    user.create({
        email: req.body.email,
        password: hashedPassword
    },
        function (err, user) {
            if (err) 
            {
                return res.status(500).send("There was a problem registering the user.")
            }
            // create a token
            var token = jwt.sign({ id: user._id }, config.apiKey, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
        });
});
}