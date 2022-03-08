// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

export default async function changePasswordHandler(req, res) {
  const userToken = req.body.userToken;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
    
  const wasSuccessfull = await BACK_END_CONTROLLER.handleChangeUserPassword(userToken, oldPassword, newPassword)

  res.status(200).json({ wasSuccessfull: wasSuccessfull });
}