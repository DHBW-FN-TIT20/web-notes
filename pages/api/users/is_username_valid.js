import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

export default async function isUsernameValidHandler(req, res) {
  const username = req.body.username;

  const isNameValid = BACK_END_CONTROLLER.isUsernameValid(username);

  res.status(200).json({ wasSuccessfull: isNameValid })
}