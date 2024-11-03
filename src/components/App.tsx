import { useRef, useState } from 'react';
import { Input, Size } from '@jetbrains/ring-ui-built/components/input/input'
import { Button } from '@jetbrains/ring-ui-built/components/button/button'
import List from "@jetbrains/ring-ui-built/components/list/list";
import Panel from "@jetbrains/ring-ui-built/components/panel/panel";
import '../styles/App.css'
import '../styles/media.css'
import { Type } from "@jetbrains/ring-ui-built/components/list/consts";
import magicWand from '@jetbrains/icons/magic-wand';
import Loader from '@jetbrains/ring-ui-built/components/loader-inline/loader-inline'
import { buildNewAIMessage, buildNewUserMessage, Message, MessageType, requestGpt } from "../api/ChatGptApi";
import { MessageItem } from './MessageItem';
import Cat from '../assets/cat.png'
import { ControlsHeight } from '@jetbrains/ring-ui-built/components/global/controls-height';



export const App = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setLoading] = useState(false)

  const chatListRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async (messageText: string) => {
    if (messageText.trim() === '') return
    setLoading(true)
    setInputMessage('')
    await processNewMessageInput(messageText)
    setLoading(false)
  }

  const processNewMessageInput = async (messageText: string) => {
    try {
      setMessages((prev) => [...prev, buildNewUserMessage(messageText)])
      scrollToBottom()
      const chatGptMessage = await requestGpt(messageText)
      setMessages((prev) => [...prev, chatGptMessage])
      scrollToBottom()
    } catch (e: any) {
      setMessages((prev) => [...prev, buildNewAIMessage("Sorry, something went wrong!", MessageType.ERROR)])
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => chatListRef.current?.scrollTo({ top: chatListRef.current?.scrollHeight, behavior: 'smooth' }), 10);
  };

  const processMessages = () => messages.map((message => {
    return {
      key: message.timestampMs,
      template: MessageItem(message),
      rgItemType: Type.CUSTOM,
    }
  }))

  return (
    <div className="chat-container">
      <div className="message-list" ref={chatListRef}>
        <List
          data={processMessages()}
        />
        {isLoading && <Loader />}
        {!messages.length &&
          <div className='message-greeting'>
            <span className='message-greeting_text'>Hi, my Friend! Feel free to write me.</span>
            <img className='message-greeting_img' src={Cat} alt='Friendly cat'></img>
          </div>
        }
      </div>
      <Panel className={"input-panel " + (messages.length !== 0 ? "input-sticky" : "")}>
        <div className="input-container">
          <Input
            height={ControlsHeight.L}
            size={Size.L}
            icon={magicWand}
            className="message-input"
            value={inputMessage}
            onChange={(event) => setInputMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSendMessage(inputMessage)
              }
            }}
            placeholder="Type a message..."
          />
          <Button
            height={ControlsHeight.L}
            onClick={() => handleSendMessage(inputMessage)}
            disabled={isLoading}
            primary
          >
            Send
          </Button>
        </div>
      </Panel>
    </div>
  )
}

