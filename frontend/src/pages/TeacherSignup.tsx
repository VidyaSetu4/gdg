import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherSignup = () => {
  const navigate = useNavigate();
  
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<{ 
    name: string; 
    issuedBy: string; 
    issueDate: Date; 
    certificateFile?: string | ArrayBuffer | null; 
  }[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [certName, setCertName] = useState('');
  const [certIssuedBy, setCertIssuedBy] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);

  // Refs for form elements
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const schoolRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const subjectSpecialityRef = useRef<HTMLSelectElement>(null);
  const certFileRef = useRef<HTMLInputElement>(null);

  const subjectSpecialities = [
    'Mathematics', 'Science', 'Computer Science', 'English', 
    'History', 'Physics', 'Chemistry', 'Biology', 
    'Arts', 'Physical Education'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCertFile(file);
    }
  };

  const handleAddCertificate = () => {
    if (certName && certIssuedBy && certDate) {
      const newCertificate: { 
        name: string; 
        issuedBy: string; 
        issueDate: Date; 
        certificateFile?: string | ArrayBuffer | null; 
      } = {
        name: certName,
        issuedBy: certIssuedBy,
        issueDate: new Date(certDate),
      };

      if (certFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newCertificate.certificateFile = reader.result;
          setCertificates([...certificates, newCertificate]);
          // Reset certificate form
          setCertName('');
          setCertIssuedBy('');
          setCertDate('');
          setCertFile(null);
          if (certFileRef.current) certFileRef.current.value = '';
        };
        reader.readAsDataURL(certFile);
      } else {
        setCertificates([...certificates, newCertificate]);
        // Reset certificate form
        setCertName('');
        setCertIssuedBy('');
        setCertDate('');
      }
    } else {
      setMessage("❌ Please fill in all certificate details");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRemoveCertificate = (index: number) => {
    const updatedCertificates = certificates.filter((_, i) => i !== index);
    setCertificates(updatedCertificates);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!passwordRef.current || !confirmPasswordRef.current) return;

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage("✅ Signup successful!");
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage("❌ Failed to connect to server.");
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Blue Welcome Section with Violet Touches (1/4 width) */}
<div className="w-1/4 bg-gradient-to-b from-blue-600 to-violet-700 text-white p-8 flex flex-col">
  <div>
    <h1 className="text-3xl font-bold mb-4">Welcome to EduTeach!</h1>
    <p className="text-violet-100 mb-8">Join our teaching community and start your educational journey today.</p>
  </div>
  
  <div className="space-y-6 flex-grow">
    <div className="flex items-center">
      <div className="bg-violet-400 bg-opacity-30 rounded-full p-2 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="text-lg">Create your teacher profile</span>
    </div>
    <div className="flex items-center">
      <div className="bg-violet-400 bg-opacity-30 rounded-full p-2 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="text-lg">Share your expertise</span>
    </div>
    <div className="flex items-center">
      <div className="bg-violet-400 bg-opacity-30 rounded-full p-2 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="text-lg">Connect with students</span>
    </div>
  </div>
  
  <div className="mt-auto text-center pt-8">
    <p className="mb-3 text-violet-100">Already have an account?</p>
    <button 
      onClick={() => navigate('/login')}
      className="bg-white text-violet-700 px-6 py-2 rounded-lg text-lg font-medium hover:bg-violet-50 transition shadow-lg"
    >
      Log In
    </button>
    
    <div className="mt-8 text-xs text-violet-200">
      <p>© 2025 EduTeach. All rights reserved.</p>
    </div>
  </div>
</div>
      
      {/* Right Panel - Form (3/4 width) */}
      <div className="w-3/4 bg-white p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Your Teacher Account</h2>
          
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input ref={nameRef} type="text" id="name" className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required placeholder="Enter your full name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input ref={emailRef} type="email" id="email" className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required placeholder="you@example.com" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input ref={phoneRef} type="tel" id="phone" className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+1 (123) 456-7890" />
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input ref={dobRef} type="date" id="dob" className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea ref={addressRef} id="address" className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your full address" rows={2} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">School</label>
                <input ref={schoolRef} type="text" id="school" className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your school/institution name" />
              </div>
              <div>
                <label htmlFor="subject-speciality" className="block text-sm font-medium text-gray-700 mb-1">Subject Speciality</label>
                <select ref={subjectSpecialityRef} id="subject-speciality" className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="">Select Your Subject</option>
                  {subjectSpecialities.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">Certificates (Optional)</label>
              <div className="flex flex-wrap gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <input 
                    type="text" 
                    placeholder="Certificate Name" 
                    className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <input 
                    type="text" 
                    placeholder="Issued By" 
                    className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={certIssuedBy}
                    onChange={(e) => setCertIssuedBy(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <input 
                    type="date" 
                    className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                  />
                </div>
                <div className="flex-shrink-0">
                  <input 
                    ref={certFileRef} 
                    type="file" 
                    accept=".pdf,.doc,.docx,image/*" 
                    className="sr-only" 
                    id="cert-file"
                    onChange={handleCertFileChange}
                  />
                  <label htmlFor="cert-file" className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg inline-block text-gray-700">
                    Browse
                  </label>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddCertificate} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex-shrink-0"
                >
                  Add
                </button>
              </div>
              
              {certificates.length > 0 && (
                <div className="max-h-32 overflow-y-auto bg-white rounded-lg p-3 border border-gray-200">
                  <ul className="space-y-2">
                    {certificates.map((cert, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg shadow-sm">
                        <div className="truncate">
                          <span className="font-medium">{cert.name}</span>
                          <span className="text-sm text-gray-600"> - {cert.issuedBy}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveCertificate(index)} 
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1 rounded-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="profile-pic" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input type="file" id="profile-pic" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                    <label htmlFor="profile-pic" className="cursor-pointer w-full p-2 text-gray-700 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 inline-block text-center">
                      Choose File
                    </label>
                  </div>
                  {profilePic ? (
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-blue-500">
                      <img src={profilePic} alt="Profile Preview" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input ref={passwordRef} type={showPassword ? "text" : "password"} id="password" className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required placeholder="Enter password" />
                    <button 
                      type="button" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition p-1" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        {showPassword ? (
                          <>
                            <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </>
                        ) : (
                          <>
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input ref={confirmPasswordRef} type={showConfirmPassword ? "text" : "password"} id="confirm-password" className="w-full p-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required placeholder="Confirm password" />
                    <button 
                      type="button" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition p-1" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        {showConfirmPassword ? (
                          <>
                            <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </>
                        ) : (
                          <>
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </>
                        )}
                      </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg text-lg"
              >
                {loading ? (
                  <React.Fragment>
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Account...</span>
                    </div>
                  </React.Fragment>
                ) : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignup;