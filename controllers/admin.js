const Order = require('../models/Order');

exports.changeOrderStatus = async (req, res) => {
    try {
        const { orderId, orderstatus } = req.body;
        let orderUpdate = await Order.findByIdAndUpdate(orderId, { orderstatus }, { new: true });
        res.send(orderUpdate);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error !!!');
    }
};

exports.getOrderAdmin = async (req, res) => {
    try {
        const order = await Order.find().populate('products.product').populate('orderBy', 'username').exec();
        res.json(order);
    } catch (err) {
        console.log(err);
        res.status(500).send('Get Order Error !!!');
    }
};
