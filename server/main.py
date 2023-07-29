import tensorflow as tf
import numpy as np
import json
from keras.models import load_model
from bson import ObjectId
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
# You can customize this vectorizer based on your specific requirements
vectorizer = TfidfVectorizer()
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

# Next Word Prediction Start
file = open("nwpData.json", "r", encoding='UTF8')
x = file.read()
fullData = json.loads(x)
file.close()
questions = []
for data in fullData:
    questions.append(data['question'])

tokenizer = tf.keras.preprocessing.text.Tokenizer()
tokenizer.fit_on_texts(questions)
seq = tokenizer.texts_to_sequences(questions)

var = seq[:10]

X = []
y = []
total_words_dropped = 0

for i in var:
    if len(i) > 1:
        for index in range(1, len(i)):
            X.append(i[:index])
            y.append(i[index])
    else:
        total_words_dropped += 1

X = tf.keras.preprocessing.sequence.pad_sequences(X)
y = tf.keras.utils.to_categorical(y)

vocab_size = len(tokenizer.word_index) + 1

vocab_array = np.array(list(tokenizer.word_index.keys()))

# Load The model
model = load_model("./model/nwp.h5")


# Function for generate next word
def generate_text_sequence(seed_text, n_words):
    for i in range(n_words):
        text_tokenize = tokenizer.texts_to_sequences([seed_text])
        text_padded = tf.keras.preprocessing.sequence.pad_sequences(
            text_tokenize, maxlen=14)
        prediction = np.squeeze(np.argmax(model.predict(text_padded), axis=-1))
        prediction = str(vocab_array[prediction - 1])
        # seed_text += " " + prediction

    return prediction


# Next Word Prediction End

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

    # Convert to int for JSON serialization
    response = {'predicted_cognitive_level': int(predicted_level[0])}
    return jsonify(response)


@app.route('/questions', methods=['GET'])
def allQuestions():
    email = request.args.get('email')
    if email:
        questions = []
        for question in database.questions.find({"userEmail": email}):
            question['_id'] = str(question['_id'])  # Convert ObjectId to string
            questions.append(question)
        return jsonify(questions)
    else:
        return jsonify({"error": "Email parameter is missing"})


@app.route('/question', methods=['GET'])
def singleQuestion():
    id = request.args.get('id')
    if id:
        questionData = []
        for question in database.questions.find({"_id": ObjectId(id)}):
            question['_id'] = str(question['_id'])
            questionData.append(question)
        return jsonify(questionData)
    else:
        return jsonify({"error": "Email parameter is missing"})


@app.route('/questions/<question_id>', methods=['PATCH'])
def updateQuestion(question_id):

    if question_id:
        updated_question = request.get_json()
        updated_question['_id'] = ObjectId(question_id)

        print(updateQuestion)
        result = database.questions.update_one({"_id": ObjectId(question_id)}, {"$set": updated_question})

        if result.modified_count:
            return jsonify({"message": "Question updated successfully"})
        else:
            return jsonify({"error": "Question not found or unauthorized access"})
    else:
        return jsonify({"error": "Email parameter is missing"})


@app.route('/next', methods=['POST'])
def predict():
    # Get the JSON data from the request body
    sentence = request.json['sentence']

    # Return the prediction as a JSON response
    response = {'next_word': generate_text_sequence(sentence, 5)}
    return jsonify(response)


# Run the Flask app
if __name__ == '__main__':
    app.run()
