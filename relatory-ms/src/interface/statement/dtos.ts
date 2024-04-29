import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateStatementDTO {
  @IsUUID()
  @IsNotEmpty()
  public readonly userId: string;

  @IsUUID()
  @IsNotEmpty()
  public readonly transactionId: string;

  @IsString()
  @IsNotEmpty()
  public readonly operation: string;

  @IsInt()
  @IsNotEmpty()
  public readonly amount: number;
}

export class GetStatementsDTO {
  @IsUUID()
  @IsNotEmpty()
  public readonly userId: string;
}
