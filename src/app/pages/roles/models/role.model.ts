export interface Role {
  readonly id?: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  isDeleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
