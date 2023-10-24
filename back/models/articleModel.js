const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema({
  direction: {
    type: String,
    trim: true,
    required: [true, 'An Article must have a direction !'],
  },
  department: {
    type: String,
    trim: true,
    lowercase: true,
    required: false,
    default: null,
  },
  title: {
    type: String,
    trim: true,
    required: [true, 'An Article must have a name !'],
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
    lowercase: true,
    required: false,
  },
  slug: String,
  image: {
    type: String,
    required: false,
    // required: [true, 'An Article must have an !'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    trim: true,
  },
  files: {
    type: [Object],
    required: false,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  active: {
    type: Boolean,
    default: true,
  },
});

articleSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  // this.department = slugify(this.department,{lower:true})
  next();
});

articleSchema.statics.checkId = function (id) {
  if (!mongoose.isValidObjectId(id)) {
    return false;
  }
  return true;
};

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
