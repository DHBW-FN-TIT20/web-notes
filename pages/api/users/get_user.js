// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get a user 
 * @param req the request object
 * @param res the response object
 * @category API
 */
async function getUserHandler(req, res) {
  const token = req.body.token;
  
  const user = await BACK_END_CONTROLLER.handleGetUserFromToken(token);

  res.status(200).json({ user: user })
}

export default getUserHandler;