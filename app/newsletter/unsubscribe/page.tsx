import UnsubscribeForm from "./UnsubscribeForm"

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  return <UnsubscribeForm token={token || ""} />
}
