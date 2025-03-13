# Lyla's Smart Inventory and Transaction System 

Welcome to Lyla's Smart Inventory and Transaction System! This web-based application is designed to streamline sales transactions and inventory management for Lyla’s Cakes, Pastries & Breads, a bakery based in Davao City. By replacing manual record-keeping with a digital solution, the system enhances efficiency, accuracy, and overall business operations.

## Technologies Used

- **Frontend**
-HTML, CSS, JavaScript, React
-Figma (for wireframe and UI design)
**Backend**
-Node.js (for server-side logic)
-Express.js (for handling API requests)
-MySQL (for database storage)
**Database Management**
MySQL (hosted on a cloud platform: Railway)

## Features

-**Dashboard**: Displays an overview of sales, revenues, inventory status, and best-selling products.
-**Sales & Transactions Processing**: Facilitates customer purchases, processes payments, generates digital receipts, and maintains transaction history.
-**Inventory Management**: Allows real-time tracking of stock-in and stock-out, ensuring accurate stock monitoring.
-**Sales Tracking**: Records sold products with details such as quantity, price, and date of sale.
-**Employee Management**: Stores employee details, including names, roles, and contact information.
-**User Authentication**: Provides secure login functionality for employees and management.
-**Cloud-Based Data Storage**: Enables secure, real-time access across multiple devices.
-**Mobile Compatability**: Ensures the application is fully responsive and accessible on various mobile devices, providing a seamless user experience.

## Getting Started

### How to Run the Program

1. **Create a Virtual Environment**:
   ```bash
   python -m venv nameofENV
   ```
   Example: ``python -m venv AdBot``
   
   Conda: ``conda create --name myenv``
   
   Specify Python version: ``conda create --name myenv python=3.9``


3. **Activate the Virtual Environment**:
   - **Windows**:
     ```bash
     AdBot\Scripts\activate
     ```
   - **Linux/Mac**:
     ```bash
     source AdBot/bin/activate
     ```

   - **Conda**:
     ```bash
     conda activate myenv
     ```


### **Environment Variables**
   - Create a `.env` file.
   - Add your API key:
     ```bash
     API_KEY = "your-api-key"
     ```


### **Install the required packages:**
   - **Type in the terminal after activating environment**:
      ```bash
      pip install google-generativeai streamlit python-dotenv langdetect nltk
      ```
   - **Version Needed**: Python 3.9 or higher
      ```bash
      python --version
      ```
      Example Output: `Python 3.12`

## Contributors

- **<span style="color:#FF6347">Marga Pilapil</span>** - [vennDiagramm](https://github.com/vennDiagramm)
- **<span style="color:#4682B4">Jhouvann Morden</span>** - [Joooban](https://github.com/Joooban) 
- **<span style="color:#32CD32">Darwin Guirigay</span>** - [dlGuiri](https://github.com/dlGuiri)
- **<span style="color:#8A2BE2">Mel Macabenta</span>** - [Lumeru](https://github.com/MeruMeru09)
- **<span style="color:#FFD700">Gavin Rivera</span>** - [Watta2xTops](https://github.com/Watta2xTops)
