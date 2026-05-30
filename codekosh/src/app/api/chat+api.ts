import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY || '';
const mistral = new Mistral({ apiKey });

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { messages, snippet } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const systemPrompt = {
      role: 'system',
      content: `You are an expert programming assistant. Assist the user with this code snippet:\n\nLanguage: ${snippet?.language || 'Unknown'}\nCode:\n${snippet?.code || ''}`
    };

    const formattedMessages = [
      systemPrompt,
      ...messages.map((m: any) => ({
        role: m.role || (m.sender === 'user' ? 'user' : 'assistant'),
        content: m.content || m.text || '',
      }))
    ];

    const responseStream = await mistral.chat.stream({
      model: 'mistral-tiny',
      messages: formattedMessages,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of responseStream) {
          const text = (chunk as any).data?.choices?.[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error in Mistral Chat API Route:', error);
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
