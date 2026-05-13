import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EbookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch detail ebook dari backend Laravel
    const fetchEbook = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/ebooks/${id}`);
        if (response.data.success) {
          setEbook(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching ebook details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEbook();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-lg font-semibold animate-pulse">Memuat Ebook...</p>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-red-500 font-bold">Ebook tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header Minimalis */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm border-b">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">{ebook.judul}</h1>
        </div>
        
        <a 
          href={ebook.pdf_url} 
          download={`${ebook.judul}.pdf`}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Unduh PDF
        </a>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 w-full bg-gray-200">
        <iframe
          src={`${ebook.pdf_url}#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full border-none"
          title={`Ebook Viewer: ${ebook.judul}`}
        />
      </div>
    </div>
  );
}
