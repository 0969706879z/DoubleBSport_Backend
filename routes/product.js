const express = require('express');
const router = express.Router();
const { create, list, remove, read, update, listBy, searchFilters } = require('../controllers/product')
const { auth, adminCheck } = require('../middleware/auth')


router.post('/product', auth, adminCheck, create);
router.get('/product/:count', list);
router.delete('/product/:id', auth, adminCheck, remove);
router.get('/products/:id', read);
router.put('/products/:id', auth, adminCheck, update);

router.post('/productby', listBy);

router.post('/search/filters', searchFilters)



module.exports = router;
