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
      <header className="bg-white/80 backdrop-blur-sm fixed w-full z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-800">VidyaSetu</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-indigo-600 transition-colors">About</button>
              <button onClick={() => scrollToSection('impact')} className="text-gray-600 hover:text-indigo-600 transition-colors">Impact</button>
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-indigo-600 transition-colors">Features</button>
              <button onClick={() => scrollToSection('benefits')} className="text-gray-600 hover:text-indigo-600 transition-colors">Benefits</button>
              <button 
                onClick={handleSignupClick} 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
              >
                Join Now
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main>
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
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors text-lg"
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
                    <BookOpenCheck className="h-6 w-6 text-indigo-600" />
                    <span className="text-gray-700">Personalized learning paths for every student</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Globe2 className="h-6 w-6 text-indigo-600" />
                    <span className="text-gray-700">Breaking geographical barriers through technology</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                    <span className="text-gray-700">Data-driven approach to improve learning outcomes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section id="impact" className="py-20 bg-indigo-600">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-white mb-2">50,000+</h3>
                <p className="text-indigo-100">Active Students</p>
              </div>
              <div className="text-center">
                <Globe2 className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-white mb-2">100+</h3>
                <p className="text-indigo-100">Countries Reached</p>
              </div>
              <div className="text-center">
                <Trophy className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-white mb-2">90%</h3>
                <p className="text-indigo-100">Completion Rate</p>
              </div>
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-white mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-white mb-2">1000+</h3>
                <p className="text-indigo-100">Course Materials</p>
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
              <div className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80"
                  alt="Interactive Learning"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Interactive Learning</h3>
                <p className="text-gray-600">Engage with interactive content that makes learning fun and effective.</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80"
                  alt="Personalized Learning"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Personalized Learning</h3>
                <p className="text-gray-600">Tailor your learning experience to fit your individual needs and pace.</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1000&q=80"
                  alt="24/7 Support"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
                <p className="text-gray-600">Get assistance anytime with our dedicated support team and resources.</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80"
                  alt="Community Engagement"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Community Engagement</h3>
                <p className="text-gray-600">Join a community of learners and educators to share knowledge and experiences.</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80"
                  alt="Resource Sharing"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Resource Sharing</h3>
                <p className="text-gray-600">Access a wealth of resources, including study materials and tools.</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1000&q=80"
                  alt="Data Insights"
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Data Insights</h3>
                <p className="text-gray-600">Utilize analytics to track progress and improve learning outcomes.</p>
              </div>
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
              <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:scale-105 transition-transform duration-300">
                <School className="h-12 w-12 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-800 mb-4">Students</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Flexible learning schedule</li>
                  <li>Personalized attention</li>
                  <li>Quality study materials</li>
                  <li>Peer learning opportunities</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:scale-105 transition-transform duration-300">
                <GraduationIcon className="h-12 w-12 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-800 mb-4">Teachers</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Digital teaching tools</li>
                  <li>Student progress tracking</li>
                  <li>Resource sharing</li>
                  <li>Professional development</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:scale-105 transition-transform duration-300">
                <Building2 className="h-12 w-12 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-800 mb-4">Institutions</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Infrastructure savings</li>
                  <li>Wider reach</li>
                  <li>Data-driven insights</li>
                  <li>Quality standardization</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:scale-105 transition-transform duration-300">
                <Users2 className="h-12 w-12 text-indigo-600 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-800 mb-4">Communities</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>Improved literacy rates</li>
                  <li>Skill development</li>
                  <li>Economic growth</li>
                  <li>Social empowerment</li>
                </ul>
              </div>
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
            © 2024 VidyaSetu. Empowering minds, transforming futures.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;