import { Exclude } from 'class-transformer';

interface UserProps {
  id?: string;
  name?: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class User {
  id?: string;
  name?: string;
  email: string;

  @Exclude()
  password: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(props: UserProps) {
    Object.assign(this, props);
  }
}
