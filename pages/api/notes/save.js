// @ts-check
// import { BackEndController } from "../../../controller/backEndController";

// const BACK_END_CONTROLLER = new BackEndController();

export default async function saveNoteHandler(req, res) {
  const note = req.body.note || "";

  console.log(note);

  setTimeout(() => {
    res.status(200).json({ wasSuccessfull: true });
  }, 600);
}