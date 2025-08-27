const router = require('express').Router();
const ctrl = require('../controllers/productController');
router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.details);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);
module.exports = router;
