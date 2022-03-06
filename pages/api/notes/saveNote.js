// @ts-check
import { BackEndController } from "../../../controller/backEndController";

const BACK_END_CONTROLLER = new BackEndController();

/**
 * Api Route to save the Note to the DB
 * @param req the request object
 * @param res the response object
 */
async function saveNoteHandler(req, res) {
  const note = req.body.note || "";
  
  console.log(note);

  const wasSuccseful = await BACK_END_CONTROLLER.saveNote(note);
  //FIXME
  setTimeout(() => {
    res.status(200).json({ wasSuccessfull: wasSuccseful });
  }, 600);
};
export default saveNoteHandler;