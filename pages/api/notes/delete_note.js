// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to delete the note from the database
 * @param req the request object
 * @param res the response object
 * @category API
 */
async function saveNoteHandler(req, res) {
  const noteID = req.body.id;
  const userToken = req.body.userToken;

  const wasSuccessfull = await BACK_END_CONTROLLER.deleteNote(noteID, userToken);

  res.status(200).json({ wasSuccessfull: wasSuccessfull });
};

export default saveNoteHandler;