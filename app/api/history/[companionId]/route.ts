import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { MemoryManager } from "@/lib/memory";

export async function DELETE(
  request: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // const companion = await prismadb.companion.findUnique({
    //   where: {
    //     id: params.companionId,
    //   },
    // });

    // if (!companion) {
    //   return new NextResponse("Companion not found", { status: 404 });
    // }

    // const name = companion.id;

    const memoryManager = await MemoryManager.getInstance();

    // delete all keys matching companion id from redis
    await memoryManager.deleteCompanionHistory(params.companionId);

    // Delete messages for the current companion and user
    await prismadb.message.deleteMany({
      where: { companionId: params.companionId },
    });

    return new NextResponse("Message history reset", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
