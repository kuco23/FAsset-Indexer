import { Controller, Get, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FAssetIndexerService } from './app.service'
import { apiResponse, type ApiResponse } from './common/api-response'


@ApiTags("Indexer")
@Controller("api/indexer")
export class FAssetIndexerController {

  constructor(private readonly appService: FAssetIndexerService) {}

  @Get('/current-block')
  getCurrentBlock(): Promise<ApiResponse<number | null>> {
    return apiResponse(this.appService.currentBlock(), 200)
  }

  @Get('/total-minted')
  getTotalMinted(): Promise<ApiResponse<string>> {
    return apiResponse(this.appService.totalMinted().then(String), 200)
  }

  @Get('/total-reserved')
  getTotalReserved(): Promise<ApiResponse<string>> {
    return apiResponse(this.appService.totalReserved().then(String), 200)
  }

  @Get('/redemption-requests/:seconds')
  getRedemptionRequests(@Param('seconds') seconds: number): Promise<ApiResponse<number>> {
    return apiResponse(this.appService.redemptionRequestFromSecondsAgo(seconds), 200)
  }

  @Get('/total-minting-defaulted')
  getTotalMintingDefaulted(): Promise<ApiResponse<string>> {
    return apiResponse(this.appService.totalMintingDefaulted().then(String), 200)
  }

  @Get('/total-redemption-requested')
  getTotalRedemptionRequested(): Promise<ApiResponse<string>> {
    return apiResponse(this.appService.totalRedemptionRequested().then(String), 200)
  }

  @Get('/total-redeemed')
  getTotalRedeemed(): Promise<ApiResponse<string>> {
    return apiResponse(this.appService.totalRedeemed().then(String), 200)
  }

}
