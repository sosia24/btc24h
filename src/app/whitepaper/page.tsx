"use client"
import React from 'react';
import Flag from 'react-world-flags';

function App() {
  // Função para abrir o PDF correspondente
  const openPDF = (pdfUrl) => {
    window.open(pdfUrl, '_blank'); // Abre em uma nova aba
  };

  return (
    <>
    <p className='mt-[100px] text-[30px]'>Select your language</p>
    <div className="w-[80%] flex flex-row items-center justify-center">
      {/* Bandeira do Brasil */}
      <div
        className="w-[30%] m-4 flex items-center justify-center transition-transform transform hover:scale-110 cursor-pointer"
        onClick={() => openPDF('/pdf/BR.pdf')} // Substitua pelo caminho real do PDF
      >
        <Flag code="BR" style={{ width: '300px', height: '200px' }} />
      </div>

      {/* Bandeira dos EUA */}
      <div
        className="w-[30%] m-4 flex items-center justify-center transition-transform transform hover:scale-110 cursor-pointer"
        onClick={() => openPDF('/pdf/EN.pdf')}
      >
        <Flag code="US" style={{ width: '300px', height: '200px' }} />
      </div>

      {/* Bandeira da Espanha */}
      <div
        className="w-[30%] m-4 flex items-center justify-center transition-transform transform hover:scale-110 cursor-pointer"
        onClick={() => openPDF('/pdf/ES.pdf')}
      >
        <Flag code="ES" style={{ width: '300px', height: '200px' }} />
      </div>
    </div>
    </>
  );
}

export default App;
