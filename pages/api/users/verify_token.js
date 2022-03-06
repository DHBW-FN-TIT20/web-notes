import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

export default async function verifyTokenHandler(req, res) {
  const token = req.body.token;

  const isValid = await BACK_END_CONTROLLER.isUserTokenValid(token);

  res.status(200).json({ wasSuccessfull: isValid });
}