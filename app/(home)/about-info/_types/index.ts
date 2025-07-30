export interface Address {
  road?: string;
  wardNo?: string;
  union?: string;
  postOffice?: string;
  postCode?: number;
  upazila?: string;
  district?: string;
  division?: string;
}

export interface Collaborator {
  name?: string;
  url?: string;
}

export interface Shift {
  shiftName?: string;
  shiftDetails?: string;
}

export interface InstitutionInfo {
  eiin: number;
  nameBn?: string;
  nameEn?: string;
  address?: Address;
  telephone?: string;
  email?: string;
  website?: string;
  totalStudents?: number;
  totalTeachers?: number;
  totalShift?: string;
  institutionType?: string;
  headTeacherName?: string;
  headTeacherPhotoURL?: string;
  collaborator?: Collaborator;
  shifts?: Shift[];
  totalAcre?: number;
  totalBuildings?: number;
  totalClassrooms?: number;
  multimediaClassrooms?: string;
  ictLab?: boolean;
  ictLabCount?: number;
  scienceLab?: boolean;
  scienceLabCount?: number;
}
