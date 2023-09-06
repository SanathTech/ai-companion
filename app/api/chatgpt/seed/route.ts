import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } = body;
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `create a sample conversation between myself as "Human", and ${name}, ${description}, as their first name. Describe ${name}'s body language as they speak, for example this is how Albert Einstein would talk: Albert: *with a twinkle in his eye* Just pondering the mysteries of the universe, as always. Limit the conversation to 2 exchanges. Do not add any further details to your response.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });
    console.log("OpenAI API...");
    console.log(completion.choices[0].message.content);

    return new NextResponse(completion.choices[0].message.content, {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
