import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/auth/auth.guard';

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
  ) {
    const { data, status, error } = await firstValueFrom(
      this.client.send({ cmd: 'get_statements' }, { userId: request.user.id }),
    );

    response.status(status);

    return {
      data,
      error,
    };
  }
}
