import axios from 'axios';

const API_BASE = '/api/resume';

export interface IResumeReport {
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
      github?: string | null;
      linkedin?: string | null;
      portfolio?: string | null;
    };
    skills: string[];
    education: Array<{
      institution: string;
      degree: string;
      year: string;
      gpa?: string | null;
      details?: string | null;
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

export class ResumeApi {
  /**
   * Uploads a resume and runs AI analysis
   */
  public static async uploadResume(
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<IResumeReport> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    return response.data.data;
  }

  /**
   * Retrieves all resume analysis reports from history
   */
  public static async getHistory(): Promise<IResumeReport[]> {
    const response = await axios.get(`${API_BASE}/history`);
    return response.data.data;
  }

  /**
   * Retrieves a specific report by its ID
   */
  public static async getDetails(id: string): Promise<IResumeReport> {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data.data;
  }

  /**
   * Deletes a report from history
   */
  public static async deleteReport(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/${id}`);
  }

  /**
   * Triggers browser download of the report in markdown format
   */
  public static downloadReportUrl(id: string): string {
    return `${API_BASE}/${id}/download`;
  }
}
