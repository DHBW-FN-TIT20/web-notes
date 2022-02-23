import { SupabaseConnection } from "../supabaseAPI"

const supabaseConnection = new SupabaseConnection();

export default async function handler(req, res) {
  let userID = req.body.userID;
  let username = req.body.username;

  let doesUserExist = await supabaseConnection.doesUserExist({id: userID, name: username})

  res.status(200).json({ wasSuccessfull: doesUserExist })
}