export interface SupportIssue {
  id: string;
  description: string;
  images: {
    id: string;
    name: string;
    size: number;
    type: string;
    dataUrl: string;
  }[];
  reportedAt: string;
  status: 'open' | 'in-progress' | 'resolved';
  reportedBy?: string;
}

export interface SupportStorage {
  issues: Record<string, SupportIssue>;
}

const STORAGE_KEY = 'support-issues';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp'
];

class SupportAdapter {
  private getStorage(): SupportStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { issues: {} };
    } catch (error) {
      console.error('Error reading support data from localStorage:', error);
      return { issues: {} };
    }
  }

  private setStorage(data: SupportStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing support data to localStorage:', error);
      throw new Error('Failed to save support issue');
    }
  }

  validateImage(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size must be less than ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`
      };
    }

    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Only JPEG, PNG, GIF, and WebP images are allowed'
      };
    }

    return { isValid: true };
  }

  async processImage(file: File): Promise<{
    id: string;
    name: string;
    size: number;
    type: string;
    dataUrl: string;
  }> {
    return new Promise((resolve, reject) => {
      const validation = this.validateImage(file);
      if (!validation.isValid) {
        reject(new Error(validation.error));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result as string,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  submitIssue(issue: Omit<SupportIssue, 'id' | 'reportedAt' | 'status'>): SupportIssue {
    const storage = this.getStorage();
    const newIssue: SupportIssue = {
      ...issue,
      id: crypto.randomUUID(),
      reportedAt: new Date().toISOString(),
      status: 'open',
    };

    storage.issues[newIssue.id] = newIssue;
    this.setStorage(storage);
    
    return newIssue;
  }

  getIssues(): SupportIssue[] {
    const storage = this.getStorage();
    return Object.values(storage.issues).sort(
      (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    );
  }

  getIssue(id: string): SupportIssue | null {
    const storage = this.getStorage();
    return storage.issues[id] || null;
  }

  deleteIssue(id: string): void {
    const storage = this.getStorage();
    delete storage.issues[id];
    this.setStorage(storage);
  }

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const supportAdapter = new SupportAdapter();