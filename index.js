const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

//User Details
const USER_INFO = {
  full_name: 'Gautham Ashok',       
  email: 'gauthamashok2022@vitbhopal.ac.in',        
  roll_number: '22BCG10159',      
  birth_date: '26022003'  
};


const isNumber = (str) => {
  return !isNaN(str) && !isNaN(parseFloat(str));
};

const isAlphabet = (str) => {
  return /^[a-zA-Z]+$/.test(str);
};

const isSpecialChar = (str) => {
  return /^[^a-zA-Z0-9]+$/.test(str);
};

const processData = (data) => {
  const result = {
    odd_numbers: [],
    even_numbers: [],
    alphabets: [],
    special_characters: [],
    sum: 0,
    concat_string: ''
  };

  const alphaChars = [];

  data.forEach(item => {
    const str = String(item).trim();
    
    if (isNumber(str)) {
      const num = parseFloat(str);
      result.sum += num;
      
      if (num % 2 === 0) {
        result.even_numbers.push(str);
      } else {
        result.odd_numbers.push(str);
      }
    } 
    else if (isAlphabet(str)) {
      const upperCaseStr = str.toUpperCase();
      result.alphabets.push(upperCaseStr);
      
      for (let char of str) {
        alphaChars.push(char);
      }
    }
    else if (isSpecialChar(str)) {
      result.special_characters.push(str);
    }
  });

  if (alphaChars.length > 0) {
    const reversed = alphaChars.reverse();
    let concatResult = '';
    
    reversed.forEach((char, index) => {
      if (index % 2 === 0) {
        concatResult += char.toUpperCase();
      } else {
        concatResult += char.toLowerCase();
      }
    });
    
    result.concat_string = concatResult;
  }

  result.sum = result.sum.toString();
  return result;
};

// POST Route
app.post('/bfhl', (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        error: "Invalid input. 'data' must be an array."
      });
    }

    const processedData = processData(data);

    const response = {
      is_success: true,
      user_id: `${USER_INFO.full_name}_${USER_INFO.birth_date}`,
      email: USER_INFO.email,
      roll_number: USER_INFO.roll_number,
      odd_numbers: processedData.odd_numbers,
      even_numbers: processedData.even_numbers,
      alphabets: processedData.alphabets,
      special_characters: processedData.special_characters,
      sum: processedData.sum,
      concat_string: processedData.concat_string
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      is_success: false,
      error: "Internal server error"
    });
  }
});

//Backend Route
app.get('/bfhl', (req, res) => {
  res.status(200).json({
    operation_code: 1,
    message: "API is running. Use POST method with data array.",
    user_info: USER_INFO
  });
});

// Frontend Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Backend Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    message: 'BFHL API is running',
    user: USER_INFO,
    endpoints: {
      GET: ['/', '/bfhl', '/health'],
      POST: ['/bfhl']
    }
  });
});

// Main Code
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/bfhl`);
});