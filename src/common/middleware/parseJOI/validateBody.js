const validateBody = (schema) => (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).send({
      success: false,
      statusCode: 400,
      message: "Validation failed: request body is required",
    });
    return;
  }

  const result = schema.safeParse(req.body);

  if (!result.success) {
    res.status(400).send({
      success: false,
      statusCode: 400,
      message: "Validation failed",
      errors:
        process.env.NODE_ENV === "development" ? result.error.issues : null,
    });
    return;
  }

  // Zod returns parsed & sanitized data
  req.body = result.data;
  next();
};

export default validateBody;
