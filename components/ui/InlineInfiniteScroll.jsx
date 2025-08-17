import Image from 'next/image';

import icon1 from '@/public/icons/a.png';
import icon2 from '@/public/icons/b.png';
import icon3 from '@/public/icons/c.png';
import icon4 from '@/public/icons/d.png';
import icon5 from '@/public/icons/e.png';
import icon6 from '@/public/icons/f.png';
import icon7 from '@/public/icons/g.png';
import icon8 from '@/public/icons/h.png';
import icon9 from '@/public/icons/i.png';
import icon10 from '@/public/icons/j.png';
import icon11 from '@/public/icons/k.png';
import icon12 from '@/public/icons/l.png';
import icon13 from '@/public/icons/m.png';
import icon14 from '@/public/icons/n.png';
import icon15 from '@/public/icons/o.png';
import icon16 from '@/public/icons/p.png';

const InlineInfiniteScroll = () => {
  return (
    <div className="scroll-container w-[90%] md:w-[70%] overflow-hidden whitespace-nowrap relative flex items-center mx-auto pt-5 pb-8">
      <div className="scroll-content flex">

        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon1} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon2} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon3} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon4} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon5} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon6} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        {/* duplicates for seamless loops */}
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon7} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon8} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon9} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon10} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon11} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon12} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>

        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon13} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon14} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon15} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>
        <div className="logo-item inline-flex items-center justify-center">
          <div className="logo-content flex items-center"><Image src={icon16} alt="car-brand-icon" width={10} height={10} className='logo-icon w-[38px] sm:w-[40px]' /></div>
        </div>

      </div>
    </div>
  )
};

export default InlineInfiniteScroll