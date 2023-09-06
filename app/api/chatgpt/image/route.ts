import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

const openai = new OpenAI();

cloudinary.config({
  cloud_name: "dg1eo4yqs",
  api_key: "655171173436411",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    const { src, name, description, instructions, seed, categoryId } = body;

    // const response = await openai.images
    //   .generate({
    //     prompt:
    //       "portrait of Beyonce in a style of Pixar character render, unreal engine cinematic smooth, hd, looking forward, in the center of image, from neck up, gray background",
    //     n: 1,
    //     size: "512x512",
    //   })
    //   .catch((error) => console.log(error));
    // console.log("OpenAI API...");
    // console.log(response?.data[0].url);

    // const models = await axios.get("https://api.catbird.ai/v1/models", {
    //   headers: {
    //     Authorization: `Bearer ${process.env.CATBIRD_API_KEY}`,
    //   },
    // });

    // console.log(models.data.models);

    const imageGenerator = await axios.post(
      "https://api.catbird.ai/v1/txt2img",
      {
        prompt: `portrait of ${name}, ${description}, in a style of Pixar character render, unreal engine cinematic smooth, hd, looking forward, in the center of image, from neck up, gray background`,
        model: "dreamshaper_4BakedVae.safetensors",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CATBIRD_API_KEY}`,
        },
      }
    );

    console.log(imageGenerator.data);

    let response = await axios.get(
      `https://api.catbird.ai/v1/job/${imageGenerator.data.job_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CATBIRD_API_KEY}`,
        },
      }
    );

    while (response.data.status !== "complete") {
      response = await axios.get(
        `https://api.catbird.ai/v1/job/${imageGenerator.data.job_id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CATBIRD_API_KEY}`,
          },
        }
      );

      console.log(response.data);

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    }

    console.log(response.data.image_urls[0]);

    // let image_url: string | undefined = "";
    const image_url = await cloudinary.uploader.upload(
      response.data.image_urls[0],
      { public_id: `${name}-${user?.id}` },
      function (error, result) {
        console.log("TESTING");
        console.log(result?.secure_url);
        return result?.secure_url;
      }
    );
    // console.log(image_url.secure_url);
    return new NextResponse(image_url.secure_url, {
      status: 200,
    });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
