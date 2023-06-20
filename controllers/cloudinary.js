const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dnxxnpfvz',
    api_key: '376825376414485',
    api_secret: 'uBmBieC2AZEVloU5vAY93SA1kQI'
});

exports.createImage = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.body.image, {
            public_id: String(Date.now()),
            resource_type: "auto"
        });
        res.send(result);
    } catch (err) {
        res.status(500).send("Upload Error!!!");
    }
}

exports.removeImage = async (req, res) => {
    try {
        const image_id = req.body.public_id;
        const result = await cloudinary.uploader.destroy(image_id);
        res.send(result);
        console.log(image_id)
    } catch (err) {
        res.status(500).send("Delete Error!!!");
    }
}
