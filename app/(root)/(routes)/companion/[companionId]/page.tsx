import CompanionForm from "@/app/(root)/(routes)/companion/[companionId]/components/CompanionForm";
import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";

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

  return (
    <div>
      <CompanionForm initialData={companion} categories={categories} />
    </div>
  );
}

export default CompanionIdPage;
