import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //check token
  const user = checkToken(req);
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "You don't have permission to access this api",
    });
  }

  //get ids from url
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;
  const rooms = readChatRoomsDB();
  const checkRoomId = rooms.findIndex((x) => x.roomId === roomId);

  //check if roomId exist
  if (checkRoomId === -1) {
    return res.status(404).json({ ok: false, message: "Invalid room id" });
  }
  //check if messageId exist
  const message = rooms[checkRoomId].messages;
  const checkMessageId = message.findIndex((x) => x.messageId === messageId);
  if (checkMessageId === -1) {
    return res.status(404).json({ ok: false, message: "Invalid message id" });
  }

  //check if token owner is admin, they can delete any message
  if (user.isAdmin === true) {
    message.splice(checkMessageId, 1);
    writeChatRoomsDB(rooms);
    return res.status(200).json({ ok: true });
  }
  //or if token owner is normal user, they can only delete their own message!
  if (!user.isAdmin) {
    if (message[checkMessageId].username === user.username) {
      message.splice(checkMessageId, 1);
      writeChatRoomsDB(rooms);
      return res.json({ ok: true });
    } else {
      return res.status(403).json({
        ok: false,
        message: "You do not have permission to access this data",
      });
    }
  }
}
