const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

foodLogSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.documentId = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('FoodLog', foodLogSchema);
