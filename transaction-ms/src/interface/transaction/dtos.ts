import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionOperation } from 'src/domain/enum/transaction-operation.enum';

export class CreateTransactionDTO {
  @IsUUID()
  @IsNotEmpty()
  public readonly userId: string;

  @IsEnum(Object.values(TransactionOperation))
  @IsNotEmpty()
  public readonly operation: TransactionOperation;

  @IsInt()
  @IsNotEmpty()
  public readonly amount: number;

  @IsString()
  @IsNotEmpty()
  public readonly originId: string;

  @IsUUID()
  @IsOptional()
  public readonly parentTransactionId: string;
}
