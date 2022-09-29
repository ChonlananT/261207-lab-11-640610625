import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "You don't have permission to access this api",
      });
    }
    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    const checkRoomId = rooms.find((x) => x.roomId === roomId);

    //check if roomId exist
    if (checkRoomId === undefined) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }
    //find room and return
    return res.status(200).json({ ok: true, messages: checkRoomId.messages });
  } else if (req.method === "POST") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "You don't have permission to access this api",
      });
    }
    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    //check if roomId exist
    const checkRoomId = rooms.find((x) => x.roomId === roomId);

    if (checkRoomId === undefined) {
      return res.status(400).json({ ok: false, message: "Invalid room id" });
    }
    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //create message
    const newMessage = {
      messageId: uuidv4(),
      text: req.body.text,
      username: user.username,
    };

    checkRoomId.messages.push(newMessage);
    writeChatRoomsDB(rooms);
    return res.status(200).json({ ok: true, message: newMessage });
  }
}
