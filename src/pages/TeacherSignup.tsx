import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface CertificateData {
  name: string;
  issuedBy: string;
  issueDate: Date;
  certificateFile?: string;
}

const TeacherSignup: React.FC = () => {
  const navigate = useNavigate();
  
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
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
  const subjectSpecialityRef = useRef<HTMLSelectElement>(null);

  const certNameRef = useRef<HTMLInputElement>(null);
  const certIssuedByRef = useRef<HTMLInputElement>(null);
  const certDateRef = useRef<HTMLInputElement>(null);
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

  const handleAddCertificate = () => {
    if (
      certNameRef.current?.value && 
      certIssuedByRef.current?.value && 
      certDateRef.current?.value
    ) {
      const newCertificate: CertificateData = {
        name: certNameRef.current.value,
        issuedBy: certIssuedByRef.current.value,
        issueDate: new Date(certDateRef.current.value),
      };

      if (certFileRef.current?.files?.length) {
        const file = certFileRef.current.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          newCertificate.certificateFile = reader.result as string;
          setCertificates([...certificates, newCertificate]);
          certNameRef.current!.value = '';
          certIssuedByRef.current!.value = '';
          certDateRef.current!.value = '';
          certFileRef.current!.value = '';
        };
        reader.readAsDataURL(file);
      } else {
        setCertificates([...certificates, newCertificate]);
        certNameRef.current.value = '';
        certIssuedByRef.current.value = '';
        certDateRef.current.value = '';
      }
    } else {
      setMessage("❌ Please fill in all certificate details");
    }
  };

  const handleRemoveCertificate = (index: number) => {
    const updatedCertificates = certificates.filter((_, i) => i !== index);
    setCertificates(updatedCertificates);
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
      password: password,
      phone: phoneRef.current?.value || undefined,
      address: addressRef.current?.value || undefined,
      dateOfBirth: dobRef.current?.value ? new Date(dobRef.current.value) : undefined,
      school: schoolRef.current?.value || undefined,
      profilePicture: profilePic || undefined,
      subjectSpeciality: subjectSpecialityRef.current?.value || undefined,
      certificates: certificates.length > 0 ? certificates : undefined,
    };

    try {
      const response = await fetch("http://localhost:5000/api/teacher/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Signup successful!");
        setTimeout(() => navigate('/login'), 2000);
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
        <div className="bg-green-600 text-white text-center py-4">
          <h2 className="text-3xl font-bold">Teacher Signup</h2>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input ref={nameRef} type="text" id="name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" required placeholder="Enter your full name" />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input ref={emailRef} type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" required placeholder="you@example.com" />
          </div>

          {/* Phone Number Input */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
            <input ref={phoneRef} type="tel" id="phone" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" placeholder="+1 (123) 456-7890" />
          </div>

          {/* Address Input */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
            <textarea ref={addressRef} id="address" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" placeholder="Enter your full address" rows={2} />
          </div>

          {/* Date of Birth Input */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (Optional)</label>
            <input ref={dobRef} type="date" id="dob" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" />
          </div>

          {/* School Input */}
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">School/Institution (Optional)</label>
            <input ref={schoolRef} type="text" id="school" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" placeholder="Enter your school/institution name" />
          </div>

          {/* Subject Speciality */}
          <div>
            <label htmlFor="subject-speciality" className="block text-sm font-medium text-gray-700 mb-1">Subject Speciality</label>
            <select ref={subjectSpecialityRef} id="subject-speciality" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" required>
              <option value="">Select Your Subject Speciality</option>
              {subjectSpecialities.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Certificates Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Certificates</label>
            <div className="space-y-3 mb-4">
              <input ref={certNameRef} type="text" placeholder="Certificate Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <input ref={certIssuedByRef} type="text" placeholder="Issued By" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <input ref={certDateRef} type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <input ref={certFileRef} type="file" accept=".pdf,.doc,.docx,image/*" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
              <button type="button" onClick={handleAddCertificate} className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Add Certificate</button>
            </div>

            {/* Certificates List */}
            {certificates.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-medium mb-2">Added Certificates:</h4>
                <ul className="space-y-2">
                  {certificates.map((cert, index) => (
                    <li key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                      <div>
                        <p className="font-semibold">{cert.name}</p>
                        <p className="text-sm text-gray-600">Issued by {cert.issuedBy} on {cert.issueDate.toLocaleDateString()}</p>
                      </div>
                      <button type="button" onClick={() => handleRemoveCertificate(index)} className="text-red-500 hover:text-red-700">❌</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Profile Picture Input */}
          <div>
            <label htmlFor="profile-pic" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Optional)</label>
            <input type="file" id="profile-pic" accept="image/*" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" onChange={handleImageUpload} />
            {profilePic && (
              <div className="mt-2 flex justify-center">
                <img src={profilePic} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover border-2 border-green-500" />
              </div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input ref={passwordRef} type={showPassword ? "text" : "password"} id="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" required placeholder="Enter your password" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input ref={confirmPasswordRef} type={showConfirmPassword ? "text" : "password"} id="confirm-password" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200" required placeholder="Confirm your password" />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-600 transition" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ease-in-out ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}`}>
            {loading ? "Submitting..." : "Sign Up"}
          </button>

          {/* Login Redirect */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">Already have an account?{' '}
              <span onClick={() => navigate('/login')} className="text-green-600 hover:underline cursor-pointer">Login here</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherSignup;