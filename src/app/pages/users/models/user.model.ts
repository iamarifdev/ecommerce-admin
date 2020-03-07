export interface User extends Document {
  id: any;
  companyId?: string;
  roleId: string;
  username: string;
  password: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  fullName: string;
  email: string;
  phoneNumbers: PhoneNumber[];
  contactPerson?: string;
  contactNo?: string;
  addresses: Address[];
  remarks: string;
  avatarUrl?: string;
  isEnabled?: boolean;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  createdAt: Date;
  updateddAt: Date;
}

export interface PhoneNumber {
  phoneNo: string;
}

export interface Address {
  district: string;
  thana: string;
  postCode: string;
  description: string;
}
