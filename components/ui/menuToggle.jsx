// 'use client'

const MenuToggle = ({isOpen, setIsOpen}) => {
    return (
        <div 
            className={`header-menu-toggle md:!hidden cursor-pointer ${isOpen ? 'is-clicked' : ''}`}
            onClick={() => setIsOpen((prev) => !prev)}
        >
            <span>Menu</span>
        </div>
  )
}

export default MenuToggle
// const MenuToggle = ({isOpen, setIsOpen}) => {
//     return (
//         <div 
//             className={`header-menu-toggle md:!hidden cursor-pointer ${isOpen ? 'is-clicked' : ''}`}
//             onClick={() => setIsOpen((prev) => !prev)}
//         >
//             <span>Menu</span>
//         </div>
//   )
// }

// export default MenuToggle