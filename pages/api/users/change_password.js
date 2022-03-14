// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to change the password of the user
 * @param req the request object
 * @param res the response object
 * @category API
 */
async function changePasswordHandler(req, res) {
  const userToken = req.body.userToken;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
    
  const wasSuccessfull = await BACK_END_CONTROLLER.handleChangeUserPassword(userToken, oldPassword, newPassword)

  res.status(200).json({ wasSuccessfull: wasSuccessfull });
}

export default changePasswordHandler;