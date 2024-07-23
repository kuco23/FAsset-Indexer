import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { FAssetIndexerService } from './app.service'
import { apiResponse, type ApiResponse } from './common/api-response'
import type { LiquidationPerformed, FullLiquidationStarted, ChartData } from 'fasset-indexer-core'
import { exit } from 'process'


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

  @Get('/redemption-requests?')
  getRedemptionRequests(@Query('seconds') seconds: number): Promise<ApiResponse<number>> {
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

  @Get('/total-redemption-requesters')
  getTotalRedemptionRequesters(): Promise<ApiResponse<number>> {
    return apiResponse(this.appService.totalRedemptionRequesters(), 200)
  }

  @Get('/total-collateral-reservers')
  getTotalCollateralReservers(): Promise<ApiResponse<number>> {
    return apiResponse(this.appService.totalCollateralReservers(), 200)
  }

  // Liquidations

  @Get('/liquidations')
  getPerformedLiquidations(): Promise<ApiResponse<LiquidationPerformed[]>> {
    return apiResponse(this.appService.liquidations(), 200)
  }

  @Get('/full-liquidations')
  getFullLiquidations(): Promise<ApiResponse<FullLiquidationStarted[]>> {
    return apiResponse(this.appService.fullLiquidations(), 200)
  }

  @Get('/liquidators')
  getLiquidators(): Promise<ApiResponse<number>> {
    return apiResponse(this.appService.totalLiquidators(), 200)
  }

  //////////////////////////////////////////////////////////////////////////////
  // agents

  @Get('/agent-minting-executed-count?')
  getAgentMintingExecutedCount(@Query('agent') agent: string): Promise<ApiResponse<number>> {
    console.log(agent)
    return apiResponse(this.appService.agentMintingExecutedCount(agent), 200)
  }

  @Get('/agent-redemption-request-count?')
  getAgentRedemptionRequestCount(@Query('agent') agent: string): Promise<ApiResponse<number>> {
    return apiResponse(this.appService.agentRedemptionRequestCount(agent), 200)
  }

  @Get('/agent-redemption-performed-count?')
  getAgentRedemptionPerformedCount(@Query('agent') agent: string): Promise<ApiResponse<number>> {
    return apiResponse(this.appService.agentRedemptionPerformedCount(agent), 200)
  }

  @Get('/agent-redemption-success-rate?')
  getAgentRedemptionSuccessRate(@Query('agent') agent: string): Promise<ApiResponse<number>> {
    return apiResponse(this.appService.agentRedemptionSuccessRate(agent), 200)
  }

  @Get('/agent-liquidation-count?')
  getAgentLiquidationCount(@Query('agent') agent: string): Promise<ApiResponse<number>> {
    return apiResponse(this.appService.agentLiquidationCount(agent), 200)
  }

  @Get('/minting-executed-with-executor?')
  mintingExecutedWithExecutor(@Query('executor') executor: string): Promise<ApiResponse<number>> {
    return apiResponse(this.appService.executorMintingPerformed(executor), 200)
  }

  @Get('/total-minting-executions?')
  totalMintingExecutions(): Promise<ApiResponse<number>> {
    return apiResponse(this.appService.totalMintingExecutions(), 200)
  }

  ////////////////////////////////////////////////////////////////////////////
  // custom

  @Get('/redemption-request-count-chart-data?')
  getRedemptionRequestCountChartData(
    @Query('historySeconds') history: number,
    @Query('stepSeconds') step: number
  ): Promise<ApiResponse<ChartData>> {
    const now = Math.floor(Date.now() / 1000)
    history = Number(history)
    step = Number(step)
    return apiResponse(this.appService.redemptionRequestChartData(now - history, now, step), 200)
  }

  @Get('/redemption-default-count-chart-data?')
  getRedemptionDefaultCountChartData(
    @Query('historySeconds') history: number,
    @Query('stepSeconds') step: number
  ): Promise<ApiResponse<ChartData>> {
    history = Number(history)
    step = Number(step)
    const now = Math.floor(Date.now() / 1000)
    return apiResponse(this.appService.redemptionDefaultChartData(now - history, now, step), 200)
  }

  @Get('/redemption-performed-count-chart-data?')
  getRedemptionPerformedCountChartData(
    @Query('historySeconds') history: number,
    @Query('stepSeconds') step: number
  ): Promise<ApiResponse<ChartData>> {
    history = Number(history)
    step = Number(step)
    const now = Math.floor(Date.now() / 1000)
    return apiResponse(this.appService.redemptionPerformedChartData(now - history, now, step), 200)
  }

  @Get('/redemption-requests-by-executor-chart-data')
  getRedemptionRequestsByExecutorChartData(
    @Query('executor') executor: string,
    @Query('historySeconds') history: number,
    @Query('stepSeconds') step: number
  ): Promise<ApiResponse<ChartData>> {
    history = Number(history)
    step = Number(step)
    const now = Math.floor(Date.now() / 1000)
    return apiResponse(this.appService.redemptionRequestsWithExecutorChartData(executor, now - history, now, step), 200)
  }
}
