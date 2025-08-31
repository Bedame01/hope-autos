import InlineInfiniteScroll from "./InlineInfiniteScroll"

const InfiniteScroll = () => {
  return (
    <section className="hero-detail pt-10 flex flex-col items-center justify-center gap-1">
      <h3 className="text-[var(--foreground)] text-center font-bold text-base md:text-l">Availability of all Car Makes</h3>
      <InlineInfiniteScroll />
    </section>
  )
}

export default InfiniteScroll