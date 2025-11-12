const success = (res, data = {}, status = 200) =>
  res.status(status).json(data);

const error = (res, status = 500, message = "Something went wrong", details) =>
  res
    .status(status)
    .json({
      error: message,
      ...(details ? { details } : {}),
    });

const notImplemented = (res, feature = "Endpoint") =>
  error(res, 501, `${feature} not implemented yet.`);

const createHttpError = (status, message, details) => {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  return err;
};

module.exports = {
  success,
  error,
  notImplemented,
  createHttpError,
};
