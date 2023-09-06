import CompanionForm from "@/app/(root)/(routes)/companion/[companionId]/components/CompanionForm";
import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface CompanionIdPageProps {
  params: {
    companionId: string;
  };
}

async function CompanionIdPage({ params }: CompanionIdPageProps) {
  const { userId } = auth();
  // TODO: Check subscription

  if (!userId) {
    return redirectToSignIn();
  }

  const ifCompanion = await prismadb.companion.findFirst({
    where: {
      userId,
    },
  });

  const companion = await prismadb.companion.findUnique({
    where: {
      id: params.companionId,
      userId,
    },
  });

  const categories = await prismadb.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (
    ifCompanion &&
    !companion &&
    userId !== "user_2Uea7sTHE5XHMPMoibjEduqJP7y"
  ) {
    redirect("/");
  }

  return (
    <div>
      <CompanionForm initialData={companion} categories={categories} />
    </div>
  );
}

export default CompanionIdPage;
