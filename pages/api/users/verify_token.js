import { SupabaseConnection } from "../supabaseAPI";

const supabaseConnection = new SupabaseConnection();

export default async function handler(req, res) {
  let token = req.body.token;
  let isValid = await supabaseConnection.isUserTokenValid(token);

  res.status(200).json({ wasSuccessfull: isValid });
}