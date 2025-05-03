# backend/ai/detect_scalper.py

import sys
import pandas as pd
import pickle
from sklearn.linear_model import LogisticRegression

MODEL_PATH = r"C:\github\KLTN-Ticket-book-1\backend\ai\data\trained_model.pkl"
DATA_PATH = r"C:\github\KLTN-Ticket-book-1\backend\ai\data\train_data.csv"

def train_model():
    data = pd.read_csv(DATA_PATH)  # file gồm: num_tickets, trades, is_scalper
    X = data[["num_tickets", "trades"]]  # Cột features chính xác
    y = data["is_scalper"]  # Cột labels chính xác

    model = LogisticRegression()
    model.fit(X, y)

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print("Model trained and saved.")

def predict_scalper(num_tickets, trades):
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    # Sử dụng cột tên chính xác "num_tickets" và "trades"
    features = pd.DataFrame([[int(num_tickets), int(trades)]], columns=["num_tickets", "trades"])
    prediction = model.predict(features)
    return prediction[0]

if __name__ == "__main__":
    if sys.argv[1] == "train":
        train_model()
    elif sys.argv[1] == "predict":
        if len(sys.argv) < 4:
            print("Usage: python detect_scalper.py predict <num_tickets> <trades>")
        else:
            num_tickets = sys.argv[2]
            trades = sys.argv[3]
            result = predict_scalper(num_tickets, trades)
            print(result)  # In ra kết quả 0 hoặc 1 cho backend đọc

# .\venv\Scripts\Activate
