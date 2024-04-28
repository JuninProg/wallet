import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionRequestDTO {
  @ApiProperty({
    enum: ['deposit', 'withdraw', 'purchase', 'reversal', 'cancel'],
    example: 'deposit',
    description: 'For which operation the transaction must be created',
    required: true,
  })
  public readonly operation: string;
  @ApiProperty({
    description:
      'The amount of transaction using an Integer for representation, consider the last two digits as decimal places. Example: "2000", refers to "20.00".',
    example: 2000,
    type: 'integer',
    required: true,
  })
  public readonly amount: number;
  @ApiProperty({
    description:
      'An ID used as reference of the Transaction origin to avoid duplications.',
    example: '1deb0188-36ce-43f3-ac71-c2c503c05c35',
    type: 'string',
    required: true,
  })
  public readonly originId: string;
  @ApiProperty({
    description:
      'ID of parent Transaction, used for REVERSAL and CANCEL operations.',
    example: '1deb0188-36ce-43f3-ac71-c2c503c05c35',
    type: 'string',
    required: false,
  })
  public readonly parentTransactionId: string;
}
