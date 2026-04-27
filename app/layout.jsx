import "./globals.css";

export const metadata = {
  title: "Sanaly Bet",
  description:
    "Математикалық модельдеу мен ықтималдылық теориясы арқылы лудоманиядан шығу жолдары"
};

export default function RootLayout({ children }) {
  return (
    <html lang="kk">
      <body>{children}</body>
    </html>
  );
}
