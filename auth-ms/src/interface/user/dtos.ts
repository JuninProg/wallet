import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetUserDTO {
  @IsUUID()
  @IsNotEmpty()
  public readonly id: string;
}
