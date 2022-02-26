// import { SupabaseConnection } from "../supabaseAPI";

// const supabaseConnection = new SupabaseConnection();

export default async function handler(req, res) {

  let note = req.body.note || "";
  console.log(note);

  setTimeout(() => {
    res.status(200).json({ wasSuccessfull: true });
  }, 600);
}