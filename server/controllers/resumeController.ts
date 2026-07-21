import { Request, Response } from 'express';
import { ParserService } from '../services/parserService.js';
import { GeminiService } from '../services/geminiService.js';
import { db } from '../config/db.js';

export class ResumeController {
  /**
   * POST /api/resume/upload
   * Receives a file, extracts its text, analyzes with Gemini, and saves the report
   */
  public static async uploadAndAnalyze(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const { originalname, mimetype, buffer } = req.file;
      let rawText = '';
      let fileType = 'unknown';

      // 1. Extract text from document buffer
      if (mimetype === 'application/pdf') {
        rawText = await ParserService.parsePDF(buffer);
        fileType = 'pdf';
      } else if (
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        rawText = await ParserService.parseDOCX(buffer);
        fileType = 'docx';
      } else {
        res.status(400).json({ error: 'Invalid file format. Please upload a PDF or DOCX file.' });
        return;
      }

      if (!rawText || rawText.trim().length === 0) {
        res.status(422).json({ error: 'Could not extract any text from the uploaded file.' });
        return;
      }

      // 2. Perform AI-powered resume analysis
      const analysis = await GeminiService.analyzeResume(rawText, originalname);

      // 3. Save report to the database
      const resumeAnalysis = {
        id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        filename: originalname,
        fileType,
        uploadedAt: new Date().toISOString(),
        rawText,
        analysis,
      };

      await db.save(resumeAnalysis);

      res.status(200).json({
        message: 'Analysis completed successfully',
        data: resumeAnalysis,
      });
    } catch (error: any) {
      console.error('Error in uploadAndAnalyze:', error);
      res.status(500).json({
        error: error.message || 'An error occurred during resume processing.',
      });
    }
  }

  /**
   * GET /api/resume/history
   * Retrieves all previously saved resume analysis reports
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const history = await db.findMany();
      res.status(200).json({ data: history });
    } catch (error: any) {
      console.error('Error in getHistory:', error);
      res.status(500).json({ error: 'Failed to retrieve analysis history.' });
    }
  }

  /**
   * GET /api/resume/:id
   * Retrieves details for a specific analysis report
   */
  public static async getResumeDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const report = await db.findById(id);

      if (!report) {
        res.status(404).json({ error: 'Resume analysis report not found' });
        return;
      }

      res.status(200).json({ data: report });
    } catch (error: any) {
      console.error('Error in getResumeDetails:', error);
      res.status(500).json({ error: 'Failed to retrieve report details.' });
    }
  }

  /**
   * DELETE /api/resume/:id
   * Deletes a specific resume analysis report from history
   */
  public static async deleteHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await db.deleteById(id);

      if (!deleted) {
        res.status(404).json({ error: 'Resume analysis report not found' });
        return;
      }

      res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error: any) {
      console.error('Error in deleteHistory:', error);
      res.status(500).json({ error: 'Failed to delete report.' });
    }
  }

  /**
   * GET /api/resume/:id/download
   * Formats and returns a downloadable text/markdown report of the analysis
   */
  public static async downloadReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const report = await db.findById(id);

      if (!report) {
        res.status(404).json({ error: 'Resume analysis report not found' });
        return;
      }

      const { analysis, filename } = report;
      const safeName = filename.replace(/\.(pdf|docx)$/i, '');

      // Construct a premium text/markdown report
      let markdown = `# AI RESUME ANALYSIS REPORT: ${analysis.personalInfo.name || safeName}
Generated on: ${new Date(report.uploadedAt).toLocaleString()}
File analyzed: ${filename}

============================================================
SCORE OVERVIEW
============================================================
* Overall ATS Score:     ${analysis.atsScore}/100
* Visual/Resume Score:   ${analysis.resumeScore}/100
* Formatting Score:      ${analysis.formattingScore}/100

============================================================
PROFESSIONAL SUMMARY & FEEDBACK
============================================================
${analysis.professionalSummary}

============================================================
KEYWORD DENSITY & FINDINGS
============================================================
Keywords parsed from resume:
${analysis.keywordDensity.map((k: any) => `- ${k.keyword}: found ${k.count} times (${k.percentage}%)`).join('\n')}

============================================================
CRITICAL MISSING SKILLS (ATS GAP ANALYSIS)
============================================================
The ATS system flagged these missing skills for your industry sector:
${analysis.missingSkills.map((s: string) => `- ${s}`).join('\n')}

============================================================
GRAMMAR & WRITING SUGGESTIONS
============================================================
${analysis.grammarSuggestions.length === 0 ? 'No critical grammatical issues detected!' : 
  analysis.grammarSuggestions.map((g: any, i: number) => `${i + 1}. ORIGINAL: "${g.original}"
   SUGGESTION: "${g.suggestion}"
   EXPLANATION: ${g.explanation}`).join('\n\n')}

============================================================
ACTION VERBS DETECTED
============================================================
${analysis.actionVerbs.join(', ')}

============================================================
RECOMMENDED STRATEGIC IMPROVEMENTS
============================================================
${analysis.improvements.map((imp: string, i: number) => `${i + 1}. ${imp}`).join('\n')}

============================================================
EXTRACTED RECONSTRUCTED DATA
============================================================
* Email: ${analysis.personalInfo.email}
* Phone: ${analysis.personalInfo.phone}
* GitHub: ${analysis.personalInfo.github || 'Not specified'}
* LinkedIn: ${analysis.personalInfo.linkedin || 'Not specified'}
* Portfolio: ${analysis.personalInfo.portfolio || 'Not specified'}

* Extracted Skills:
  ${analysis.skills.join(', ')}

* Education:
  ${analysis.education.map((edu: any) => `- ${edu.institution} | ${edu.degree} (${edu.year})`).join('\n  ')}

* Experience Summary:
  ${analysis.experience.map((exp: any) => `- ${exp.role} at ${exp.company} (${exp.duration})`).join('\n  ')}

* Reconstructed Projects:
  ${analysis.projects.map((proj: any) => `- ${proj.title} | Tech: ${proj.technologies.join(', ')}`).join('\n  ')}

============================================================
End of Report. Produced by AI Resume Analyzer.
`;

      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="${safeName}_AI_Report.md"`);
      res.send(markdown);
    } catch (error: any) {
      console.error('Error in downloadReport:', error);
      res.status(500).json({ error: 'Failed to generate downloadable report.' });
    }
  }
}
