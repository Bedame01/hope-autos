import Link from "next/link";

const CustomButton = ( {containerStyle, contentText, onClick, href} ) => {
  return (
    <Link 
      href={href}
      className= {`customButton rounded-lg font-semibold cursor-pointer smooth-transition ${containerStyle}`}
      onClick={onClick}
    >
      {contentText}
    </Link>
  )
}

export default CustomButton