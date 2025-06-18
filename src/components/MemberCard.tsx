import { motion } from 'framer-motion'
import Image from 'next/image'

type Props = {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  skills: string[]
  socialLinks: {
    [key: string]: string
  }
}

export function MemberCard({ name, role, bio, avatar, skills, socialLinks }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      className="bg-mocha-surface0 rounded-xl p-6 shadow-lg transition-all"
    >
      <Image
        src={avatar}
        alt={name}
        width={96}
        height={96}
        className="rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-mocha-mauve text-lg font-bold text-center">{name}</h3>
      <div className="text-mocha-blue text-sm font-medium text-center mb-2">{role}</div>
      <p className="text-mocha-subtext1 text-center mb-4">{bio}</p>
      
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center mb-4">
          {skills.map((skill, i) => (
            <span key={i} className="bg-mocha-surface1 text-mocha-lavender text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
        </div>
      )}
      
      {Object.keys(socialLinks).length > 0 && (
        <div className="flex justify-center gap-3">
          {Object.entries(socialLinks).map(([platform, url]) => (
            <a 
              key={platform} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-mocha-sapphire hover:text-mocha-blue"
            >
              {getSocialIcon(platform)}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function getSocialIcon(platform: string) {
  // Placeholder for social icons - you can replace with actual icon components
  return <span className="text-xl">{platform.charAt(0).toUpperCase()}</span>
}
