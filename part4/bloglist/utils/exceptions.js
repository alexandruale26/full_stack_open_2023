function PasswordValidation(password, passwordMinLength) {
  let message = `Password validation failed: password (\`${password}\`) is shorter than the minimum allowed length (${passwordMinLength})`;

  if (password === undefined) message = "Password validation failed: `password` is required";

  const error = new Error(message);
  error.name = "PasswordValidationError";

  return error;
}

module.exports = { PasswordValidation };
