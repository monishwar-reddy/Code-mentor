export const metadata = {
  title: 'Code Mentor',
  description: 'Community Code Mentor powered by AWS Bedrock',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
