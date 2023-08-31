import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function DELETE(
  request: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
