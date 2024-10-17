document.addEventListener("DOMContentLoaded", function () {

  const button = document.querySelector('.test');

  button.addEventListener('click', function() {
    fetch("http://localhost:8000/getProjects")
    .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json(); // Parse the JSON data
  })
  .then(data => {
      // Handle the data received from the API
      displayData(data); // For now, just log the data to the console
  })
  .catch(error => {
    // Handle any errors that occur during the fetch
    console.error('There was a problem with the fetch operation:', error);
  });
  })

})

// Function to display data on the screen
function displayData(data) {
  // Create a container element to hold the data
  const dataContainer = document.createElement('div');
  dataContainer.setAttribute('id', 'data-container');

  // Format the data as HTML content (you can modify this part according to your needs)
  dataContainer.innerHTML = `
      <h2>Data from the API</h2>
      <pre>${JSON.stringify(data, null, 2)}</pre>
  `;

  // Append the container to the body of the document
  document.body.appendChild(dataContainer);
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('getProjectById');

  form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Get form data
      const projectId = document.getElementById('projectId').value;

      const url = `http://localhost:8000/getProject?id=${encodeURIComponent(projectId)}`;

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
          displayData(data);
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
  });
});

// Handle POST Request

// Helper function to validate input
function isValidInput(input) {
  // Regular expression to allow only alphanumeric characters, spaces, and some punctuation
  const regex = /^[a-zA-Z0-9\s.,-]*$/;
  return input.length > 0 && regex.test(input);
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('createProject');

  form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission behavior

      // Get form data
      const projectName = document.getElementById('projectName').value;
      const projectDescription = document.getElementById('projectDescription').value;
      const jsonInput = document.getElementById('jsonInput').value;

    // Validation checks for the project name and description
    if (!isValidInput(projectName) || !isValidInput(projectDescription)) {
      document.getElementById('result').innerText = 'Invalid input: Name and description must contain valid characters.';
      console.log("Invalid input: Name and description must contain valid characters.")
      return;
    }

      // Parse the JSON Input provided by the user
      let jsonData;
      try {
        jsonData = JSON.parse(jsonInput);
      } catch (error) {
        console.error('Invalid JSON format:', error);
        document.getElementById('result').innerText = 'Invalid JSON input. Please correct it.';
        return;
    }

      // Construct the data object to send to the API
      const data = {
        name: projectName,
        description: projectDescription,
        jsondata: jsonData
      };

      console.log(data)

      // Send the data to the API endpoint
      fetch('http://localhost:8000/createProject', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data) // Convert the data object to a JSON string
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json(); // Parse the JSON response from the server
      })
      .then(data => {
          console.log('Success:', data); // Handle the success response
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      });
  });
});
