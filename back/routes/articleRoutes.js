const router = require('express').Router();
const articleController = require('../controllers/articleController');
const authController = require('../controllers/authController');
const { validateArticleData } = require('../middlewares/validation');

router
  .route('/id/:id')
  .get(authController.protect, articleController.getArticleById);

router
  .route('/:direction?/:department?')
  .get(authController.protect, articleController.getAllArticles)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'editor'),
    validateArticleData,
    articleController.createArticle
  );

module.exports = router;
