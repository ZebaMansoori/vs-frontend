// import React from "react";

// import axios from "axios"



// function App() {

//   const [ isModalOpen, setIsModalOpen ] = React.useState(false);
//   const [ newFileName, setNewFileName ] = React.useState("");


//   function createNewFile() {
//     setIsModalOpen(true);
//   }


//   function handleFormSubmit(e) {
//     e.preventDefault();
  
//     console.log("Form submitted");
  
//     const data = {
//       fileName: newFileName // Ensure this is correctly set
//     };
  
//     console.log("Data sent to backend:", data);
  
//     axios.post('http://localhost:3000/create', data)
//       .then(response => {
//         console.log("File created successfully:", response.data);
//       })
//       .catch(error => {
//         console.error("Error creating file:", error);
//       });
//   }
  


//   return (
//     <div className="flex h-screen w-screen">
//       <aside className="bg-gray-100 min-w-80 text-black p-4 flex flex-col">
//         <div className="mb-4 text-xl flex justify-between items-center">
//           <h3 className="font-semibold" >Explorer</h3>
//           <i
//             onClick={createNewFile}
//             className="ri-add-line bg-blue-500 text-white p-0 px-1 rounded cursor-pointer"
//           ></i>
//         </div>
//         <ul>
//           <li className="mb-2">
//             <i className="ri-file-line mr-2"></i> file1.txt
//           </li>
//           <li className="mb-2">
//             <i className="ri-file-line mr-2"></i> file2.txt
//           </li>
//           <li className="mb-2">
//             <i className="ri-file-line mr-2"></i> file3.txt
//           </li>
//         </ul>
//       </aside>
//       <main className="flex-1 bg-gray-300 text-black">
//         <textarea
//           className="w-full h-full border-none p-2 outline-none "
//           placeholder="Edit your file here..."
//         ></textarea>
//       </main>

//       {isModalOpen && (
//         <div className="fixed  inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
//           <div className="p-4 rounded shadow-lg bg-gray-800">
//             <h2 className="text-xl mb-4">Create New File</h2>
//             <form onSubmit={handleFormSubmit}>
//               <input
//                 type="text"
//                 value={newFileName}
//                 onChange={(e) => setNewFileName(e.target.value)}
//                 className="border p-2 mb-4 w-full rounded-md outline-none"
//                 placeholder="Enter file name"
//                 required
//               />
//               <button
//                 type="submit"
//                 className="text-white w-fit cursor-pointer p-2 rounded"
//               >
//                 Create
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [files, setFiles] = useState([]); // Stores file list
  const [fileContent, setFileContent] = useState(""); // Stores current file content
  const [selectedFile, setSelectedFile] = useState(null); // Stores selected file

  // Fetch all files from backend
  useEffect(() => {
    fetchFiles();
  }, []);

  function fetchFiles() {
    axios.get("http://localhost:3000/get-all")
      .then(response => {
        setFiles(response.data.files);
      })
      .catch(error => {
        console.error("Error fetching files:", error);
      });
  }

  function createNewFile() {
    setIsModalOpen(true);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const data = {
      fileName: newFileName,
      fileData: "" // Default empty file content
    };

    axios.post("http://localhost:3000/create", data)
      .then(response => {
        console.log("File created successfully:", response.data);
        fetchFiles(); // Refresh file list
        setIsModalOpen(false);
        setNewFileName(""); // Clear input
      })
      .catch(error => {
        console.error("Error creating file:", error);
      });
  }

  function readFile(fileName) {
    axios.get(`http://localhost:3000/read/${fileName}`)
      .then(response => {
        setFileContent(response.data.content);
        setSelectedFile(fileName);
      })
      .catch(error => {
        console.error("Error reading file:", error);
      });
  }

  function handleFileChange(e) {
    setFileContent(e.target.value);
  }

  function updateFile() {
    if (!selectedFile) return;

    axios.patch(`http://localhost:3000/update/${selectedFile}`, { fileData: fileContent })
      .then(response => {
        console.log("File updated:", response.data);
      })
      .catch(error => {
        console.error("Error updating file:", error);
      });
  }

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside className="bg-gray-100 min-w-80 text-black p-4 flex flex-col">
        <div className="mb-4 text-xl flex justify-between items-center">
          <h3 className="font-semibold">Explorer</h3>
          <i
            onClick={createNewFile}
            className="ri-add-line bg-blue-500 text-white p-0 px-1 rounded cursor-pointer"
          ></i>
        </div>

        {/* File List */}
        <ul>
          {files.length > 0 ? (
            files.map((file, index) => (
              <li
                key={index}
                className="mb-2 cursor-pointer hover:bg-gray-200 p-1 rounded"
                onClick={() => readFile(file)}
              >
                <i className="ri-file-line mr-2"></i> {file}
              </li>
            ))
          ) : (
            <p>No files found</p>
          )}
        </ul>
      </aside>

      {/* Main Editor */}
      <main className="flex-1 bg-gray-300 text-black">
        <textarea
          className="w-full h-full border-none p-2 outline-none"
          placeholder="Edit your file here..."
          value={fileContent}
          onChange={handleFileChange}
        ></textarea>
        <button
          onClick={updateFile}
          className="bg-green-500 text-white p-2 mt-2 rounded"
        >
          Save File
        </button>
      </main>

      {/* Create New File Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
          <div className="p-4 rounded shadow-lg bg-gray-800">
            <h2 className="text-xl mb-4 text-white">Create New File</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="border p-2 mb-4 w-full rounded-md outline-none"
                placeholder="Enter file name"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded w-full"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

