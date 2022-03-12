// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get a note by its id
 * @param req the request object
 * @param res the response object
 * @category API
 */
export default async function getNoteByIDHandler(req, res) {
  const id = req.body.id;
  const userToken = req.body.userToken;

  const note = await BACK_END_CONTROLLER.getNoteByID(userToken, id);

  res.status(200).json({ note: note });
};