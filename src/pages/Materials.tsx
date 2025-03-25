import { useEffect, useState } from "react";
import axios from "axios";
import { Download, Eye, Loader2, AlertTriangle } from "lucide-react";

interface Note {
  courseName: string;
  subject: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

const Materials = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{key: keyof Note, direction: 'asc' | 'desc'}>({
    key: 'uploadedAt',
    direction: 'desc'
  });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/course/notes", {
          headers: { Authorization: `${token}` },
        });

        if (response.data && Array.isArray(response.data.notes)) {
          setNotes(response.data.notes);
        } else {
          setNotes([]);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to fetch materials.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Sorting function
  const sortedNotes = [...notes].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filtering function
  const filteredNotes = sortedNotes.filter(note => 
    note.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sorting
  const handleSort = (key: keyof Note) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4">
          <h2 className="text-2xl font-bold flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Uploaded Materials
          </h2>
        </div>

        {/* Search and Loading */}
        <div className="p-4 bg-gray-50 flex items-center space-x-4">
          <input 
            type="text" 
            placeholder="Search materials..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {loading && <Loader2 className="animate-spin text-blue-600" />}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center">
            <AlertTriangle className="text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* No Materials State */}
        {!loading && filteredNotes.length === 0 && (
          <div className="text-center py-8 bg-gray-100">
            <p className="text-gray-600">No materials available.</p>
          </div>
        )}

        {/* Materials Table */}
        {!loading && filteredNotes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  {(['courseName', 'subject', 'fileName', 'uploadedAt'] as (keyof Note)[]).map((key) => (
                    <th 
                      key={key}
                      onClick={() => handleSort(key)}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <div className="flex items-center">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        <span className="ml-2">
                          {sortConfig.key === key && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredNotes.map((note, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">{note.courseName}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{note.subject}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{note.fileName}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {new Date(note.uploadedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <a 
                          href={note.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                        >
                          <Eye className="mr-1" size={16} />
                          View
                        </a>
                        <a 
                          href={note.fileUrl} 
                          download
                          className="text-green-600 hover:text-green-800 transition-colors flex items-center"
                        >
                          <Download className="mr-1" size={16} />
                          Download
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;