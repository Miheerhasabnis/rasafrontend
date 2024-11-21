// import React, { useState } from 'react';

// function FileUpload({ onFileUpload }) {
//   const [file, setFile] = useState(null);
//   const [responseMessage, setResponseMessage] = useState('');  // State to store the response message

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) return;
//     const formData = new FormData();
//     formData.append('csv', file);  // Updated file field name to 'csv'

//     try {
//       const response = await fetch('http://localhost:5000/upload_csv', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();  // Parse the response as JSON

//       if (response.ok) {
//         setResponseMessage(data.message || 'File uploaded and processed successfully');
//         onFileUpload();
//       } else {
//         setResponseMessage(data.error || 'Error uploading file');
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       setResponseMessage('An error occurred while uploading the file.');
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept=".csv" onChange={handleFileChange} /> {/* Accept .csv files */}
//       <button onClick={handleUpload}>Upload CSV</button>
//       {responseMessage && <p>{responseMessage}</p>}  {/* Display server response */}
//     </div>
//   );
// }

// export default FileUpload;
import React, { useState } from 'react';

function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [responseMessage, setResponseMessage] = useState(''); // State to store the response message

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('csv', file); // Updated file field name to 'csv'

    try {
      const response = await fetch('http://98.84.191.214:5000/upload_csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json(); // Parse the response as JSON

      if (response.ok) {
        setResponseMessage(data.message || 'File uploaded and processed successfully');
        onFileUpload();
      } else {
        setResponseMessage(data.error || 'Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setResponseMessage('An error occurred while uploading the file.');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('http://98.84.191.214:5000/download', {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'downloaded_file.csv'; // Set the default file name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setResponseMessage('File downloaded successfully');
      } else {
        setResponseMessage('Error downloading file');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      setResponseMessage('An error occurred while downloading the file.');
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} /> {/* Accept .csv files */}
      <button onClick={handleUpload}>Upload CSV</button>
      <button onClick={handleDownload}>Download CSV</button>
      {responseMessage && <p>{responseMessage}</p>} {/* Display server response */}
    </div>
  );
}

export default FileUpload;
