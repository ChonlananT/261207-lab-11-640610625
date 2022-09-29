import { checkToken } from "../../backendLibs/checkToken";
import { readChatRoomsDB } from "../../backendLibs/dbLib";

export default function roomRoute(req, res) {
  const user = checkToken(req);
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "You don't have permission to access this api",
    });
  }
  //create room data and return response
  const chatrooms = readChatRoomsDB();
  const rooms = chatrooms.map((x) => {
    return {
      roomId: x.roomId,
      roomName: x.roomName,
    };
  });

  return res.status(200).json({
    ok: true,
    rooms,
  });
}
