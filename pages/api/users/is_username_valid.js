import { isUsernameValid } from "./requirements";

export default async function handler(req, res) {
  let username = req.body.username;

  let isNameValid = isUsernameValid(username);

  res.status(200).json({ wasSuccessfull: isNameValid })
}