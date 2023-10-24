const Article = require('../models/articleModel');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/AppError');

const { uploadFiles } = require('../utils/minioUpload');

exports.getAllArticles = catchAsync(async (req, res, next) => {
  const { direction, department } = req.params;

  let query = Article.find();
  if (direction) query = query.find({ direction });
  if (department) query = query.find({ department });

  const { search } = req.query;
  if (search) query = query.find({ description: { $regex: `${search}` } });

  const filters = [];

  const { direction_departments } = req.user;

  Object.keys(direction_departments).forEach((dir) => {
    if (direction_departments[dir].length === 0) {
      return filters.push({ direction: dir, department: null });
    } else {
      return direction_departments[dir].forEach((dep) => {
        return filters.push({ direction: dir, department: dep });
      });
    }
  });
  query = query.find({ $or: filters });
  // =====================================================================

  const totalCount = await Article.countDocuments(query);
  const limit = req.query.limit || 10;
  const nbrOfPages = Math.ceil(totalCount / limit);

  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const articles = await features.query;

  return res.status(200).json({
    status: 'success',
    results: articles.length,
    nbrOfPages,
    data: {
      articles,
    },
  });
});

exports.createArticle = catchAsync(async (req, res, next) => {
  let imageURL = null;
  let filesURL = null;

  if (req.files?.image) {
    imageURL = await uploadFiles(req.files.image);
  }
  if (req.files?.files) {
    const files = Array.isArray(req.files.files)
      ? req.files.files
      : [req.files.files];
    filesURL = await uploadFiles(files);
  }

  const article = await Article.create({
    ...req.body,
    image: imageURL ? imageURL.path : null,
    files: filesURL ? filesURL : null,
  });

  return res.status(200).json({
    status: 'success',
    message: 'Article ajouté avec succès',
    data: {
      article,
    },
  });
});

exports.getArticleById = catchAsync(async (req, res, next) => {
  if (!Article.checkId(req.params.id)) {
    return next(new AppError('Id non valid !'));
  }

  const article = await Article.findById(req.params.id).populate(
    'author',
    'first_name last_name'
  );

  const artile_direction = article.direction;
  const artile_department = article.department;

  const user_direction_departments = req.user.direction_departments;
  const user_directions = Object.keys(user_direction_departments);

  if (
    user_directions.includes(artile_direction) &&
    (artile_department === null ||
      user_direction_departments[artile_direction].includes(artile_department))
  ) {
    return res.status(200).json({
      status: 'success',
      data: {
        article,
      },
    });
  }

  return res.status(200).json({
    status: 'success',
    data: {
      article: null,
    },
  });
});
