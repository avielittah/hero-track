export interface UnitData {
  id: string;
  title: string;
  objective: string;
  background?: string;
  estimatedTime: number; // in minutes
  content: {
    type: 'text' | 'video' | 'link';
    data: string;
  };
  task: {
    type: 'multiple-choice' | 'open-question' | 'checkbox' | 'file-upload';
    question: string;
    options?: string[]; // for multiple choice and checkbox
    allowMultiple?: boolean; // for multiple choice
    required?: boolean;
  };
  response?: {
    answer: any;
    feedback: {
      rating: number; // 1-5
      comment: string; // ≤200 chars
    };
  };
  status: 'draft' | 'submitted';
  submittedAt?: string;
  lastSaved?: string;
}

export interface UnitStorage {
  drafts: Record<string, UnitData>;
  submitted: Record<string, UnitData>;
}

const STORAGE_KEY = 'micro-learning-units';

class PersistAdapter {
  private getStorage(): UnitStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { drafts: {}, submitted: {} };
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return { drafts: {}, submitted: {} };
    }
  }

  private setStorage(data: UnitStorage): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      throw new Error('Failed to save data');
    }
  }

  saveDraft(unitData: UnitData): void {
    const storage = this.getStorage();
    const updatedUnit = {
      ...unitData,
      status: 'draft' as const,
      lastSaved: new Date().toISOString(),
    };
    
    storage.drafts[unitData.id] = updatedUnit;
    this.setStorage(storage);
  }

  submitUnit(unitData: UnitData): void {
    const storage = this.getStorage();
    const submittedUnit = {
      ...unitData,
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
    };
    
    // Move from drafts to submitted
    delete storage.drafts[unitData.id];
    storage.submitted[unitData.id] = submittedUnit;
    this.setStorage(storage);
  }

  getUnit(id: string): UnitData | null {
    const storage = this.getStorage();
    return storage.drafts[id] || storage.submitted[id] || null;
  }

  getDrafts(): UnitData[] {
    const storage = this.getStorage();
    return Object.values(storage.drafts);
  }

  getSubmitted(): UnitData[] {
    const storage = this.getStorage();
    return Object.values(storage.submitted);
  }

  getAllUnits(): UnitData[] {
    return [...this.getDrafts(), ...this.getSubmitted()];
  }

  deleteUnit(id: string): void {
    const storage = this.getStorage();
    delete storage.drafts[id];
    delete storage.submitted[id];
    this.setStorage(storage);
  }

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const persistAdapter = new PersistAdapter();