import { redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }) => {
  const res = await requireUserId(request)
  return redirect('/home');
}

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className=" text-2xl font-bold text-center p-2">Home page</h1>
    </div>
  );
}
