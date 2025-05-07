"use client";

import type React from "react";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface United24BannerProps {
  animateGradient?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const United24Banner: React.FC<United24BannerProps> = ({
  animateGradient = true,
  onClose,
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  const bannerVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      paddingBottom: 0,
      paddingTop: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    visible: {
      height: "auto",
      opacity: 1,
      paddingBottom: "1rem",
      paddingTop: "1rem",
      ...(animateGradient && {
        backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
      }),
      transition: {
        default: { duration: 0.5, ease: "easeOut", when: "beforeChildren" },
        ...(animateGradient && {
          backgroundPosition: {
            duration: 45,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          },
        }),
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, rotate: -15, scale: 0.8 },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99] },
    },
  };

  const contentItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
      y: 0,
    },
  };

  const buttonItemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.9,
      transition: { delay: 0.1, duration: 0.2, ease: "easeOut" },
    },
  };

  const bannerClasses = `w-full shadow-md relative z-50 overflow-hidden ${
    animateGradient ? "banner-gradient-bg" : "bg-[#ffd700] dark:bg-[#0057b7]"
  }`;

  const backgroundStyle = animateGradient
    ? {
        background:
          "linear-gradient(90deg, #0057b7 0%, #0057b7 40%, #ffd700 60%, #ffd700 100%)",
        backgroundSize: "200% 100%",
      }
    : {};

  const buttonClasses = animateGradient
    ? "bg-[#0057b7] text-[#ffd700] font-bold py-2 px-6 rounded hover:bg-white hover:text-[#0057b7] uppercase shadow-md hover:opacity-100 transition-opacity duration-300"
    : "bg-[#0057b7] dark:bg-[#ffd700] hover:bg-white dark:hover:bg-white text-[#ffd700] dark:text-blue-800 hover:text-[#0057b7] font-bold py-2 px-6 rounded uppercase shadow-md hover:opacity-100 transition-opacity duration-300";

  const textColorClasses = animateGradient
    ? "text-white"
    : "text-blue-800 dark:text-white";

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isVisible && (
        <motion.div
          animate="visible"
          aria-label="Support Ukraine banner"
          className={bannerClasses}
          exit="hidden"
          initial="hidden"
          role="banner"
          style={backgroundStyle}
          variants={bannerVariants}
        >
          <motion.div
            animate="visible"
            className={`
              container mx-auto flex flex-col items-center justify-between px-4
              md:flex-row
            `}
            initial="hidden"
            variants={containerVariants}
          >
            <motion.div
              className={`
                mb-4 flex flex-col items-center
                md:mb-0 md:flex-row
              `}
              variants={contentItemVariants}
            >
              <motion.div
                className={`
                  relative mb-3 flex-shrink-0
                  md:mr-5 md:mb-0
                `}
                variants={logoVariants}
              >
                <Image
                  alt="United24 Logo"
                  className={`
                    block h-auto w-24 rounded
                    dark:hidden
                  `}
                  height={48}
                  priority
                  src="/u24.svg"
                  width={96}
                />
                <Image
                  alt="United24 Logo"
                  className={`
                    hidden h-auto w-24 rounded
                    dark:block
                  `}
                  height={48}
                  priority
                  src="/u24_white.svg"
                  width={96}
                />
              </motion.div>
              <motion.p
                className={`
                  text-center font-semibold
                  md:text-left
                  ${textColorClasses}
                `}
                variants={contentItemVariants}
              >
                Stand with Ukraine. Help fund drones, medkits, and victory.
                Every dollar helps stop{" "}
                <Link
                  className="underline"
                  href="https://war.ukraine.ua/russia-war-crimes"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  russia's war crimes
                </Link>{" "}
                and saves lives. Donate now, it matters.
              </motion.p>
            </motion.div>

            <motion.div
              className="flex items-center"
              variants={contentItemVariants}
            >
              <motion.div variants={buttonItemVariants}>
                <Link
                  aria-label="Donate to support Ukraine"
                  className={buttonClasses}
                  href="https://u24.gov.ua"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Donate
                </Link>
              </motion.div>

              {showCloseButton && (
                <motion.button
                  aria-label="Close Ukraine support banner"
                  className={`
                    focus:ring-opacity-50 focus:ring-2 focus:ring-current
                    focus:outline-none
                    ml-4 opacity-80 transition-opacity
                    hover:opacity-100
                    ${textColorClasses}
                  `}
                  onClick={handleClose}
                  type="button"
                  variants={contentItemVariants}
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Close</title>
                    <path
                      clipRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      fillRule="evenodd"
                    />
                  </svg>
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default United24Banner;
