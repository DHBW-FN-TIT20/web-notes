// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to check if a username is valid
 * @param req the request object
 * @param res the response object
 * @category API
 */
export default async function isUsernameValidHandler(req, res) {
  const username = req.body.username;

  const isNameValid = BACK_END_CONTROLLER.isUsernameValid(username);

  res.status(200).json({ wasSuccessfull: isNameValid })
}