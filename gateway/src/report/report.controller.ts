import {
  Controller,
  Get,
  Inject,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetStatementRequestDTO } from './report.dto';

@ApiTags('Report MS')
@Controller()
export class ReportController {
  constructor(@Inject('REPORT_MS') private client: ClientProxy) {}

  @Get('statement')
  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 201, description: 'Statement generated' })
  @ApiResponse({ status: 400, description: 'Invalid body' })
  async getStatements(
    @Req() request: Request & { user: { id: string } },
    @Res({ passthrough: true }) response: Response,
    @Query() query: GetStatementRequestDTO,
  ) {
    const { data, status, error } = await firstValueFrom(
      this.client.send(
        { cmd: 'get_statements' },
        { userId: request.user.id, ...query },
      ),
    );

    response.status(status);

    return {
      data,
      error,
    };
  }
}
