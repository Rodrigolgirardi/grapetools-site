export function Logo({ white = false }: { white?: boolean }) {
  return (
    <a className="logo" href="/" aria-label="Grape Tools">
      <img
        src={white ? "/logo-h-branca.png" : "/logo.png"}
        alt="Grape Tools"
        className={white ? "logoImgWide" : "logoImg"}
      />
    </a>
  );
}
