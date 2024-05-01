import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsOptional,
  IsNumberString,
} from 'class-validator';

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

  @IsDateString()
  @IsOptional()
  public readonly startDate?: string;

  @IsDateString()
  @IsOptional()
  public readonly endDate?: string;

  @IsNumberString()
  @IsOptional()
  public readonly page?: string;

  @IsNumberString()
  @IsOptional()
  public readonly perPage?: string;
}
