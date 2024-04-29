import { Controller, HttpStatus, Inject } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateStatementDTO, GetStatementsDTO } from './dtos';
import { CreateStatementService } from 'src/app/services/statement/create-statement.service';
import { GetStatementsService } from 'src/app/services/statement/get-statements.service';
@Controller()
export class StatementController {
  @Inject(CreateStatementService)
  private readonly createStatementService: CreateStatementService;

  @Inject(GetStatementsService)
  private readonly getStatementsService: GetStatementsService;

  @EventPattern('transaction_created')
  async transactionRequested(
    @Payload() data: CreateStatementDTO,
    @Ctx() context: RmqContext,
  ) {
    console.log(`transaction_created: ${JSON.stringify(data)}`);
    const channel = context.getChannelRef();
    const message = context.getMessage();

    try {
      await this.createStatementService.execute(data);
    } catch (error) {
      console.error(error);
    }

    channel.ack(message);
  }

  @MessagePattern({ cmd: 'get_statements' })
  async getStatements(data: GetStatementsDTO) {
    const response = await this.getStatementsService.execute(data);

    return {
      status: HttpStatus.OK,
      data: response,
    };
  }
}
