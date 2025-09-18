"use client";
import LoginLinks from "@/app/LoginLinks.jsx";
import { useState } from "react";
import PlansPage from "./(guest)/plans/page";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen scroll-smooth bg-[#FDFDFC] text-[#1b1b18] ">
      {/* Header */}
      <header className="bg-opacity-95 fixed top-0 left-0 z-50 w-full bg-white shadow-md">
        <div className="mx-auto w-full max-w-7xl p-4 text-sm">
          <nav className="flex flex-wrap items-center justify-between py-2">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff6b6b]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#333] ">BirthCare</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden items-center gap-8 md:flex">
              <a
                href="#home"
                className="font-medium text-[#555] transition-colors duration-300 hover:text-[#ff6b6b]"
              >
                Home
              </a>
              <a
                href="#services"
                className="font-medium text-[#555] transition-colors duration-300 hover:text-[#ff6b6b] "
              >
                Services
              </a>
              <a
                href="/templates"
                className="font-medium text-[#555] transition-colors duration-300 hover:text-[#ff6b6b] "
              >
                Templates
              </a>
              <a
                href="#pricing"
                className="font-medium text-[#555] transition-colors duration-300 hover:text-[#ff6b6b] "
              >
                Pricing
              </a>
              <a
                href="#about"
                className="font-medium text-[#555] transition-colors duration-300 hover:text-[#ff6b6b] "
              >
                About
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden items-center gap-4 md:flex">
              <LoginLinks />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="focus:outline-none md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6 text-[#333] "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </nav>

          {/* Mobile Menu Links */}
          {isOpen && (
            <div className="mt-4 space-y-2 rounded-lg bg-white p-4 shadow-lg md:hidden">
              <a
                href="#home"
                className="block px-4 py-3 font-medium hover:bg-[#f9f9f9] hover:text-[#ff6b6b] "
              >
                Home
              </a>
              <a
                href="#services"
                className="block px-4 py-3 font-medium hover:bg-[#f9f9f9] hover:text-[#ff6b6b] "
              >
                Services
              </a>
              <a
                href="/templates"
                className="block px-4 py-3 font-medium hover:bg-[#f9f9f9] hover:text-[#ff6b6b] "
              >
                Templates
              </a>
              <a
                href="#pricing"
                className="block px-4 py-3 font-medium hover:bg-[#f9f9f9] hover:text-[#ff6b6b] "
              >
                Pricing
              </a>
              <a
                href="#about"
                className="block px-4 py-3 font-medium hover:bg-[#f9f9f9] hover:text-[#ff6b6b]"
              >
                About
              </a>

              <div>
                <LoginLinks />
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Hero Section with Mother and Baby Background */}
      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-20 text-center"
        style={{
          backgroundImage: "url('/birth.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/60"></div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="mb-4 text-5xl font-bold text-white drop-shadow-lg">
            Welcome to BirthCare
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white drop-shadow-md">
            Your trusted partner in prenatal, childbirth, and postnatal care.
            Experience compassionate service every step of the way.
          </p>
          <a
            href="/register"
            className="transform rounded-md bg-[#ff6b6b] px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#ff5252]"
          >
            Get Started
          </a>
        </div>
      </section>
      {/* Services Section with Gradient Background */}
      <section
        id="services"
        className="min-h-screen bg-gradient-to-b from-[#f9f9f9] to-[#e6f7ff] px-4 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="relative mb-16 text-center text-4xl font-bold text-[#333]">
            Our Services
            <span className="mx-auto mt-4 block h-1 w-24 bg-[#ff6b6b]"></span>
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            <div className="transform rounded-xl border-0 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ffe0e0]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#ff6b6b]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-center text-2xl font-bold">
                Prenatal Care
              </h3>
              <p className="text-center text-gray-600">
                Regular check-ups, nutritional advice, and emotional support
                during your pregnancy journey.
              </p>
            </div>
            <div className="transform rounded-xl border-0 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e0f0ff]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#4d8cff]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-center text-2xl font-bold">
                Childbirth Assistance
              </h3>
              <p className="text-center text-gray-600">
                Skilled professionals to guide you through labor and delivery,
                ensuring a safe birth experience.
              </p>
            </div>
            <div className="transform rounded-xl border-0 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e0ffe6]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#4dff88]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-center text-2xl font-bold">
                Postnatal Support
              </h3>
              <p className="text-center text-gray-600">
                Help and care during the recovery period and early days with
                your newborn.
              </p>
            </div>
            <div className="transform rounded-xl border-0 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0e6ff]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#9d4edd]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-center text-2xl font-bold">
                Medical Templates
              </h3>
              <p className="text-center text-gray-600">
                Professional templates for birth certificates, vaccination records,
                and medical documentation.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Pricing Section with Background Image */}
      <section>
        <PlansPage id="pricing" />
      </section>
      {/* About Section with Background */}
      <section
        id="about"
        className="relative bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] px-4 py-24"
      >
        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="relative mb-10 text-center text-4xl font-bold text-[#333]">
            About BirthCare
            <span className="mx-auto mt-4 block h-1 w-24 bg-[#ff6b6b]"></span>
          </h2>
          <div className="rounded-xl bg-white p-10 shadow-xl">
            <p className="text-center text-lg leading-relaxed text-gray-700">
              BirthCare was founded to empower mothers and families by
              delivering accessible, quality maternal care. Our team of
              dedicated professionals is committed to guiding you through each
              stage of motherhood with empathy, expertise, and personalized
              attention.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f7ff]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#4d8cff]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f0]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#ff6b6b]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0fff4]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#4dff88]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="bg-[#f9f0ff] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="relative mb-16 text-center text-4xl font-bold text-[#333]">
            What Mothers Say
            <span className="mx-auto mt-4 block h-1 w-24 bg-[#9d4edd]"></span>
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <div className="mb-4 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e0e0e0]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#9d4edd]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">Maria Santos</h4>
                  <p className="text-sm text-gray-500">First-time mother</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The team at BirthCare made my first pregnancy journey so much
                easier. Their support and expertise gave me confidence when I
                needed it most."
              </p>
            </div>
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <div className="mb-4 flex items-center">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#e0e0e0]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#9d4edd]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">Ana Reyes</h4>
                  <p className="text-sm text-gray-500">Mother of twins</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "I don't know how I would have managed the birth of my twins
                without BirthCare. Their postnatal support was absolutely
                essential for my recovery."
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section
        className="relative py-20"
        style={{
          backgroundImage: "url('/api/placeholder/1920/1080')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#ff6b6b] opacity-90"></div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Begin Your Journey With Us
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white">
            Every mother deserves quality care throughout her pregnancy journey.
            Join our community today.
          </p>
          <a
            href="/register"
            className="transform rounded-md bg-white px-8 py-3 font-semibold text-[#ff6b6b] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100"
          >
            Register Now
          </a>
        </div>
      </section>
      {/* Footer with Enhanced Styling */}
      <footer className="bg-[#1a1a1a] py-12 text-center text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0">
              <h3 className="mb-2 text-2xl font-bold">BirthCare</h3>
              <p className="text-gray-400">
                Your trusted maternal care partner
              </p>
            </div>
            <div className="flex space-x-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#333] transition-colors duration-300 hover:bg-[#ff6b6b]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#333] transition-colors duration-300 hover:bg-[#ff6b6b]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#333] transition-colors duration-300 hover:bg-[#ff6b6b]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400">
              © {new Date().getFullYear()} BirthCare. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
