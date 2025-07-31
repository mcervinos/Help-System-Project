##Clone the repository

git clone https://github.com/mcervinos/Help-System-Project.git
cd Help-System-Project

##Set Up the Python Environment

python -m venv venv
source venv/bin/activate        # On macOS/Linux
venv\Scripts\activate           # On Windows

##Install Python Dependencies

pip install -r requirements.txt

##Set Up the Node Environment
npm install

##Environment Variables

make .env.local at root of project with:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=4144581839f9e27b59cb649589b64a72cc3e2d24095c9c1c389310db70cfbdb7

##Run the Project

npm run dev
