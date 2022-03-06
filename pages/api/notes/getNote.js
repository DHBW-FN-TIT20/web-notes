// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get the Note of the DB 
 * @param req the request object
 * @param res the response object
 */
async function getNoteHandler(req, res) {
  const id = req.body.id;

  const note = BACK_END_CONTROLLER.getNote(id);

  res.status(200).json({ note: note });
};
export default getNoteHandler;