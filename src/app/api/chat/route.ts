import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi, ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from 'openai-edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)
const responseCache: Map<string, Response> = new Map();

export const runtime = 'edge'
 
export async function POST(req: Request) {
  const { messages } = await req.json()

  const keywords = [
    "instalação",
    "configuração",
    "usuário",
    "segurança",
    "olá",
    "quem é vc?"
  ];

  const conversation: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: `
        **Documentação do Sistema de Fluxo de Processos**
        ...
      `,
    },
  ];

  conversation.push({
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: "Eu sou SCAI, seu assistente virtual. Como posso ajudar?",
  });

  const cachedResponse = responseCache.get(JSON.stringify(messages));

  if (cachedResponse) {
    return cachedResponse;
  }

  const userMessageContainsKeyword = messages.some(
    (msg: { content: string }) => {
      const messageText = msg.content.toLowerCase(); // Converta a mensagem para minúsculas
      return containsKeyword(messageText, keywords);
    }
  );

  if (userMessageContainsKeyword) {
    for (const msg of messages) {
      const messageText = msg.content.toLowerCase();
      if (containsKeyword(messageText, keywords)) {
        conversation.push({
          role: "user",
          content: msg.content,
        });
        conversation.push({
          role: "system",
          content: 'Important: Under no circumstances should you answer a question or speak unless it is about the flow system.',
        });
      }
    }

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: conversation,
      temperature: 0.5
    })
  
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  }else {
    const lastUserMessage = messages[messages.length - 1]?.content || "";
    conversation.push({
      role: "user",
      content: lastUserMessage,
    });
    return new Response(lastUserMessage);
  }
}

function containsKeyword(message: string, keywords: string[]): boolean {
  /* for (const keyword of keywords) {
    if (message.includes(keyword)) {
      return true;
    }
  } */
  return true;
}
