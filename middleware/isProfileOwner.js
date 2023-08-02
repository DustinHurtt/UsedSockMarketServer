const isProfileOwner = () => {

    if (req.user._id === req.params.userId) {
        next()
    } else {
        res.status(401).json({message: "This is not profile."})
    }

}

module.exports = isProfileOwner