# Regressionify

Regressionify is a web application designed to make regression analysis simple and accessible. Users can upload an Excel file, and the application analyzes the data to perform regression, helping uncover meaningful relationships between variables.

## Features
- **User-Friendly Interface**: Built using React Vite for a seamless frontend experience.
- **Robust Backend**: Powered by Flask Python to handle data processing and regression computations.
- **Excel File Upload**: Supports `.xlsx` files for direct data analysis.
- **Quick Results**: Get regression analysis results in just a few clicks.

## Demo
[Insert a link to a demo or screenshots if available]

## Installation

### Prerequisites
- Node.js
- Python 3.x
- Pip
- Virtualenv (optional but recommended)

### Backend Setup (Flask)
1. Clone the repository:
   ```bash
   git clone https://github.com/potakaaa/regressionify.git
   cd regressionify/backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```bash
   flask run
   ```

### Frontend Setup (React Vite)
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the required Node modules:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
1. Open the application in your web browser by visiting the address provided by the Vite server (e.g., `http://localhost:5173`).
2. Upload an Excel file containing your dataset.
3. View the regression analysis results displayed in an intuitive format.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your improvements or new features.

## License
[Specify the license used, e.g., MIT, Apache 2.0, etc.]

## Contact
For inquiries or support, please reach out via:
- GitHub: [@potakaaa](https://github.com/potakaaa)
