import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: LoginComponent,
});

function LoginComponent() {
  return (
    <div className="p-2">
      <h3>Login</h3>
    </div>
  )
}
