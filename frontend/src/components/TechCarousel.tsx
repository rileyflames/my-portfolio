/**
 * TechCarousel Component - Auto-scrolling Technology Showcase
 * 
 * PURPOSE:
 * - On mobile: Creates a smooth, continuous horizontal auto-scrolling carousel
 * - On desktop: Shows a static grid of technology badges
 * 
 * RESPONSIVE BEHAVIOR:
 * - Mobile (below md/768px): Horizontal auto-scroll carousel with infinite loop
 * - Desktop (md and above): Static flex row with wrapping
 * 
 * HOW IT WORKS:
 * - Uses CSS animations for smooth, continuous scrolling
 * - Duplicates the tech list to create seamless infinite loop
 * - Pauses animation on hover for better UX
 * - No JavaScript libraries needed - pure CSS animation
 * 
 * CUSTOMIZATION:
 * - Adjust animation speed in the `animate-scroll` keyframe (currently 20s)
 * - Change breakpoint by modifying `md:` classes
 * - Modify spacing and sizing with Tailwind classes
 */

import { motion } from 'framer-motion'

interface TechCarouselProps {
  skills: string[]
}

const TechCarousel = ({ skills }: TechCarouselProps) => {
  return (
    <div className="mb-12">
      <p className="text-sm text-white/60 uppercase tracking-wide font-medium mb-6 text-center lg:text-left">
        Core Technologies
      </p>
      
      {/* 
        DESKTOP VIEW (md and above / 768px+)
        - Shows all skills in a flex row with wrapping
        - Static, no scrolling
        - Centered on mobile, left-aligned on desktop
      */}
      <div className="hidden md:flex flex-wrap justify-center lg:justify-start gap-3">
        {skills.map((skill, index) => (
          <motion.span
            key={skill}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 hover:border-purple-400 transition-all duration-200"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.1, y: -2 }}
          >
            {skill}
          </motion.span>
        ))}
      </div>

      {/* 
        MOBILE VIEW (below md / below 768px)
        - Horizontal auto-scrolling carousel
        - Infinite loop by duplicating the skills array
        - Smooth continuous animation
        - Pauses on hover for better readability
        
        HOW THE INFINITE SCROLL WORKS:
        1. We duplicate the skills array (skills + skills)
        2. CSS animation moves the container from 0% to -50% (half the width)
        3. When it reaches -50%, it's showing the duplicate, so we loop back
        4. This creates a seamless infinite scroll effect
      */}
      <div className="md:hidden relative overflow-hidden">
        {/* 
          Gradient overlays on left and right edges
          Creates a fade effect so items appear/disappear smoothly
        */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
        
        {/* 
          Scrolling container
          - Uses custom CSS animation defined in index.css
          - hover:pause pauses the animation when user hovers
          - Duplicates content for seamless loop
        */}
        <div className="flex animate-scroll hover:pause">
          {/* First set of skills */}
          {skills.map((skill, index) => (
            <span
              key={`first-${index}`}
              className="flex-shrink-0 px-4 py-2 mx-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium text-white backdrop-blur-sm whitespace-nowrap"
            >
              {skill}
            </span>
          ))}
          {/* Duplicate set for infinite loop */}
          {skills.map((skill, index) => (
            <span
              key={`second-${index}`}
              className="flex-shrink-0 px-4 py-2 mx-2 bg-white/10 border border-white/20 rounded-full text-sm font-medium text-white backdrop-blur-sm whitespace-nowrap"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TechCarousel
