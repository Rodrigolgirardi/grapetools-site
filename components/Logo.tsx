export function Logo({ white = false }: { white?: boolean }) {
  return (
    <a className="logo" href="/" aria-label="Grape Tools">
      <img
        src={white ? "/logo-branca.png" : "/logo.png"}
        alt="Grape Tools"
        className="logoImg"
      />
    </a>
  );
}
