// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

export default async function registerHandler(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const userCreate = await BACK_END_CONTROLLER.handleRegisterUser(username, password);

  res.status(200).json({ wasSuccessfull: userCreate });
}