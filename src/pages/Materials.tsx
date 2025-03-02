import React, { useState } from 'react';
import { FileText, Download, Search, BookOpen, FileType2, Film, BookMarked, Filter } from 'lucide-react';

const Materials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const subjects = [
    { id: 'all', name: 'All Subjects' },
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' },
    { id: 'geography', name: 'Geography' },
  ];

  const materialTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'pdf', name: 'PDF Documents' },
    { id: 'video', name: 'Video Tutorials' },
    { id: 'presentation', name: 'Presentations' },
    { id: 'worksheet', name: 'Worksheets' },
  ];

  const materials = [
    { 
      id: 1, 
      title: 'Algebra Fundamentals', 
      subject: 'math', 
      type: 'pdf', 
      size: '2.4 MB',
      date: 'June 10, 2025',
      description: 'Comprehensive guide to basic algebraic concepts and equations.',
      icon: <FileText size={20} className="text-red-500" />
    },
    { 
      id: 2, 
      title: 'Cell Structure and Function', 
      subject: 'science', 
      type: 'pdf', 
      size: '3.1 MB',
      date: 'June 8, 2025',
      description: 'Detailed notes on cell biology, structure, and functions.',
      icon: <FileText size={20} className="text-red-500" />
    },
    { 
      id: 3, 
      title: 'Grammar Rules Explained', 
      subject: 'english', 
      type: 'pdf', 
      size: '1.8 MB',
      date: 'June 5, 2025',
      description: 'Complete guide to English grammar rules with examples.',
      icon: <FileText size={20} className="text-red-500" />
    },
    { 
      id: 4, 
      title: 'Geometry Basics Video Tutorial', 
      subject: 'math', 
      type: 'video', 
      size: '45 MB',
      date: 'June 3, 2025',
      description: 'Video tutorial explaining basic geometric concepts and formulas.',
      icon: <Film size={20} className="text-blue-500" />
    },
    { 
      id: 5, 
      title: 'Ancient Civilizations Presentation', 
      subject: 'history', 
      type: 'presentation', 
      size: '5.2 MB',
      date: 'May 28, 2025',
      description: 'Slide presentation on major ancient civilizations and their contributions.',
      icon: <FileType2 size={20} className="text-green-500" />
    },
    { 
      id: 6, 
      title: 'Science Lab Worksheet', 
      subject: 'science', 
      type: 'worksheet', 
      size: '1.2 MB',
      date: 'May 25, 2025',
      description: 'Practice worksheet for science experiments and observations.',
      icon: <BookMarked size={20} className="text-purple-500" />
    },
    { 
      id: 7, 
      title: 'World Geography Notes', 
      subject: 'geography', 
      type: 'pdf', 
      size: '4.5 MB',
      date: 'May 20, 2025',
      description: 'Comprehensive notes on world geography, continents, and major landmarks.',
      icon: <FileText size={20} className="text-red-500" />
    },
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
    const matchesType = selectedType === 'all' || material.type === selectedType;
    
    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Study Materials</h1>
      
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search materials..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BookOpen size={18} className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {materialTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Materials List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredMaterials.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredMaterials.map(material => (
              <div key={material.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 rounded">
                    {material.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{material.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{material.size}</span>
                      <span>{material.date}</span>
                    </div>
                  </div>
                  <button className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No materials found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;