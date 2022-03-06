import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

export default async function isPasswordValidHandler(req, res) {
  const password = req.body.password;

  const isValid = BACK_END_CONTROLLER.isPasswordValid(password);

  console.log(password, isValid)

  res.status(200).json({ wasSuccessfull: isValid })
}