import { isPasswordValid } from "./requirements";

export default async function handler(req, res) {
  let password = req.body.password;

  let isValid = isPasswordValid(password);

  res.status(200).json({ wasSuccessfull: isValid })
}