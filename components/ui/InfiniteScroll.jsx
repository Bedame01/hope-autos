import InlineInfiniteScroll from "./InlineInfiniteScroll"

const InfiniteScroll = () => {
  return (
    <section className="hero-detail pt-8 flex flex-col items-center justify-center gap-1">
      <h3 className="text-[var(--foreground)] text-center font-bold heading-text text-xl md:text-[22px]">All Great Car Brand's Available</h3>
      <InlineInfiniteScroll />
    </section>
  )
}

export default InfiniteScroll