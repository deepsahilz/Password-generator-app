import { useState, useEffect } from 'react';
import dfavicon from "../assets/DFavicon.png"

export default function generatePassword() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      setPassword('Please select at least one character type');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    
    setPassword(newPassword);
    calculateStrength(newPassword);
  };

  const calculateStrength = (pass) => {
    let score = 0;
    
    // Length check
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (pass.length >= 16) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    // Variety check
    const uniqueChars = new Set(pass).size;
    if (uniqueChars > pass.length * 0.7) score += 1;
    
    setStrength(Math.min(score, 5));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Add to history if not already there
    if (password && !history.includes(password)) {
      setHistory(prev => [password, ...prev].slice(0, 5));
    }
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const getStrengthLabel = () => {
    if (strength <= 1) return { text: 'Very Weak', color: 'bg-red-500' };
    if (strength === 2) return { text: 'Weak', color: 'bg-orange-400' };
    if (strength === 3) return { text: 'Moderate', color: 'bg-yellow-300' };
    if (strength === 4) return { text: 'Strong', color: 'bg-yellow-400' };
    return { text: 'Very Strong', color: 'bg-yellow-300' };
  };

  const strengthInfo = getStrengthLabel();

  return (
    <div className="min-h-screen overflow-hidden relative font-neue bg-zinc-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 space-y-6 border border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-black text-center">ShadowPass.io</h1>
          <h1 className="text-sm font-semibold  text-zinc-500 text-center">Generate your secure custom password</h1>
        </div>
        
        <div className="relative">
          <div className="bg-gray-50 rounded-lg px-4 py-2 flex justify-between items-center border border-gray-200">
            <span className="text-gray-900 font-mono text-lg break-all">{password}</span>
            <button 
              onClick={copyToClipboard}
              className="ml-2 bg-yellow-300 hover:bg-yellow-400 text-black p-2 rounded-lg transition-colors cursor-pointer shadow-sm font-medium"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-gray-900 font-medium ">Password Length: {length}</label>
            </div>
            <input 
              type="range" 
              min="8" 
              max="32" 
              value={length} 
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-300"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>8</span>
              <span>16</span>
              <span>24</span>
              <span>32</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="uppercase"
                checked={includeUppercase}
                onChange={() => setIncludeUppercase(!includeUppercase)}
                className="w-4 h-4 accent-yellow-300 rounded"
              />
              <label htmlFor="uppercase" className="text-gray-900">Uppercase (A-Z)</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="lowercase"
                checked={includeLowercase}
                onChange={() => setIncludeLowercase(!includeLowercase)}
                className="w-4 h-4 accent-yellow-300 rounded"
              />
              <label htmlFor="lowercase" className="text-gray-900">Lowercase (a-z)</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="numbers"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers(!includeNumbers)}
                className="w-4 h-4 accent-yellow-300 rounded"
              />
              <label htmlFor="numbers" className="text-gray-900">Numbers (0-9)</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="symbols"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols(!includeSymbols)}
                className="w-4 h-4 accent-yellow-300 rounded"
              />
              <label htmlFor="symbols" className="text-gray-900">Symbols (!@#$%)</label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-900 font-medium">Strength:</span>
            <span className={`px-2 py-1 rounded text-xs font-bold ${strength <= 2 ? 'text-white' : 'text-black'} ${strengthInfo.color}`}>
              {strengthInfo.text}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${strengthInfo.color} transition-all duration-300`} 
              style={{ width: `${(strength / 5) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <button
          onClick={generatePassword}
          className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors shadow-md"
        >
          Generate Password
        </button>
        
        <div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-yellow-500 hover:text-yellow-600 text-sm flex items-center font-medium"
          >
            {showHistory ? 'Hide' : 'Show'} Recent Passwords
          </button>
          
          {showHistory && (
            <div className="mt-3 space-y-2">
              {history.length > 0 ? (
                history.map((pass, index) => (
                  <div key={index} className="bg-gray-50 rounded p-2 flex justify-between border border-gray-200">
                    <span className="text-gray-900 font-mono text-sm truncate">{pass}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(pass);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-xs text-yellow-500 hover:text-yellow-600 font-medium"
                    >
                      Copy
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No password history yet</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="absolute text-zinc-900 top-[2rem] right-0 flex flex-col bg-red-500 py-3 px-4 shadow-xl">
        <div className='flex gap-1 font-medium text-sm items-end'>

        <img className="w-6 h-6" src={dfavicon} />
        <h3 className='font-semibold'>createdBy</h3>
        </div>
        <a 
          href="https://github.com/deepsahilz" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cursor-pointer font-semibold text-xl "
        >
          @deepsahilz
        </a>
      </div>

    </div>
  );
}