// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to save the note to the database
 * @param req the request object
 * @param res the response object
 * @category API
 */
async function saveNoteHandler(req, res) {
  const note = req.body.note;
  const userToken = req.body.userToken;

  const noteID = await BACK_END_CONTROLLER.saveNote(note, userToken);

  res.status(200).json({ noteID: noteID });
};

export default saveNoteHandler;