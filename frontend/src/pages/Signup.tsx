import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from "../../config";

export default function Signup() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const schoolRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const availableCourses = [
    "Mathematics", 
    "Science", 
    "History", 
    "Computer Science", 
    "Art"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCourses = Array.from(
      event.target.selectedOptions, 
      (option) => option.value
    );
    setCourses(selectedCourses);
  };
  
  const toggleCourse = (course: string) => {
    if (courses.includes(course)) {
      setCourses(courses.filter(c => c !== course));
    } else {
      setCourses([...courses, course]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!passwordRef.current || !confirmPasswordRef.current) return;

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = {
      name: nameRef.current?.value || '',
      email: emailRef.current?.value || '',
      phone: phoneRef.current?.value || '',
      address: addressRef.current?.value || '',
      dob: dobRef.current?.value || '',
      school: schoolRef.current?.value || '',
      password: password,
      enrolledCourses: courses,
      profilePic: profilePic || ''
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage("✅ Signup successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(`❌ Error: ${result.message || "Failed to sign up"}`);
      }
    } catch (error) {
      setMessage("❌ Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left Column - Welcome Section */}
      <div className="w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-8 overflow-y-auto">
        <div className="h-full flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Welcome!</h1>
            <p className="text-blue-100 mb-8 leading-relaxed">Join our learning community and unlock your educational potential today.</p>
            
            <div className="space-y-6 mt-8">
              <div className="flex items-center">
                <div className="bg-blue-500/40 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Access to premium courses</span>
              </div>
              
              <div className="flex items-center">
                <div className="bg-blue-500/40 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Expert instructors</span>
              </div>
              
              <div className="flex items-center">
                <div className="bg-blue-500/40 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Interactive learning experience</span>
              </div>
              
              <div className="flex items-center">
                <div className="bg-blue-500/40 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Community support</span>
              </div>
            </div>
          </div>
          
          {profilePic ? (
            <div className="mt-10 flex flex-col items-center">
              <div className="relative">
                <img src={profilePic} alt="Profile Preview" className="w-28 h-28 rounded-full object-cover border-4 border-white/80 shadow-lg" />
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-sm mt-4 text-center font-medium text-blue-100">Your profile picture is ready!</p>
            </div>
          ) : (
            <div className="mt-10 text-center">
              <p className="text-sm text-blue-100 mb-3">Already have an account?</p>
              <a href="/login" className="inline-block px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-lg border border-white/20 hover:bg-white/20 transition duration-300 shadow-lg hover:shadow-xl">Log In</a>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Column - Form */}
      <div className="w-1/2 bg-white p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Your Account</h2>
        
        {message && (
          <div className={`text-center p-3 rounded-lg mb-6 text-sm ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
        
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Personal Info */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input ref={nameRef} type="text" id="name" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required placeholder="Enter your full name" />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input ref={emailRef} type="email" id="email" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required placeholder="you@example.com" />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input ref={phoneRef} type="tel" id="phone" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required placeholder="+1 (123) 456-7890" />
            </div>
            
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
              <input ref={dobRef} type="date" id="dob" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <textarea ref={addressRef} id="address" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required placeholder="Enter your full address" rows={2} />
            </div>
            
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1.5">School</label>
              <input ref={schoolRef} type="text" id="school" className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required placeholder="Enter your school name" />
            </div>
            
            <div>
              <label htmlFor="profile-pic" className="block text-sm font-medium text-gray-700 mb-1.5">Profile Picture</label>
              <div className="relative">
                <input 
                  type="file" 
                  id="profile-pic" 
                  accept="image/*" 
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                  onChange={handleImageUpload} 
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Select Courses
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availableCourses.map((course) => (
                  <button
                    type="button"
                    key={course}
                    onClick={() => toggleCourse(course)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      courses.includes(course)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {course}
                  </button>
                ))}
              </div>
              {courses.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Selected courses:</p>
                  <div className="flex flex-wrap gap-2">
                    {courses.map(course => (
                      <span key={course} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {course}
                        <button 
                          type="button" 
                          onClick={() => setCourses(courses.filter(c => c !== course))}
                          className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Password Fields */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input 
                  ref={passwordRef} 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                  required 
                  placeholder="Enter your password" 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700 transition p-1" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input 
                  ref={confirmPasswordRef} 
                  type={showConfirmPassword ? "text" : "password"} 
                  id="confirm-password" 
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                  required 
                  placeholder="Confirm your password" 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700 transition p-1"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full py-3.5 rounded-xl text-white font-medium text-sm transition duration-300 ease-in-out mt-6 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Your Account...
              </span>
            ) : "Create Account"}
          </button>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              By creating an account, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}