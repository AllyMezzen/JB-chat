import OpenAI from "openai";

const CURRENT_GPT_MODEL = 'gpt-3.5-turbo'
const DEFAULT_ERROR_STRING = 'Unknown error. Please try again.'

export enum SenderType {
    USER,
    AI
}

export enum MessageType {
    MESSAGE,
    ERROR
}

export type Sender = {
    name: string
    sender: SenderType
}

export interface Message {
    timestampMs: number
    text: string
    sender: Sender
    type: MessageType
}


const client = new OpenAI({
    dangerouslyAllowBrowser: true,
    organization: process.env.REACT_APP_ORGANIZATION_KEY,
    apiKey: process.env.REACT_APP_API_KEY,
});

export const requestGpt = async (inputMessage: string): Promise<Message> => {
    const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: inputMessage }],
        model: CURRENT_GPT_MODEL,
    })
    const message = chatCompletion.choices[0].message.content;
    return buildNewAIMessage(message ? message : DEFAULT_ERROR_STRING)
}

export const buildNewUserMessage = (messageText: string): Message => {
    return {
        timestampMs: Date.now(),
        text: messageText,
        sender: {
            name: "Me",
            sender: SenderType.USER
        },
        type: MessageType.MESSAGE
    }
}

export const buildNewAIMessage = (messageText: string, type: MessageType = MessageType.MESSAGE): Message => {
    return {
        timestampMs: Date.now(),
        text: messageText,
        sender: {
            name: CURRENT_GPT_MODEL,
            sender: SenderType.AI
        },
        type: type
    }
}