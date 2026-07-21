import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export class ParserService {
  /**
   * Extracts text from a PDF Buffer
   */
  public static async parsePDF(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      if (!data || !data.text) {
        throw new Error('PDF parsing resulted in empty text');
      }
      return data.text;
    } catch (error: any) {
      console.error('Error parsing PDF:', error);
      throw new Error(`Failed to extract text from PDF: ${error.message || error}`);
    }
  }

  /**
   * Extracts text from a Word (DOCX) Buffer
   */
  public static async parseDOCX(buffer: Buffer): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      if (!result || !result.value) {
        throw new Error('Mammoth parsing resulted in empty text');
      }
      return result.value;
    } catch (error: any) {
      console.error('Error parsing DOCX:', error);
      throw new Error(`Failed to extract text from DOCX: ${error.message || error}`);
    }
  }
}
