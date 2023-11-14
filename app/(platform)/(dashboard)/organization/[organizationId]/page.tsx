import { OrganizationSwitcher, auth } from "@clerk/nextjs";

interface Props {
  params: { organizationId: string };
}

export default function OrganizationIdPage({ params }: Props) {
  return <div>OrgPage</div>;
}
