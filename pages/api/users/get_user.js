import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

export default async function getUserHandler(req, res) {
  const token = req.body.token;
  
  const user = await BACK_END_CONTROLLER.handleGetUserFromToken(token);

  res.status(200).json({ user: user })
}