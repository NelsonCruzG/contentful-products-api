import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { ReportsGetQueryDto } from './dto/reports-query.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('deleted')
  @ApiOkResponse({
    description: 'Returns an object with the percentage of deleted products',
  })
  deleted() {
    return this.reportsService.deleted();
  }

  @Get('nonDeleted')
  @ApiOkResponse({
    description:
      'Returns an object with the percentage of non-deleted products',
  })
  @ApiBadRequestResponse({
    description:
      'Error on query parameters, returns a message with the error(s)',
  })
  nonDeleted(@Query() filterQueryDto: ReportsGetQueryDto) {
    return this.reportsService.nonDeleted(filterQueryDto);
  }

  @Get('synchronizations')
  @ApiOkResponse({
    description:
      'Returns an object with the percentages of synchronizations by status',
  })
  synchronizations() {
    return this.reportsService.synchronizations();
  }
}
