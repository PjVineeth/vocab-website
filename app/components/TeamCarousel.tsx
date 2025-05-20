"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { teamMembers, TeamMember } from "@/app/data/teamMembers"

export default function TeamCarousel() {
  const [activeIndex, setActiveIndex] = useState(2)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered) return

    const interval = setInterval(() => {
      if (!isAnimating) {
        setActiveIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isHovered, isAnimating])

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const handleMemberClick = (index: number) => {
    if (isAnimating || index === activeIndex) return
    setIsAnimating(true)
    setActiveIndex(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const getCardPosition = (index: number) => {
    const diff = index - activeIndex

    if (diff === 0) return "center"
    if (diff === 1 || diff === -teamMembers.length + 1) return "right-1"
    if (diff === -1 || diff === teamMembers.length - 1) return "left-1"
    if (diff === 2 || diff === -teamMembers.length + 2) return "right-2"
    if (diff === -2 || diff === teamMembers.length - 2) return "left-2"
    return "hidden"
  }

  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
      <div 
        className="relative w-full h-[350px] sm:h-[500px] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className={cn(
                "absolute transition-all duration-200 ease-in-out rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:z-30",
                getCardPosition(index) === "center" && "z-20 scale-100 translate-x-0 border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "left-1" && "z-10 scale-95 -translate-x-[70%] border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "right-1" && "z-10 scale-95 translate-x-[70%] border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "left-2" && "z-0 scale-90 -translate-x-[120%] border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "right-2" && "z-0 scale-90 translate-x-[120%] border-2 border-white mx-1 sm:mx-4",
                getCardPosition(index) === "hidden" && "opacity-0 scale-50",
              )}
              onClick={() => handleMemberClick(index)}
            >
              <div className="relative w-[220px] h-[300px] sm:w-[300px] sm:h-[400px] bg-black group">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={index === activeIndex}
                />
                <div className={cn(
                  "absolute inset-0 flex flex-col justify-end p-2 sm:p-6 text-white bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-300",
                  getCardPosition(index) === "center" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-200">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Previous member"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="Next member"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
} 