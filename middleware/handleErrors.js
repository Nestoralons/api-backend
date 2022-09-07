const ERROR_HANDLERS = {
  CastError: (response) =>
    response.status(400).send({ error: "Id used is malformed" }),
  JsonWebTokenError: (response) =>
    response.status(401).json({ error: "token invalid" }),
  ValidationError: (response, error) =>
    response.status(409).send({ error: error.message }),
  TokenExpiredError: (response) =>
    response.status(401).json({ error: "token expired" }),
  defaulError: (response) => response.status(500).end(),
};

module.exports = (error, request, response, next) => {
  const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaulError;
  handler(response, error);
};
