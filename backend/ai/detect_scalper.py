# backend/ai/detect_scalper.py

import sys
import pandas as pd  # type: ignore
import pickle
from sklearn.linear_model import LogisticRegression  # type: ignore

# Use raw string literals for file paths to avoid escape sequence issues
MODEL_PATH = r"C:\github\KLTN Ticket book\backend\ai\data\trained_model.pkl"
DATA_PATH = r"C:\github\KLTN Ticket book\backend\ai\data\train_data.csv"

def train_model():
    # Dữ liệu mẫu
    data = pd.read_csv(DATA_PATH)  # file gồm các cột: num_tickets, trades, is_scalper
    X = data[["num_tickets", "trades"]]
    y = data["is_scalper"]

    model = LogisticRegression()
    model.fit(X, y)

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print("Model trained and saved.")

def predict_scalper(num_tickets, trades):
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    # Use a DataFrame to ensure feature names match the training data
    features = pd.DataFrame([[int(num_tickets), int(trades)]], columns=["num_tickets", "trades"])
    
    # Make the prediction
    prediction = model.predict(features)
    return prediction[0]


if __name__ == "__main__":
    if sys.argv[1] == "train":
        train_model()
    elif sys.argv[1] == "predict":
        # Check if there are enough arguments
        if len(sys.argv) < 4:
            print("Usage: python detect_scalper.py predict <num_tickets> <trades>")
        else:
            num_tickets = sys.argv[2]
            trades = sys.argv[3]
            result = predict_scalper(num_tickets, trades)
            print(f"Prediction: {'Scalper' if result == 1 else 'Not Scalper'}")
