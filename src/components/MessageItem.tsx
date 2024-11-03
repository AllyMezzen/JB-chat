import { MarkdownItem } from "./MarkdownItem";
import { formatMsTimestamp } from "../utils/DateTimeUtils";
import { SenderType, Message, MessageType } from "../api/ChatGptApi";
import Avatar from "@jetbrains/ring-ui-built/components/avatar/avatar";
import { Size } from "@jetbrains/ring-ui-built/components/avatar/avatar";


export const MessageItem = (message: Message) => {
    const formatSender = () => (message.sender.sender === SenderType.USER ? "★ " : '') + message.sender.name;


    const getBody = () => {
        if (message.type === MessageType.ERROR) {
            return <span className="message-error">{message.text}</span>
        } else {
            return MarkdownItem({ text: message.text })
        }
    }
    return (
        <div className={"message-block " + (message.sender.sender === SenderType.USER ? "message-mine" : '')}>
            <p className="message-paragraph">
                <span className="message-datetime">{formatMsTimestamp(message.timestampMs) + " "}</span>
                <div><Avatar className="message-avatar" size={Size.Size18} username={message.sender.name} /><strong>{formatSender()}</strong> </div>
            </p>
            {getBody()}
        </div>);
}