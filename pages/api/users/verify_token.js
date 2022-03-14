// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to verify a user token
 * @param req the request object
 * @param res the response object
 * @category API
 */
async function verifyTokenHandler(req, res) {
  const token = req.body.token;

  const isValid = await BACK_END_CONTROLLER.isUserTokenValid(token);

  res.status(200).json({ wasSuccessfull: isValid });
}

export default verifyTokenHandler;