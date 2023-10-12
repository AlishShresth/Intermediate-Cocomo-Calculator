import React, { useState } from 'react';
import './eaf.css'
const EAFCalculator = () => {
    const intermediate_cocomo = {
      Organic: {
        a1: 3.2,
        b1: 1.05,
        a2: 2.5,
        b2: 0.38,
      },
      Semidetached: {
        a1: 3.0,
        b1: 1.12,
        a2: 2.5,
        b2: 0.35,
      },
      Embedded: {
        a1: 2.8,
        b1: 1.2,
        a2: 2.5,
        b2: 0.32,
      },
    };
  const [eafValues, setEAFValues] = useState({
    'RELY': 'Nominal',
    'DATA': 'Nominal',
    'CPLX': 'Nominal',
    'TIME': 'Nominal',
    'STOR': 'Nominal',
    'VIRT': 'Nominal',
    'TURN': 'Nominal',
    'ACAP': 'Nominal',
    'AEXP': 'Nominal',
    'PCAP': 'Nominal',
    'VEXP': 'Nominal',
    'LEXP': 'Nominal',
    'MODP': 'Nominal',
    'TOOL': 'Nominal',
    'SCED': 'Nominal',
  });

  const [size, setSize] = useState('');
  const [result, setResult] = useState(null);
  const [softwareType, setSoftwareType] = useState("Organic");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEAFValues({ ...eafValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Define the Python functions as JavaScript functions
  const calculateEffortAdjustmentFactor = (eafValues) => {
    const product_attributes = {
        'RELY': {
            'Very_Low': 0.75,
            'Low': 0.88,
            'Nominal': 1.00,
            'High': 1.15,
            'Very_High': 1.40,
        },
        'DATA': {
            'Low': 0.94,
            'Nominal': 1.00,
            'High': 1.08,
            'Very_High': 1.16,
        },
        'CPLX': {
            'Very_Low': 0.70,
            'Low': 0.85,
            'Nominal': 1.00,
            'High': 1.15,
            'Very_High': 1.3,
            'Extra_High': 1.65
        },
    }
    
    const computer_attributes = {
        'TIME': {
            'Nominal': 1.00,
            'High': 1.11,
            'Very_High': 1.30,
            'Extra_High': 1.66
        },
        'STOR': {
            'Nominal': 1.00,
            'High': 1.06,
            'Very_High': 1.21,
            'Extra_High': 1.56
        },
        'VIRT': {
            'Low': 0.87,
            'Nominal': 1.00,
            'High': 1.15,
            'Very_High': 1.3,
        },
        'TURN': {
            'Low': 0.87,
            'Nominal': 1.00,
            'High': 1.07,
            'Very_High': 1.15,
        }
    }
    
    const personnel_attributes = {
        'ACAP': {
            'Very_Low': 1.46,
            'Low': 1.19,
            'Nominal': 1.00,
            'High': 0.86,
            'Very_High': 0.71,
        },
        'AEXP': {
            'Very_Low': 1.29,
            'Low': 1.13,
            'Nominal': 1.00,
            'High': 0.91,
            'Very_High': 0.82,
        },
        'PCAP': {
            'Very_Low': 1.42,
            'Low': 1.17,
            'Nominal': 1.00,
            'High': 0.86,
            'Very_High': 0.70,
        },
        'VEXP': {
            'Very_Low': 1.21,
            'Low': 1.10,
            'Nominal': 1.00,
            'High': 0.90,
        },
        'LEXP': {
            'Very_Low': 1.14,
            'Low': 1.07,
            'Nominal': 1.00,
            'High': 0.95,
        }
    }
    
    const project_attributes = {
        'MODP': {
            'Very_Low': 1.24,
            'Low': 1.10,
            'Nominal': 1.00,
            'High': 0.91,
            'Very_High': 0.82,
        },
        'TOOL': {
            'Very_Low': 1.24,
            'Low': 1.10,
            'Nominal': 1.00,
            'High': 0.91,
            'Very_High': 0.83,
        },
        'SCED': {
            'Very_Low': 1.23,
            'Low': 1.08,
            'Nominal': 1.00,
            'High': 1.04,
            'Very_High': 1.10,
        },
    }
    
    let eaf = 1.0  // Initialize EAF to 1.0

    // Calculate EAF using the given values for each cost driver
    for (const driver in eafValues) {
    const value = eafValues[driver];

    if (product_attributes.hasOwnProperty(driver)) {
      eaf *= product_attributes[driver][value];
    } else if (computer_attributes.hasOwnProperty(driver)) {
      eaf *= computer_attributes[driver][value];
    } else if (personnel_attributes.hasOwnProperty(driver)) {
      eaf *= personnel_attributes[driver][value];
    } else if (project_attributes.hasOwnProperty(driver)) {
      eaf *= project_attributes[driver][value];
    }
  }

      return eaf;
  };

  const calculateEffort = (eaf, size) => {
    let a1 = intermediate_cocomo[softwareType]['a1']
    let b1 = intermediate_cocomo[softwareType]['b1']

    let effort = a1 * (size ** b1) * eaf
    return effort;
  };

  const calculateDevelopmentTime = (effort) => {
    let a2 = intermediate_cocomo[softwareType]['a2']
    let b2 = intermediate_cocomo[softwareType]['b2']
    let developmentTime = a2*(effort**b2)
    return developmentTime;
  };

  // Call the functions with appropriate parameters
  const eaf = calculateEffortAdjustmentFactor(eafValues);
  const parsedSize = parseFloat(size);
  const effort = calculateEffort(eaf, parsedSize, 'Organic'); // You can pass the project type as needed
  const developmentTime = calculateDevelopmentTime(effort, 'Organic');

  // Update the 'result' state with the calculated values
  setResult({ eaf, effort, developmentTime });
  };

  return (
    <div>
      <h1 style={{textAlign: 'center',fontWeight: 600,fontSize:22,marginBottom: 30}}>Effort Adjustment Factor (EAF) Calculator</h1>
      <label style={{display:'flex',alignItems: 'center'}}>
        <h3 style={{marginLeft: 50, fontWeight: 600}}>Software Type:</h3>
        <select
          value={softwareType}
          onChange={(e) => setSoftwareType(e.target.value)}
          style={{  padding: 10 ,marginLeft:50}}
        >
          <option value='Organic'>Organic</option>
          <option value='Semidetached'>Semidetached</option>
          <option value='Embedded'>Embedded</option>
        </select>
      </label>
      <form onSubmit={handleSubmit}>
        {/* Render radio buttons for EAF values */}
        {Object.keys(eafValues).map((driver) => (
          <div key={driver} className='radio-container'>
            <h3 style={{fontWeight: 500,fontSize: 19}}>{driver}:</h3>
            <label>
              <input
                type='radio'
                name={driver}
                value='Very_Low'
                checked={eafValues[driver] === "Very_Low"}
                onChange={handleChange}
              />
              Very Low
            </label>
            <label>
              <input
                type='radio'
                name={driver}
                value='Low'
                checked={eafValues[driver] === "Low"}
                onChange={handleChange}
              />
              Low
            </label>
            <label>
              <input
                type='radio'
                name={driver}
                value='Nominal'
                checked={eafValues[driver] === "Nominal"}
                onChange={handleChange}
              />
              Nominal
            </label>
            <label>
              <input
                type='radio'
                name={driver}
                value='High'
                checked={eafValues[driver] === "High"}
                onChange={handleChange}
              />
              High
            </label>
            <label>
              <input
                type='radio'
                name={driver}
                value='Very_High'
                checked={eafValues[driver] === "Very_High"}
                onChange={handleChange}
              />
              Very High
            </label>
            <label>
              <input
                type='radio'
                name={driver}
                value='Extra_High'
                checked={eafValues[driver] === "Extra_High"}
                onChange={handleChange}
              />
              Extra High
            </label>
            {/* Add radio buttons for other values (Nominal, High, Very High, etc.) here */}
          </div>
        ))}

        <div style={{marginLeft: 50,marginTop:30}}>
          <label>
            Size of the project (in KLOC):
            <input
              type='number'
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </label>
        </div>

              <button type='submit' style={{ marginLeft:50}}>Calculate</button>
      </form>

      {result && (
        <div style={{marginLeft: 50}}>
          <p>
            Effort Adjustment Factor (EAF):{" "}
            <input value={result.eaf.toFixed(2)} readOnly />
          </p>
          <p>
            Effort (person-months):{" "}
            <input value={result.effort.toFixed(2)} readOnly />
          </p>
          <p>
            Development Time (months):{" "}
            <input value={result.developmentTime.toFixed(2)} readOnly />
          </p>
        </div>
      )}
    </div>
  );
};

export default EAFCalculator;
