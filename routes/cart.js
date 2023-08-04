var express = require('express');
var router = express.Router();

const Cart = require('../models/Cart');

const isAuthenticated = require('../middleware/isAuthenticated');


router.get('/', isAuthenticated, (req, res, next) => {

    Cart.findOne({
        owner: req.user._id
    })
        .populate('socks')
        .then((foundCart) => {
            if(!foundCart) {
                return res.json({message: 'Your cart is empty'})
            }
            res.json(foundCart)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

});

router.post('/create', isAuthenticated, async (req, res, next) => {

    try {

        const { sockId, sockCost } = req.body
    
        const newCart = await Cart.create({
            owner: req.user._id,
            subtotal: sockCost, 
            total: sockCost * 1.08,
            socks: [sockId]
        })
    
        const populated = await newCart.populate('socks')

        console.log("POPULATED ====>", populated)
    
            res.json(populated)

    } catch (err) {
        
        res.json(err)
        console.log(err)
        next(err)

    }

})

router.post('/update', isAuthenticated, async (req, res, next) => {

    try {

        const { sockId, cartId, sockCost } = req.body

        const toUpdate = await Cart.findById(cartId)
    
        toUpdate.subtotal += sockCost
        toUpdate.total = toUpdate.subtotal * toUpdate.tax
        toUpdate.socks.push(sockId)

        const newCart = await toUpdate.save()
    
        const populated = await newCart.populate('socks')
    
            res.json(populated)

    } catch (err) {
        
        res.redirect(307, '/cart/create')
        console.log(err)
        next(err)
    }

})

router.post('/remove-sock/:sockId', isAuthenticated, async (req, res, next) => {
    

    try {

        const cartId = req.body._id
        
        const { sockId } = req.params

        console.log("SOCKID ===>", sockId)

        const toPopulate = await Cart.findById(cartId)

        const cart = await toPopulate.populate('socks')

        console.log("Cart ===>", cart)

        let sock = cart.socks.find((thisSock) => thisSock._id.toString() === sockId)

        console.log("Sock ====>", sock)
        
        let remainingSocks = cart.socks.filter((sock) => sock._id.toString() !== sockId)

        cart.socks = remainingSocks
        cart.subtotal -= sock.cost
        cart.total = cart.subtotal * cart.tax

        let newCart = await cart.save()

        console.log("New cart ===>", newCart)

        res.json(newCart)

    } catch (err) {

        res.json(err)
        console.log(err)
        next(err)
    }




    // Cart.findByIdAndUpdate(
    //     cartId,
    //     {
    //         $pull: {socks: sockId}
    //     },
    //     { new: true }
    // )
    //     .populate('socks')
    //     .then((updatedCart) => {
    //         console.log("Updated Cart ====>", updatedCart)
    //         res.json(updatedCart)
    //     })
    //     .catch((err) => {
    //         res.json(err)
    //         console.log(err)
    //         next(err)
    //     })

})

module.exports = router;