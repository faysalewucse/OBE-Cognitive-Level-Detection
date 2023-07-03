import pandas as pd
from sklearn import svm
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.impute import SimpleImputer
from flask import Flask, jsonify, request
import pymongo
import os
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

db_client = pymongo.MongoClient(os.getenv('MONGODB_URL'))
database = db_client["capstone"]

# Step 1: Load the CSV dataset
dataset = pd.read_csv('600data.csv')

# Step 2: Prepare your data
X = dataset['question'].values  # Input questions
y = dataset['level'].values  # Cognitive level labels

# Step 3: Preprocess the input texts
vectorizer = TfidfVectorizer()  # You can customize this vectorizer based on your specific requirements
X_vectors = vectorizer.fit_transform(X)

# Step 4: Handle missing values in the target variable
imputer = SimpleImputer(strategy='most_frequent')
y = imputer.fit_transform(y.reshape(-1, 1)).flatten()

# Step 5: Train the SVM model
svm_model = svm.SVC(kernel='sigmoid')
svm_model.fit(X_vectors, y)

# Step 6: Create a Flask app
app = Flask(__name__)
CORS(app)

# Default route
@app.route('/')
def home():
    return "Welcome to the Cognitive Level Prediction API!"

@app.route('/addQuestion', methods=['POST'])
def add_question():
    try:
        data = request.get_json()
        
        # Insert the document into MongoDB
        inserted_id = database.questions.insert_one(data).inserted_id

        # Prepare the success response
        response = {
            'message': 'Question added successfully',
            'inserted_id': str(inserted_id)
        }

        return jsonify(response), 200

    except Exception as e:
        # Handle the error and return an error response
        error_message = str(e)
        response = {
            'message': 'Error occurred while adding question',
            'error': error_message
        }

        return jsonify(response), 500

# Route for predicting cognitive level
@app.route('/predict', methods=['POST'])
def predict_cognitive_level():
    input_question = request.json['question']
    input_question_vector = vectorizer.transform([input_question])
    predicted_level = svm_model.predict(input_question_vector)

    response = {'predicted_cognitive_level': int(predicted_level[0])}  # Convert to int for JSON serialization
    return jsonify(response)


# Run the Flask app
if __name__ == '__main__':
    app.run()
