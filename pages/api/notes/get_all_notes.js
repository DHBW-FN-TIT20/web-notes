// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to get all notes which are related to the user from the database
 * @param req the request object
 * @param res the response object
 */
async function getNotesHandler(req, res) {
  const id = req.body.id;
  const userToken = req.body.userToken;

  const notes = await BACK_END_CONTROLLER.getNotes(userToken);

  res.status(200).json({ notes: notes });
};
export default getNotesHandler;