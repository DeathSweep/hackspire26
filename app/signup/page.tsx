"use client";

import React, { useState } from 'react';
import { 
  CheckCircle, 
  Briefcase, 
  ShieldCheck, 
  MapPin, 
  User, 
  Mail, 
  Lock, 
  Layers,
  HardHat
} from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Backend integration goes here
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FDFBFA] font-sans text-gray-900">
      
      {/* Left Pane - Branding & Info */}
      <div className="md:w-5/12 bg-[#0C1A30] text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between">
        
        {/* Logo & Header */}
        <div>
          <div className="flex items-center space-x-3 mb-16">
            <div className="p-2 bg-[#B9523D] rounded-lg">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-wide">LABOR CONNECT</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-[#FDFBFA]">
            Connecting Labor & Hiring Opportunities
          </h1>
          <p className="text-lg text-gray-300 mb-12 max-w-md">
            A platform built for reliability, efficiency, and finding the perfect match for your next project.
          </p>

          {/* Value Props */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-7 w-7 text-[#B9523D] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-1">Verified Workers</h3>
                <p className="text-sm text-gray-400">Skilled, certified pool with reliable performance ratings.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Briefcase className="h-7 w-7 text-[#B9523D] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-1">Efficient Job Matching</h3>
                <p className="text-sm text-gray-400">Quick job postings, location-based search, and skill-based hiring.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <ShieldCheck className="h-7 w-7 text-[#B9523D] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-1">Secure Payments</h3>
                <p className="text-sm text-gray-400">Integrated billing system with escrow protection and transparency.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (desktop only) */}
        <div className="hidden md:block mt-16 text-sm text-gray-500">
          © {new Date().getFullYear()} Labor Connect. All rights reserved.
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-[#FDFBFA]">
        <div className="max-w-md w-full mx-auto">
          
          <h2 className="text-3xl font-bold text-[#0C1A30] mb-2">Create an Account</h2>
          <p className="text-gray-500 mb-8">Join the network of top professionals and clients.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Role Selection (Stylized Cards) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#0C1A30]">I want to...</label>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Worker Card */}
                <button
                  type="button"
                  onClick={() => setRole('worker')}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 ${
                    formData.role === 'worker' 
                      ? 'border-[#B9523D] bg-[#B9523D]/10 text-[#0C1A30]' 
                      : 'border-gray-200 hover:border-[#B9523D]/50 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <HardHat className={`h-8 w-8 mb-2 ${formData.role === 'worker' ? 'text-[#B9523D]' : 'text-gray-400'}`} />
                  <span className="font-semibold text-sm">Find Work</span>
                  <span className="text-xs text-gray-400 mt-1">I am a skilled worker</span>
                </button>

                {/* Client Card */}
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 ${
                    formData.role === 'client' 
                      ? 'border-[#B9523D] bg-[#B9523D]/10 text-[#0C1A30]' 
                      : 'border-gray-200 hover:border-[#B9523D]/50 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className={`h-8 w-8 mb-2 ${formData.role === 'client' ? 'text-[#B9523D]' : 'text-gray-400'}`} />
                  <span className="font-semibold text-sm">Hire Workers</span>
                  <span className="text-xs text-gray-400 mt-1">I am a client</span>
                </button>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 pt-2">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-[#0C1A30] mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C1A30]/20 focus:border-[#0C1A30] outline-none transition-colors bg-white text-gray-900"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#0C1A30] mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C1A30]/20 focus:border-[#0C1A30] outline-none transition-colors bg-white text-gray-900"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#0C1A30] mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C1A30]/20 focus:border-[#0C1A30] outline-none transition-colors bg-white text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[#0C1A30] mb-1">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0C1A30]/20 focus:border-[#0C1A30] outline-none transition-colors bg-white text-gray-900"
                    placeholder="City, State or Zip Code"
                  />
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#B9523D] hover:bg-[#9a4230] text-white font-semibold py-3.5 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B9523D]"
            >
              Create Account
            </button>
            
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account? <a href="#" className="font-semibold text-[#0C1A30] hover:text-[#B9523D] transition-colors">Log in</a>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}