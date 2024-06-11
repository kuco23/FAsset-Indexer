const SLEEP_BEFORE_RETRY_MS = 1000

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function retryUntilSuccess<T>(fn: () => Promise<T>, maxRetries = 5): Promise<T> {
  let retries = 0
  while (retries < maxRetries) {
    try {
      return await fn()
    } catch (err) {
      await sleep(SLEEP_BEFORE_RETRY_MS)
      retries++
    }
  }
  throw new Error("Failed to execute function after multiple retries")
}