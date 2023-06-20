const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const Product = require('../models/Product')
const Cart = require('../models/Cart')
const Order = require('../models/Order')


exports.listUsers = async (req, res) => {
    try {
        const user = await User.find({}).select('-password').exec()
        res.send(user)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error !!!')
    }
}

exports.readUsers = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findOne({ _id: id }).select('-password').exec()
        res.send(user)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error !!!')
    }
}

exports.updateUsers = async (req, res) => {
    try {
        var { id, password } = req.body.valuess
        const salt = await bcrypt.genSalt(10)
        const enPassword = await bcrypt.hash(password, salt)
        const user = await User.findOneAndUpdate({ _id: id }, { password: enPassword }).select('-password').exec()
        res.send(user)
        console.log(enPassword)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error !!!')
    }
}

exports.removeUsers = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findOneAndDelete({ _id: id }).select('-password').exec()
        res.send(user)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error !!!')
    }
}

exports.changeStatus = async (req, res) => {
    try {
        //const id = req.params.id
        const user = await User.findOneAndUpdate({ _id: req.body.id }, { enabled: req.body.enabled }).select('-password').exec()
        res.send(user)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error !!!')
    }
}

exports.changeRole = async (req, res) => {
    try {
        //const id = req.params.id
        const user = await User.findOneAndUpdate({ _id: req.body.id }, { role: req.body.role }).select('-password').exec()
        res.send(user)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error !!!')
    }
}

exports.userCart = async (req, res) => {
    try {
        const { cart } = req.body

        let user = await User.findOne({ username: req.user.username }).exec()
        let products = []
        let cartOld = await Cart.findOne({ orderBy: user._id }).exec()
        if (cartOld) {
            await Cart.deleteOne({ _id: cartOld._id });
        }

        for (let i = 0; i < cart.length; i++) {
            let object = {}
            object.product = cart[i]._id
            object.count = cart[i].count
            object.price = cart[i].price
            products.push(object)
        }

        let cartTotal = 0
        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            cartTotal = cartTotal + product.price * product.count
        }

        let newCart = await new Cart({
            products,
            cartTotal,
            orderBy: user._id
        }).save()
        console.log(newCart)
        res.send("User Cart OK")
    } catch (err) {
        console.log(err)
        res.status(500).send("User Cart Server Error !!!")
    }
}

exports.getUserCart = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username }).select('-password').exec();
        const cart = await Cart.findOne({ orderBy: user._id }).populate('products.product', "_id title price").exec();
        const { products, cartTotal } = cart;
        console.log("id", user._id);
        res.json({ products, cartTotal });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error !!!');
    }
};

exports.saveAddress = async (req, res) => {
    try {
        const userAddress = await User.findOneAndUpdate({ username: req.user.username }, { address: req.body.address }).exec()
        res.json({ ok: true })
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error !!!');
    }
};

exports.saveOrder = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username }).exec();
        const userCart = await Cart.findOne({ orderBy: user._id }).exec();
        const order = new Order({
            products: userCart.products,
            orderBy: user._id,
            cartTotal: userCart.cartTotal
        });
        await order.save();

        const bulkOptions = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: {
                        $inc: {
                            quantity: -item.count,
                            sold: +item.count
                        }
                    }
                }
            };
        });

        const updated = await Product.bulkWrite(bulkOptions);
        res.send(updated);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Order Error !!!');
    }
};

exports.getOrder = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username }).select('-password').exec();
        const order = await Order.find({ orderBy: user._id }).populate('products.product').exec();
        res.send(order);
    } catch (err) {
        console.log(err);
        res.status(500).send('Get Order Error !!!');
    }
};

exports.emptyCart = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.user.username }).select('-password').exec();
        const empty = await Cart.findOneAndRemove({ orderBy: user._id }).exec()
        res.send(empty)
    } catch (err) {
        console.log(err);
        res.status(500).send('Remove Cart  Error !!!');
    }
};

exports.addToWishList = async (req, res) => {
    try {
        const { productId } = req.body
        let user = await User.findOneAndUpdate({ username: req.user.username }, { $addToSet: { wishlist: productId } }).exec()
        res.send(user)
    } catch (err) {
        console.log(err);
        res.status(500).send('Add WishList Error !!!');
    }
};

exports.getWishList = async (req, res) => {
    try {
        const { productId } = req.body
        let user = await User.findOne({ username: req.user.username }).select('wishlist').populate('wishlist').exec()
        res.json(user)
    } catch (err) {
        console.log(err);
        res.status(500).send('Add WishList Error !!!');
    }
};

exports.removeWishList = async (req, res) => {
    try {
        const { productId } = req.params
        let user = await User.findOneAndUpdate({ username: req.user.username }, { $pull: { wishlist: productId } }).exec()
        res.send(user)
    } catch (err) {
        console.log(err);
        res.status(500).send('Add WishList Error !!!');
    }
};