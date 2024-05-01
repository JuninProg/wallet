import { ApiProperty } from '@nestjs/swagger';

export class GetStatementRequestDTO {
  @ApiProperty({
    description: 'By default is 1. The pagination current page.',
    example: 1,
    type: 'integer',
    required: false,
    default: 1,
  })
  public readonly page: string;

  @ApiProperty({
    description: 'By default is 10. The pagination items amount.',
    example: 100,
    type: 'integer',
    required: false,
    default: 10,
  })
  public readonly perPage?: string;

  @ApiProperty({
    description: 'To filter statements generated from the date provided.',
    example: '2024-01-01',
    type: 'date',
    required: false,
  })
  public readonly startDate?: string;

  @ApiProperty({
    description: 'To filter statements generated before the date provided.',
    example: '2024-01-02',
    type: 'date',
    required: false,
  })
  public readonly endDate?: string;
}
