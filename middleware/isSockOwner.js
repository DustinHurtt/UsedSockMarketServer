
const Sock = require('../models/Sock');

const isSockOwner = (req, res, next) => {

    console.log("ISSOCKOWNER =====>", req.params, req.body)

    Sock.findById(req.params.sockId)
        .then((foundSock) => {
            if (req.user._id === foundSock.owner.toString()) {
                next()
            } else {
                res.status(401).json({message: "Validation Error"})
            }
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
}

module.exports = isSockOwner;