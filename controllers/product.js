const Product = require('../models/Product')


exports.create = async (req, res) => {
    try {
        const product = await new Product(req.body).save()
        res.send(product)
    } catch (err) {
        res.status(500).send("Create Product Faild !!!")
    }
}

exports.list = async (req, res) => {
    try {
        const count = parseInt(req.params.count)
        const products = await Product.find().limit(count).populate('category').sort([["createdAt", "desc"]]);
        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch products');
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndRemove(req.params.id).exec();
        if (!deleted) {
            return res.status(404).send('Product not found');
        }
        res.send(deleted);
    } catch (err) {
        console.error(err);
        res.status(500).send('Remove Product Error');
    }
};

exports.read = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id }).populate("category").exec()
        res.send(product)
    } catch (err) {
        console.error(err);
        res.status(500).send('Read Product Error');
    }
};

exports.update = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).exec()
        res.send(product)

    } catch (err) {
        console.error(err);
        res.status(500).send('Update Product Error');
    }
};

exports.listBy = async (req, res) => {
    try {
        const { sort, order, limit } = req.body
        const products = await Product.find().limit(limit).populate('category').sort([[sort, order]]);
        res.send(products);
    } catch (err) {
        console.error(err);
        res.status(500).send('ListBy products Error !!! ');
    }
};

const handleQuery = async (req, res, query) => {
    try {
        const products = await Product.find({ $text: { $search: query } }).populate('category', "_id name")
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("เกิดข้อผิดพลาดในการดำเนินการค้นหา");
    }
};

const handlePrice = async (req, res, price) => {
    try {
        const products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1]
            }

        }).populate('category', "_id name")
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("เกิดข้อผิดพลาดในการดำเนินการค้นหา");
    }
};

const handleCategory = async (req, res, category) => {
    try {
        const products = await Product.find({ category }).populate('category', "_id name")
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("เกิดข้อผิดพลาดในการดำเนินการค้นหา");
    }
};

exports.searchFilters = async (req, res) => {
    const { query, price, category } = req.body;
    let isQueryHandled = false;
    let isPriceHandled = false;

    if (query) {
        console.log("query", query);
        await handleQuery(req, res, query);
        isQueryHandled = true;
    }

    if (price !== undefined) {
        console.log("price-->", price);
        await handlePrice(req, res, price);
        isPriceHandled = true;
    }

    if (category) {
        console.log("category-->", category);
        await handleCategory(req, res, category);
        isPriceHandled = true;
    }

};

