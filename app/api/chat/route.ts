import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  console.log('Received messages are:', messages);

  const context = `
    We Have two main gates for CEG
    1) Kotturpuram entry
    2) main gate entry

    Timings of the college:
    8:30 AM to 4:30 PM
    `;

  //TODO TASK 1 - System
  const systemPrompt = `You are a helpful assistant for CEG students and for Timetable. Use the following context to answer questions about the college. If you don't know the answer, say you don't know. Context: ${context}
  
  You have access to the getTimeTable tool to retrieve class schedules. When students ask about timetables, class schedules, or class timings, use the getTimeTable tool with the appropriate class number (1-4) and batch (A or B) to fetch the latest schedule.
  `;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),

    //TODO TASK 2 - Tool Calling
    tools,            // Uncomment to enable tool calling
  });

  return result.toUIMessageStreamResponse();
}
