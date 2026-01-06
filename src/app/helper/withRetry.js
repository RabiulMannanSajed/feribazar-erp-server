async function withRetry(operation, retries = 3) {
  while (retries--) {
    try {
      return await operation();
    } catch (e) {
      if (retries <= 0 || !e.message.includes("Write conflict")) throw e;
      console.log("Retrying transaction due to write conflict...");
    }
  }
}
export default withRetry;
