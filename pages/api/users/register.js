import { SupabaseConnection } from "../supabaseAPI"

const supabaseConnection = new SupabaseConnection();

export default async function handler(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  let userCreate = await supabaseConnection.registerUser({name: username, password: password})

  res.status(200).json({ wasSuccessfull: userCreate })
}