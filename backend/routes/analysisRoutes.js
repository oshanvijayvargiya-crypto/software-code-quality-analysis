const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for file uploads in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// @route   POST /api/analyze
// @desc    Analyze code (file upload or raw text)
// @access  Private
router.post('/analyze', auth, upload.single('file'), analysisController.analyzeCode);

// @route   GET /api/analyses
// @desc    Get all past analyses for user
// @access  Private
router.get('/analyses', auth, analysisController.getAnalyses);

// @route   GET /api/analyses/:id
// @desc    Get specific analysis by ID
// @access  Private
router.get('/analyses/:id', auth, analysisController.getAnalysisById);

// @route   DELETE /api/analyses/:id
// @desc    Delete specific analysis by ID
// @access  Private
router.delete('/analyses/:id', auth, analysisController.deleteAnalysis);

// @route   POST /api/analyses/:id/pdf
// @desc    Download PDF report
// @access  Private
router.post('/analyses/:id/pdf', auth, analysisController.downloadPDF);

module.exports = router;
