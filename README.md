# Vulnerability Patch Management System

## Overview
The Vulnerability Patch Management System is designed to help organizations manage and mitigate vulnerabilities in their software and systems. This full-stack application utilizes a Flask backend and a simple HTML/CSS/JS frontend to provide a user-friendly interface for uploading scan results, querying vulnerabilities, and generating reports.

## Project Structure
```
vulnerability-patch-management-system
├── backend
│   ├── app.py
│   ├── models.py
│   ├── routes.py
│   ├── requirements.txt
│   └── README.md
├── frontend
│   ├── index.html
│   ├── styles
│   │   └── main.css
│   └── scripts
│       └── main.js
└── README.md
```

## Backend
The backend is built using Flask and handles all the application logic, including:
- **app.py**: Entry point for the application, initializes the Flask app and configurations.
- **models.py**: Defines data models for vulnerabilities, patches, and scan results.
- **routes.py**: Contains API endpoints for uploading scan files, querying vulnerabilities, and generating reports.
- **requirements.txt**: Lists all dependencies required for the backend.

### Setup Instructions
1. Navigate to the `backend` directory.
2. Install the required packages using:
   ```
   pip install -r requirements.txt
   ```
3. Run the application:
   ```
   python app.py
   ```

## Frontend
The frontend is a simple web interface that allows users to interact with the system:
- **index.html**: Main HTML template for the application.
- **styles/main.css**: CSS styles for layout and design.
- **scripts/main.js**: JavaScript for handling user interactions and dynamic updates.

### Usage Instructions
1. Open `index.html` in a web browser.
2. Use the upload module to submit scan results.
3. Query vulnerabilities and view reports directly in the interface.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.