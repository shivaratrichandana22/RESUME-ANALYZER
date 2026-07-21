import fs from 'fs';
import path from 'path';

// Local storage path for fallback JSON database
const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'db.json');

// Interface for saved resume analysis
export interface IResumeAnalysis {
  id: string;
  filename: string;
  fileType: string;
  uploadedAt: string;
  rawText: string;
  analysis: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      github?: string;
      linkedin?: string;
      portfolio?: string;
    };
    skills: string[];
    education: Array<{
      institution: string;
      degree: string;
      year: string;
      gpa?: string;
      details?: string;
    }>;
    experience: Array<{
      company: string;
      role: string;
      duration: string;
      description: string;
    }>;
    projects: Array<{
      title: string;
      description: string;
      technologies: string[];
    }>;
    certifications?: string[];
    languages?: string[];
    atsScore: number;
    resumeScore: number;
    formattingScore: number;
    keywordDensity: Array<{ keyword: string; count: number; percentage: number }>;
    missingSkills: string[];
    grammarSuggestions: Array<{ original: string; suggestion: string; explanation: string }>;
    actionVerbs: string[];
    resumeLength: {
      pages: number;
      words: number;
      feedback: string;
    };
    professionalSummary: string;
    improvements: string[];
  };
}

class LocalDB {
  private data: { resumes: IResumeAnalysis[] } = { resumes: [] };

  constructor() {
    this.init();
  }

  private init() {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE_PATH)) {
      this.saveFile();
    } else {
      try {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf8');
        this.data = JSON.parse(fileContent);
        if (!this.data.resumes) {
          this.data.resumes = [];
        }
      } catch (err) {
        console.error('Error reading JSON fallback DB, resetting:', err);
        this.data = { resumes: [] };
        this.saveFile();
      }
    }
  }

  private saveFile() {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf8');
  }

  public async save(resume: IResumeAnalysis): Promise<IResumeAnalysis> {
    const index = this.data.resumes.findIndex((r) => r.id === resume.id);
    if (index >= 0) {
      this.data.resumes[index] = resume;
    } else {
      this.data.resumes.push(resume);
    }
    this.saveFile();
    return resume;
  }

  public async findMany(): Promise<IResumeAnalysis[]> {
    return [...this.data.resumes].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  public async findById(id: string): Promise<IResumeAnalysis | null> {
    return this.data.resumes.find((r) => r.id === id) || null;
  }

  public async deleteById(id: string): Promise<boolean> {
    const initialLen = this.data.resumes.length;
    this.data.resumes = this.data.resumes.filter((r) => r.id !== id);
    this.saveFile();
    return this.data.resumes.length < initialLen;
  }
}

export const db = new LocalDB();
