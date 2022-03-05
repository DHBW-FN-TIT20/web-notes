import { BackendController } from "../../../controller/backEndController";
const backendController = new BackendController();
/**
 * Api Route to save the Note to the DB
 * @param req the request object
 * @param res the response object
 */
async function saveNoteHandler(req, res) {

  let note = req.body.note || "";
  console.log(note);


  let wasSuccseful = await backendController.saveNote(note);
  //FIXME
  setTimeout(() => {
    res.status(200).json({ wasSuccessfull: true });
  }, 600);
};
export default saveNoteHandler;