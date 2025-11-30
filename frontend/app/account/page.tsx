import AccountPageClient from "./client";

type AccountPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function AccountPage({ searchParams }: AccountPageProps) {
  const requestedTab =
    typeof searchParams.tab === "string" ? searchParams.tab : undefined;
  return <AccountPageClient initialTab={requestedTab} />;
}
