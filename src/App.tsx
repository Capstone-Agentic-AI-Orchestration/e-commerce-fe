export interface AppProps {
  title?: string;
}

export function App({ title = 'e-commerce-fe' }: AppProps) {
  return (
    <main>
      <h1>{title}</h1>
    </main>
  );
}
