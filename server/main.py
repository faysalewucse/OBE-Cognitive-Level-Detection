import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from flask import Flask, request, jsonify

# Load the dataset
dataset = pd.read_csv('data.csv')  # Replace 'data.csv' with the path to your CSV file

# Drop rows with missing values
dataset.dropna(inplace=True)

# Split the dataset into features (X) and labels (y)
X = dataset['question'].values  # Input questions
y = dataset['level'].values  # Cognitive level labels

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocess the input data: Convert text to numerical features using TF-IDF vectorization
vectorizer = TfidfVectorizer()
X_train = vectorizer.fit_transform(X_train)
X_test = vectorizer.transform(X_test)

# Initialize the classifier
clf = RandomForestClassifier()

# Train the model
clf.fit(X_train, y_train)

# Create a Flask app
app = Flask(__name__)


@app.route('/predict', methods=['POST'])
def predict():
    # Get the input question from the request body
    question = request.json['question']

    # Apply the same vectorization to the input question
    question_vectorized = vectorizer.transform([question])

    # Predict the cognitive level
    predicted_level = clf.predict(question_vectorized)

    # Create a response object
    response = {
        'question': question,
        'cognitive_level': predicted_level[0]
    }

    # Return the response as JSON
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
