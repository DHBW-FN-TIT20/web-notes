import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

export default async function doesUserExistHandler(req, res) {
  const username = req.body.username;

  console.log(username)

  const doesUserExist = await BACK_END_CONTROLLER.handleUserAlreadyExists(username);

  console.log(username, doesUserExist)

  res.status(200).json({ wasSuccessfull: doesUserExist })
}