// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all users 
 * @param req the request object
 * @param res the response object
 * @category API
 */
async function getAllUsersHandler(req, res) {
  const userToken = req.body.userToken;

  const users = await BACK_END_CONTROLLER.getAllUsers(userToken);

  res.status(200).json({ users: users })
}

export default getAllUsersHandler