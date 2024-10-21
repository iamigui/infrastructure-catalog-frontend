document.addEventListener("DOMContentLoaded", function () {

  const button = document.querySelector('.test');

  button.addEventListener('click', function() {
    fetch("http://localhost:8000/projects")
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON data
  })
  .then(data => {
      // Handle the data received from the API
      displayData(data, 'catalogFullContentResult'); // For now, just log the data to the console
  })
  .catch(error => {
    // Handle any errors that occur during the fetch
    console.error('There was a problem with the fetch operation:', error);
  });
  })

})

// Function to display data on the screen
function displayData(data, elementID) {
  // Select the paragraph element where the data will be displayed
  const dataContainer = document.getElementById(elementID);

  // Format the data as HTML content (you can modify this part according to your needs)
  dataContainer.innerHTML = `
      <h2>Data from the API</h2>
      <pre>${JSON.stringify(data, null, 2)}</pre>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('getProjectById');

  form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Get form data
      const projectId = document.getElementById('projectId').value;

      const url = `http://localhost:8000/project/id/${encodeURIComponent(projectId)}`;

      // Send the data to the API endpoint
      fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); // Parse the JSON response from the server
      })
      .then(data => {
          console.log('Project Obtained:', data); // Handle the success response
          displayData(data, 'getProjectByIdResult');
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('getProjectByKey');

  form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Get form data
      const projectKey = document.getElementById('getProjectKey').value;

      const url = `http://localhost:8000/project/key/${encodeURIComponent(projectKey)}`;

      // Send the data to the API endpoint
      fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); // Parse the JSON response from the server
      })
      .then(data => {
          console.log('Project Obtained:', data); // Handle the success response
          displayData(data, 'getProjectByKeyResult');
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
  });
});

// Handle POST Request

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('createProject');

  form.addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Get form data
      const projectName = document.getElementById('projectName').value;
      const projectDescription = document.getElementById('projectDescription').value;
      const projectKey = document.getElementById('projectKey').value;
      const jsonInput = document.getElementById('jsonInput').value;

    // Validation checks for the project name and description
    if (!isValidInput(projectName) || !isValidInput(projectDescription))  {
      document.getElementById('result').innerText = 'Invalid input: Name and description must contain valid characters.';
      console.log("Invalid input: Name and description must contain valid characters.")
      return;
    }

    // Validation checks for the project key and description
    if (!isValidInputProject(projectKey))  {
      document.getElementById('result').innerText = 'Invalid input: Project Key must contain 5 valid characters in uppercase.';
      console.log("Invalid input: Project Key must contain 5 valid characters in uppercase. Input: ", projectKey)
      return;
    }

      // Parse the JSON Input provided by the user
      let jsonData;
      try {
        jsonData = JSON.parse(jsonInput);
        if (jsonData !== "") {
          // console.log("Is not null")
        }
        else {
          console.log("JsonData is null")
          return
        }
      } catch (error) {
        console.error('Invalid JSON format:', error);
        document.getElementById('result').innerText = 'Invalid JSON input. Please correct it.';
        return;
    }

      // Construct the data object to send to the API
      const data = {
        name: projectName,
        description: projectDescription,
        project_key: projectKey,
        json_data: jsonData
      };

      console.log(data)

      try {
        // Send the data to the API endpoint
        const response = await fetch('http://localhost:8000/createProject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Convert the data object to a JSON string
        });

        if (!response.ok) {
          // Handle specific response status codes
          let errorMessage = 'Network response was not ok'; // Default error message
          if (response.status === 409) {
              try {
                  // If the response status is 409, attempt to parse the error message as JSON
                  const errorData = await response.json();
                  errorMessage = `ProjectKey already exists: ${errorData['Project Key']}`;
              } catch (parseError) {
                  // If parsing fails, fall back to a generic error message
                  errorMessage = `ProjectKey already exists, but error parsing response: ${parseError.message}`;
              }
              console.error(errorMessage); // Log the error for debugging
              throw new Error(errorMessage); // Throw the custom error message
          } else {
              throw new Error('Network response was not ok');
          }
      }

        const responseData = await response.json(); // Parse the JSON response from the server if it's successful
        console.log('Success:', responseData); // Handle the success response
        document.getElementById('result').innerText = 'Project created successfully!';
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Display the error message in the result div
        document.getElementById('result').innerText = error.message;
    }
  });
});

// Helper function to validate input
function isValidInput(input) {
  // Regular expression to allow only alphanumeric characters, spaces, and some punctuation
  const regex = /^[a-zA-Z0-9\s.,-]*$/;
  return input.length > 0 && regex.test(input);
}

// Helper function to validate project key input
function isValidInputProject(input) {
  // Regular expression to allow exactly five alphanumeric characters
  const regex = /^[A-Z0-9]{5}$/;
  return input.length > 0 && regex.test(input);
}