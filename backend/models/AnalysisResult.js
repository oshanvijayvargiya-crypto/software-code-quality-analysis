const mongoose = require('mongoose');

const AnalysisResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  filename: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  metrics: {
    loc: Number,
    blankLines: Number,
    commentLines: Number,
    commentRatio: Number,
    cyclomaticComplexity: Number,
    numFunctions: Number,
    numClasses: Number,
  },
  qualityScore: {
    type: Number,
    required: true
  },
  issues: [
    {
      line: Number,
      type: { type: String }, // Now acts as the 'rule' field if legacy, but ideally replaced by 'rule'
      severity: String, // 'Critical', 'High', 'Medium', 'Low', 'Info'
      category: String, // 'Security', 'Bug', 'Performance', 'Code Smell', 'Complexity'
      rule: String,
      message: String,
      suggestion: String
    }
  ]
});

module.exports = mongoose.model('analysisResult', AnalysisResultSchema);
