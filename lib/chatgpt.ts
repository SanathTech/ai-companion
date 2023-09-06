import OpenAI from "openai";

const openai = new OpenAI();

export default async function chatgpt() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: "Say this is a test" }],
    model: "gpt-3.5-turbo",
  });
  console.log("OpenAI API...");
  console.log(completion.choices);
}
