import { useState, useRef } from "react";

export default function Signup() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [courses, setCourses] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Refs for form inputs to improve type safety and reduce DOM queries
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const schoolRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const availableCourses = [
    "Math", 
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Safety checks with refs
    if (!passwordRef.current || !confirmPasswordRef.current) return;

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage(null);

    // Collect form data using refs
    const formData = {
      name: nameRef.current?.value || '',
      email: emailRef.current?.value || '',
      phone: phoneRef.current?.value || '',
      address: addressRef.current?.value || '',
      dob: dobRef.current?.value || '',
      school: schoolRef.current?.value || '',
      password: password,
      profilePic: profilePic,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage("✅ Signup successful!");
        
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 text-white text-center py-4">
          <h2 className="text-3xl font-bold">Student Signup</h2>
        </div>

        <form 
          className="p-6 space-y-4" 
          onSubmit={handleSubmit}
        >
          {message && (
            <div className={`
              text-center p-3 rounded-lg 
              ${message.includes('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'}
            `}>
              {message}
            </div>
          )}

          {/* Full Name Input */}
          <div>
            <label 
              htmlFor="name" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input 
              ref={nameRef}
              type="text" 
              id="name" 
              className="w-full px-3 py-2 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500 transition duration-200" 
              required 
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input 
              ref={emailRef}
              type="email" 
              id="email" 
              className="w-full px-3 py-2 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500 transition duration-200" 
              required 
              placeholder="you@example.com"
            />
          </div>

          {/* Phone Number Input */}
          <div>
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input 
              ref={phoneRef}
              type="tel" 
              id="phone" 
              className="w-full px-3 py-2 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500 transition duration-200" 
              required 
              placeholder="+1 (123) 456-7890"
            />
          </div>

          {/* Address Input */}
          <div>
            <label 
              htmlFor="address" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <textarea 
              ref={addressRef}
              id="address" 
              className="w-full px-3 py-2 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500 transition duration-200" 
              required 
              placeholder="Enter your full address"
              rows={3}
            />
          </div>

          {/* Date of Birth Input */}
          <div>
            <label 
              htmlFor="dob" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth
            </label>
            <input 
              ref={dobRef}
              type="date" 
              id="dob" 
              className="w-full px-3 py-2 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500 transition duration-200" 
              required 
            />
          </div>

          {/* School Input */}
          <div>
            <label 
              htmlFor="school" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              School
            </label>
            <input 
              ref={schoolRef}
              type="text" 
              id="school" 
              className="w-full px-3 py-2 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500 transition duration-200" 
              required 
              placeholder="Enter your school name"
            />
          </div>

          {/* Profile Picture Input */}
          <div>
            <label 
              htmlFor="profile-pic" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Profile Picture
            </label>
            <input 
              type="file" 
              id="profile-pic" 
              accept="image/*" 
              className="w-full px-3 py-2 border border-gray-300 
                rounded-lg focus:outline-none focus:ring-2 
                focus:ring-blue-500 transition duration-200" 
              onChange={handleImageUpload} 
            />
            {profilePic && (
              <div className="mt-2 flex justify-center">
                <img 
                  src={profilePic} 
                  alt="Profile Preview" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500" 
                />
            
              </div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input 
                ref={passwordRef}
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="w-full px-3 py-2 border border-gray-300 
                  rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-blue-500 transition duration-200" 
                required 
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 
                  text-gray-500 hover:text-blue-600 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label 
              htmlFor="confirm-password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input 
                ref={confirmPasswordRef}
                type={showConfirmPassword ? "text" : "password"} 
                id="confirm-password" 
                className="w-full px-3 py-2 border border-gray-300 
                  rounded-lg focus:outline-none focus:ring-2 
                  focus:ring-blue-500 transition duration-200" 
                required 
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 
                  text-gray-500 hover:text-blue-600 transition"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
              
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={`
              w-full py-3 rounded-lg text-white font-semibold 
              transition duration-300 ease-in-out
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
              }
            `}
          >
            {loading ? "Submitting..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}