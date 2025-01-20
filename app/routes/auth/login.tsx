export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <p>This is the login page</p>

      <form action="/auth/login" method="get">
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
