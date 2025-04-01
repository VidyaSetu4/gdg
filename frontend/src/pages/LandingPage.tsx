import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  Download, 
  MessageSquareMore, 
  Trophy,
  Users,
  GraduationCap,
  Globe2,
  PlayCircle,
  FileDown,
  TestTube,
  Bot,
  BookOpenCheck,
  BarChart3,
  School,
  GraduationCap as GraduationIcon,
  Building2,
  Users2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSignupClick = () => {
    setShowSignupModal(true);
  };

  const handleLoginClick = () => {
    navigate('/login'); // Adjust the route as necessary
  };

  const handleSignupTypeSelect = (type: 'student' | 'teacher') => {
    setShowSignupModal(false);
    navigate(`/signup/${type}`);
  };

  const scrollToSection = (sectionId:string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Hero Section */}
          <header className="bg-white/90 backdrop-blur-sm fixed w-full z-50 shadow-lg border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 text-[#4285F4]" />
                <span className="text-2xl font-bold text-gray-900">VidyaSetu</span>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-700 hover:text-[#4285F4] transition-colors font-medium"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("impact")}
                  className="text-gray-700 hover:text-[#DB4437] transition-colors font-medium"
                >
                  Impact
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-700 hover:text-[#F4B400] transition-colors font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("benefits")}
                  className="text-gray-700 hover:text-[#0F9D58] transition-colors font-medium"
                >
                  Benefits
                </button>

                {/* Buttons */}
                <button
                  onClick={handleLoginClick}
                  className="bg-[#4285F4] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#357AE8] transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleSignupClick}
                  className="bg-[#4285F4] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#357AE8] transition-colors"
                >
                  Join Now
                </button>
              </nav>
            </div>
          </div>
        </header>
        <main>
        {/* Hero Section */}
        {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2070&q=80"
            alt="Education Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Building Bridges to Education
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            VidyaSetu, meaning "Bridge of Knowledge," connects underserved communities with quality education through innovative technology. 
            We're breaking down barriers and creating pathways to learning for everyone, everywhere.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleSignupClick} 
              className="bg-[#4285F4] text-white px-8 py-3 rounded-lg shadow-lg hover:bg-[#357AE8] transition-colors text-lg"
            >
              Start Learning
            </button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1488254491307-10ca8fa174c8?auto=format&fit=crop&w=1000&q=80"
                alt="Students learning"
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                In a world where education remains inaccessible to millions, VidyaSetu stands as a beacon of hope. 
                We leverage technology to overcome geographical, economic, and social barriers that prevent access to quality education.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <BookOpenCheck className="h-6 w-6 text-[#4285F4]" />
                  <span className="text-gray-700">Personalized learning paths for every student</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Globe2 className="h-6 w-6 text-[#DB4437]" />
                  <span className="text-gray-700">Breaking geographical barriers through technology</span>
                </li>
                <li className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-[#F4B400]" />
                  <span className="text-gray-700">Data-driven approach to improve learning outcomes</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-[#0F9D58]" />
                  <span className="text-gray-700">Building a global community of learners and educators</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

        {/* Impact Stats */}
      <section id="impact" className="py-20 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">50,000+</h3>
              <p className="text-yellow-200">Active Students</p>
            </div>
            <div className="text-center">
              <Globe2 className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">100+</h3>
              <p className="text-yellow-200">Countries Reached</p>
            </div>
            <div className="text-center">
              <Trophy className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">90%</h3>
              <p className="text-yellow-200">Completion Rate</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-white mb-2">1000+</h3>
              <p className="text-yellow-200">Course Materials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Features of VidyaSetu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Interactive Learning",
                desc: "Engage with interactive content that makes learning fun and effective.",
                img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
                shadow: "hover:shadow-[0_4px_20px_#4285F4]", // Blue
              },
              {
                title: "Personalized Learning",
                desc: "Tailor your learning experience to fit your individual needs and pace.",
                img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80",
                shadow: "hover:shadow-[0_4px_20px_#EA4335]", // Red
              },
              {
                title: "24/7 Support",
                desc: "Get assistance anytime with our dedicated support team and resources.",
                img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1000&q=80",
                shadow: "hover:shadow-[0_4px_20px_#FBBC05]", // Yellow
              },
              {
                title: "Community Engagement",
                desc: "Join a community of learners and educators to share knowledge and experiences.",
                img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
                shadow: "hover:shadow-[0_4px_20px_#34A853]", // Green
              },
              {
                title: "Resource Sharing",
                desc: "Access a wealth of resources, including study materials and tools.",
                img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80",
                shadow: "hover:shadow-[0_4px_20px_#EA4335]", // Red
              },
              {
                title: "Data Insights",
                desc: "Utilize analytics to track progress and improve learning outcomes.",
                img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1000&q=80",
                shadow: "hover:shadow-[0_4px_20px_#4285F4]", // Blue
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-gray-100 rounded-lg p-6 shadow-md transition-transform duration-300 hover:scale-105 ${feature.shadow}`}
                >
                <img src={feature.img} alt={feature.title} className="w-full h-32 object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Who Benefits from VidyaSetu?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Students",
                icon: <School className="h-12 w-12 text-red-600 mx-auto mb-6" />,
                benefits: ["Flexible learning schedule", "Personalized attention", "Quality study materials", "Peer learning opportunities"],
                shadow: "hover:shadow-[0_4px_20px_#EA4335]", // Red
              },
              {
                title: "Teachers",
                icon: <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-6" />,
                benefits: ["Digital teaching tools", "Student progress tracking", "Resource sharing", "Professional development"],
                shadow: "hover:shadow-[0_4px_20px_#4285F4]", // Blue
              },
              {
                title: "Institutions",
                icon: <Building2 className="h-12 w-12 text-yellow-600 mx-auto mb-6" />,
                benefits: ["Infrastructure savings", "Wider reach", "Data-driven insights", "Quality standardization"],
                shadow: "hover:shadow-[0_4px_20px_#FBBC05]", // Yellow
              },
              {
                title: "Communities",
                icon: <Users2 className="h-12 w-12 text-green-600 mx-auto mb-6" />,
                benefits: ["Improved literacy rates", "Skill development", "Economic growth", "Social empowerment"],
                shadow: "hover:shadow-[0_4px_20px_#34A853]", // Green
              },
            ].map((group, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-8 shadow-lg text-center transition-transform duration-300 hover:scale-105 ${group.shadow}`}
                >
                {group.icon}
                <h3 className="text-xl font-bold text-gray-800 mb-4">{group.title}</h3>
                <ul className="text-gray-600 space-y-2">
                  {group.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      
        {/* CTA Section */}
        <section className="py-20 bg-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2070&q=80"
              alt="Education Background"
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Learning Journey?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students already benefiting from our platform. 
              Take the first step towards quality education that knows no boundaries.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleSignupClick} 
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors text-lg font-semibold transform hover:scale-105"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Signup Type Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 text-center">
            <h2 className="text-2xl font-bold mb-6">Choose Signup Type</h2>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleSignupTypeSelect('student')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex flex-col items-center shadow-md"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mb-2"
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2z"/>
                  <path d="M9 12h6"/>
                  <path d="M12 9v6"/>
                </svg>
                Student
              </button>
              <button
                onClick={() => handleSignupTypeSelect('teacher')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex flex-col items-center shadow-md"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mb-2"
                >
                  <path d="M17 6.1H3"/>
                  <path d="M21 12.5H3"/>
                  <path d="M15.1 18H3"/>
                  <path d="m17 12 5-3-5-3v6z"/>
                </svg>
                Teacher
              </button>
            </div>
            <button
              onClick={() => setShowSignupModal(false)}
              className="mt-6 text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <GraduationCap className="h-8 w-8 text-indigo-400 mr-2" />
            <span className="text-2xl font-bold">VidyaSetu</span>
          </div>
          <p className="text-center text-gray-400 max-w-2xl mx-auto">
            VidyaSetu is committed to bridging the educational divide through technology. 
            Join us in our mission to make quality education accessible to all, regardless of geographical or economic barriers.
          </p>
          <div className="mt-8 text-center text-gray-500">
            © 2025 VidyaSetu. Empowering minds, transforming futures.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;