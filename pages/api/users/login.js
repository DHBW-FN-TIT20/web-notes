// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to log in a user
 * @param req the request object
 * @param res the response object
 * @category API
 */
async function loginHandler(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const token = await BACK_END_CONTROLLER.handleLoginUser(username, password);

  res.status(200).json({ userToken: token })
}

export default loginHandler;