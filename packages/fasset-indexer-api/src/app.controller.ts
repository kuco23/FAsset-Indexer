import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FAssetIndexerService } from './app.service'
import { apiResponse, type ApiResponse } from './common/api-response'


@ApiTags("Indexer")
@Controller("api/indexer")
export class FAssetIndexerController {

  constructor(private readonly appService: FAssetIndexerService) {}

  @Get('/total-minted')
  getTotalMinted(): Promise<ApiResponse<string>> {
    return apiResponse(this.appService.totalMinted().then(String), 200)
  }

  @Get('/total-reserved')
  getTotalReserved(): Promise<ApiResponse<string>> {
    return apiResponse(this.appService.totalReserved().then(String), 200)
  }

  @Get('/redemption-requests/:seconds')
  getRedemptionRequests(@Param('seconds') seconds: number): Promise<ApiResponse<string>> {
    return apiResponse(this.appService.redemptionRequestFromSecondsAgo(seconds).then(String), 200)
  }

}
