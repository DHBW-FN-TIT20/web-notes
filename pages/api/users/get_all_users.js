// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

export default async function getAllUsersHandler(req, res) {
  const userToken = req.body.userToken;

  const users = await BACK_END_CONTROLLER.getAllUsers(userToken);

  res.status(200).json({ users: users })
}