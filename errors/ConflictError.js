class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.ststusCode = 409;
  }
}

module.exports = ConflictError;
