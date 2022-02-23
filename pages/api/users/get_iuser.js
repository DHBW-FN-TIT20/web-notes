import { SupabaseConnection } from "../supabaseAPI"

const supabaseConnection = new SupabaseConnection();

export default async function handler(req, res) {
  let token = req.body.token;
  
  let iUser = await supabaseConnection.getIUserFromToken(token);

  res.status(200).json({ user: iUser })
}