export interface ITeacher {
  _id: string;
  createdAt?: string;
  name: string;
  pdsId: string;
  mobile: string;
  photoUrl: string;
  mainDesignation: string;
  designation: string;
  joiningDate: string; // ISO format like "2025-07-26T00:00:00.000Z"
  currentInstitution?: string;
  district: string;
  email?: string | null; // nullable
}

export interface ICommittee {
  _id: string;
  createdAt?: string;
  name: string;
  photoUrl: string;
  designation: string;
  mobile: string;
  email?: string | null; // nullable
  session?: string | null; // nullable
}

export interface IStudent {
  _id: string;
  createdAt?: string;
  name: string;
  academicYear: string;
  shift: string;
  section: string;
  instituteGivenStudentId: string;
  roll: number;
  photoUrl: string;
}

export interface IUser {
  _id: string;
  createdAt?: string;
  phone: string;
  password: string;
  isNeedPassCreate: boolean;
  name: string;
  isOtpVerified: boolean;
}

export interface IResource {
  _id: string;
  title: string;
  description: string;
  pdfUrl: string;
  datetime: string; // ISO 8601 date-time string like "2025-07-26T15:00:00.000Z"
  isPublic: boolean;
  type: "notice" | "downloads";
}

export interface IShiftDetail {
  name: string;
  startTime: string; // Format: "HH:mm" or ISO string
  endTime: string; // Format: "HH:mm" or ISO string
  totalStudents: number;
  totalTeachers: number;
}

export type HeadTeacherType =
  | "principal"
  | "head-teacher"
  | "other_manual_entry";

export interface IInstituteAbout {
  nameBn: string;
  nameEn: string;
  address: string;
  road: string;
  wardNo: string;
  union: string;
  postOffice: string;
  upazila: string;
  zilla: string;
  division: string;
  telephone: string;
  email: string;
  website: string;

  eiin: string;
  totalStudents: number;
  shiftCount: number;
  institutionType: string;

  headTeacherName: string;
  headTeacherType: HeadTeacherType;
  headTeacherPhotoUrl: string;

  collaborator: string;
  collaboratorUrl: string;

  shifts: IShiftDetail[];

  totalLandAcre: number;
  totalBuildings: number;
  totalClassrooms: number;

  hasMultimediaClassroom: boolean;

  hasIctLab: boolean;
  ictLabCount: number;

  hasScienceLab: boolean;
  scienceLabCount: number;

  libraryRoomNumber: string;

  hasAuditorium: boolean;
  hasBorderFacility: boolean;

  historyText: string;
}

export interface IShift {
  _id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  institute_id?: string;
}

export interface ISection {
  _id?: string;
  name: string;
  classId?: string;
  createdAt?: string;
  updatedAt?: string;
  institute_id?: string;
}

export interface IClass {
  _id?: string;
  name: string;
  shiftId: string;
  createdAt?: string; //2025-07-25T23:46:37.151+00:00
  updatedAt?: string; //2025-07-25T23:46:37.151+00:00
  institute_id?: string;
}
