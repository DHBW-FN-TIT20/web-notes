// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to check if a user exists
 * @param req the request object
 * @param res the response object
 */
export default async function doesUserExistHandler(req, res) {
  const username = req.body.username;

  const doesUserExist = await BACK_END_CONTROLLER.handleUserAlreadyExists(username);

  res.status(200).json({ wasSuccessfull: doesUserExist })
}