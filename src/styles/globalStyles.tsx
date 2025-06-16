import React from 'react';

interface StyleProviderProps {
  children: React.ReactNode;
}

export const GlobalStyleProvider: React.FC<StyleProviderProps> = ({ children }) => {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            background-color: #121212;
            color: #FFFFFF;
            font-family: 'Exo 2', 'Roboto', sans-serif;
            min-height: 100vh;
          }
          
          a {
            color: #6A5ACD;
            text-decoration: none;
            transition: color 0.3s ease;
          }
          
          a:hover {
            color: #FF4081;
          }
          
          button {
            cursor: pointer;
            font-family: 'Exo 2', 'Roboto', sans-serif;
          }
          
          /* Custom scrollbar for the tech look */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #1E1E1E;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #6A5ACD;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #FF4081;
          }

          /* Animation classes */
          .fade-in {
            animation: fadeIn 0.5s ease;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .slide-up {
            animation: slideUp 0.5s ease;
          }
          
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          /* Utility classes */
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
          }
          
          .card {
            background: #1E1E1E;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19);
          }
          
          .glow {
            box-shadow: 0 0 10px rgba(106, 90, 205, 0.5);
          }
          
          .tech-border {
            border: 1px solid #333;
            border-top: 2px solid #00B0FF;
          }
          
          .anime-gradient-text {
            background: linear-gradient(90deg, #6A5ACD, #FF4081);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
          }
        `}
      </style>
      {children}
    </>
  );
};
