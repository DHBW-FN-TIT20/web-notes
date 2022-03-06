import { BackendController } from "../../../controller/backEndController";
const backendController = new BackendController();

/**
 * Api Route to get the Note of the DB 
 * @param req the request object
 * @param res the response object
 */
async function getNoteHandler(req, res) {
    let note = backendController.getNote(req.body.id);
    res.status(200).json({ note: note });
};
export default getNoteHandler;