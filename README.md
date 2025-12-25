# Study with Maryam - Backend

This is the Express.js backend for the Study with Maryam application, using MongoDB for data storage.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` file and update the MongoDB URI if needed
   - Default: `mongodb://localhost:27017/study-with-maryam`

4. Start MongoDB (if using local installation):
   ```bash
   mongod
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000`

### API Endpoints

#### Classes
- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create a new class
- `DELETE /api/classes/:id` - Delete a class

#### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create a new subject
- `DELETE /api/subjects/:id` - Delete a subject

#### Chapters
- `GET /api/chapters` - Get all chapters
- `POST /api/chapters` - Create a new chapter
- `DELETE /api/chapters/:id` - Delete a chapter

#### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Upload a note (multipart/form-data)
- `DELETE /api/notes/:id` - Delete a note

#### Entrance Exams
- `GET /api/entrance-exams` - Get all entrance exams
- `POST /api/entrance-exams` - Upload an entrance exam (multipart/form-data)
- `DELETE /api/entrance-exams/:id` - Delete an entrance exam

### File Upload
- PDF files are stored in the `backend/uploads/` directory
- Files are served at `http://localhost:5000/uploads/filename`
- Maximum file size: 10MB
- Only PDF files are accepted

### Database Models
- **Class**: name (unique)
- **Subject**: name, classId (reference to Class)
- **Chapter**: name, subjectId (reference to Subject)
- **Note**: title, filename, pdfUrl, chapterId, subjectId, path
- **EntranceExam**: name, filename, pdfUrl, path