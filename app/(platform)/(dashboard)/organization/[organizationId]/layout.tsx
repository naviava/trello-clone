import { startCase } from "lodash";
import { OrgControl } from "./_components/org-control";
import { auth } from "@clerk/nextjs";

export async function generateMetadata() {
  const { orgSlug } = auth();

  return {
    title: startCase(orgSlug || "organization"),
  };
}

interface Props {
  children: React.ReactNode;
}

export default function OrganizationIdLayout({ children }: Props) {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
}
