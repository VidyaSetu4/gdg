import React from 'react';
import { FileText, Download, Upload, Search } from 'lucide-react';

const ProvideMaterials = () => {
  const materials = [
    {
      id: 1,
      title: 'Algebra Fundamentals',
      type: 'PDF',
      size: '2.5 MB',
      uploadedDate: '2024-03-15',
      downloads: 125,
      url: '#',
    },
    {
      id: 2,
      title: 'Geometry Practice Problems',
      type: 'PDF',
      size: '1.8 MB',
      uploadedDate: '2024-03-14',
      downloads: 98,
      url: '#',
    },
    {
      id: 3,
      title: 'Calculus Study Guide',
      type: 'PDF',
      size: '3.2 MB',
      uploadedDate: '2024-03-13',
      downloads: 156,
      url: '#',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Study Materials</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center">
          <Upload size={20} className="mr-2" />
          Upload Material
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <FileText size={24} className="text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{material.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span>{material.type}</span>
                  <span className="mx-2">•</span>
                  <span>{material.size}</span>
                  <span className="mx-2">•</span>
                  <span>Uploaded on {material.uploadedDate}</span>
                  <span className="mx-2">•</span>
                  <span>{material.downloads} downloads</span>
                </div>
              </div>
            </div>
            <a
              href={material.url}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Download size={16} className="mr-2" />
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProvideMaterials;