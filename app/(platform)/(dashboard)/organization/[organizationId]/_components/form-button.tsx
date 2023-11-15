import { useFormStatus } from "react-dom";
import { Button } from "~/components/ui/button";

interface Props {}

export default function FormButton({}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      Submit
    </Button>
  );
}
