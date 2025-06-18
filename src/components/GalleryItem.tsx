import { motion } from 'framer-motion'
import Image from 'next/image'

type Props = {
  id: string
  title: string
  description: string
  url: string
  photographer: string
  uploadDate: string
}

export function GalleryItem({ title, description, url, photographer }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-lg"
    >
      <div className="aspect-square relative">
        <Image
          src={url}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-transform group-hover:scale-105"
        />
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-mocha-crust/90 to-transparent p-4"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-mocha-text font-medium">{title}</h3>
        {description && (
          <p className="text-mocha-subtext1 text-sm line-clamp-2">{description}</p>
        )}
        {photographer && (
          <p className="text-mocha-subtext0 text-xs mt-1">Photo by: {photographer}</p>
        )}
      </motion.div>
    </motion.div>
  )
}
