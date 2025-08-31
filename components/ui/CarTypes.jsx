import Image from "next/image"

import suv from '@/public/icons/suv.svg'
import sedan from '@/public/icons/sedan.svg'
import coup from '@/public/icons/coupe.svg'
import convertible from '@/public/icons/convertible.svg'
import hybrid from '@/public/icons/hybrid.svg'
import hatchback from '@/public/icons/hatchback.svg'

const CarTypes = () => {
    const carType = [
        {id: 1, imageUrl: suv, name: 'SUV'},
        {id: 2, imageUrl: sedan, name: 'Sedan'},
        {id: 3, imageUrl: coup, name: 'Coup'},
        {id: 1, imageUrl: convertible, name: 'Convertible'},
        {id: 4, imageUrl: hybrid, name: 'Hybrid'},
        {id: 5, imageUrl: hatchback, name: 'Hatchback'},
    ]
    return (
        <div className="max-w-3xl max-sm:w-full relative car-type-card flex items-center justify-center flex-wrap gap-5 max-sm:gap-3 max-sm:px-3 mt-2 md:mt-6">
            {
                carType.map((type) => (
                    <div className="type-wrapper flex items-center gap-2 py-2 px-5 rounded-full bg-transparent border border-[var(--border-line)]">
                        <Image 
                            key={type.id}
                            src={type.imageUrl}
                            alt={type.name}
                            className="w-4 max-sm:w-3.5 lg:w-6 h-auto object-cover"
                        />
                        <p className="max-sm:text-[10px] text-xs text-foreground font-medium">{type.name}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default CarTypes