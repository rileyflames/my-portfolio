// Hero section component for the portfolio homepage
import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Sparkles } from 'lucide-react'

/**
 * Hero Component
 * - Main landing section with minimalist design
 * - Clean, professional aesthetic
 * - Smooth animations and transitions
 * - Uses custom color palette
 */
const Hero = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Logo/Avatar section - Minimalist */}
        <div className="mb-12 animate-fade-in">
          <div className="w-24 h-24 mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 transform hover:rotate-6 transition-transform duration-300">
            <span className="text-4xl font-bold text-white">AM</span>
          </div>
        </div>
        
        {/* Main heading - Clean typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 mb-6 tracking-tight">
          Anthony M M
        </h1>
        
        {/* Subtitle - Minimalist */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 sm:w-12 bg-primary"></div>
            <h2 className="text-base sm:text-lg md:text-xl text-primary font-medium tracking-wide">
              SELF-TAUGHT DEVELOPER
            </h2>
            <div className="h-px w-8 sm:w-12 bg-primary"></div>
          </div>
          
          {/* Clean description */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Crafting elegant solutions through code. Driven by curiosity and 
            continuous learning to build meaningful digital experiences.
          </p>
        </div>
        
        {/* CTA buttons - Prominent Get In Touch */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
          <Link
            to="/contact"
            className="group bg-primary text-white px-10 py-5 rounded-lg text-lg font-semibold hover:bg-primary-light transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get In Touch
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/projects"
            className="border-2 border-primary text-primary px-8 py-4 rounded-lg text-base font-medium hover:bg-primary hover:text-white transition-all duration-200"
          >
            View Projects
          </Link>
        </div>
        
        {/* Feature cards - Clean grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
          <div className="bg-white p-6 rounded-xl border border-neutral-300 hover:border-primary transition-colors duration-200">
            <Code2 className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="text-base font-semibold text-neutral-900 mb-2">
              Clean Code
            </h3>
            <p className="text-sm text-neutral-600 font-light">
              Writing maintainable, scalable solutions
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-neutral-300 hover:border-primary transition-colors duration-200">
            <Sparkles className="w-8 h-8 text-primary mb-3 mx-auto" />
            <h3 className="text-base font-semibold text-neutral-900 mb-2">
              Modern Stack
            </h3>
            <p className="text-sm text-neutral-600 font-light">
              Latest technologies and best practices
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-neutral-300 hover:border-primary transition-colors duration-200 sm:col-span-2 md:col-span-1">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-base font-semibold text-neutral-900 mb-2">
              Self-Taught
            </h3>
            <p className="text-sm text-neutral-600 font-light">
              Continuous learning and growth mindset
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero