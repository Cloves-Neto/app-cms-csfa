export type SubmissionType = "CONTACT" | "CAREERS" | "ADMISSIONS";
export type SubmissionStatus = "PENDING" | "REVIEWED" | "CONTACTED" | "ARCHIVED";

export interface ContactSubmission {
  id: string;
  type: SubmissionType;
  name: string;
  email: string;
  phone: string;
  subject?: string | null;
  message?: string | null;
  attachmentUrl?: string | null;
  extraData?: string | null;
  status: SubmissionStatus;
  notes?: string | null;
  lastHandledById?: string | null;
  lastHandledByName?: string | null;
  lastHandledByRole?: string | null;
  lastHandledAt?: string | null;
  createdAt: string;
  updatedAt: string;
  history?: ContactSubmissionHistory[];
}

export interface ContactSubmissionHistory {
  id: string;
  submissionId: string;
  status: SubmissionStatus;
  note?: string | null;
  userId?: string | null;
  userName?: string | null;
  userRole?: string | null;
  createdAt: string;
}

export interface ExtraDataParsed {
  studentName?: string;
  birthDate?: string;
  grade?: string;
  linkType?: string;
  linkUrl?: string;
  presentation?: string;
}
