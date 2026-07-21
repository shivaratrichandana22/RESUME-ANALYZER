import { Router } from 'express';
import { ResumeController } from '../controllers/resumeController.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Route for single file upload and real-time AI analysis
router.post('/upload', upload.single('file'), ResumeController.uploadAndAnalyze);

// Route to get all previously saved reports
router.get('/history', ResumeController.getHistory);

// Route to get a specific analysis report by ID
router.get('/:id', ResumeController.getResumeDetails);

// Route to delete an analysis report by ID
router.delete('/:id', ResumeController.deleteHistory);

// Route to generate and download a markdown formatted analysis report
router.get('/:id/download', ResumeController.downloadReport);

export default router;
