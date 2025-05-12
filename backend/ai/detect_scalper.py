# backend/ai/detect_scalper.py

import sys
import pandas as pd
import pickle
from sklearn.linear_model import LogisticRegression

MODEL_PATH = r"C:\github\KLTN-Ticket-book-1\backend\ai\data\trained_model.pkl"
DATA_PATH = r"C:\github\KLTN-Ticket-book-1\backend\ai\data\train_data.csv"

def train_model():
    data = pd.read_csv(DATA_PATH)
    X = data[["num_tickets", "trades", "reputation"]]  # Thêm 'reputation'
    y = data["is_scalper"]

    model = LogisticRegression()
    model.fit(X, y)

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print("Model trained and saved.")

def predict_scalper(num_tickets, trades, reputation):
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    features = pd.DataFrame(
        [[int(num_tickets), int(trades), int(reputation)]],
        columns=["num_tickets", "trades", "reputation"]
    )
    prediction = model.predict(features)
    return prediction[0]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python detect_scalper.py <train|predict> [args]")
    elif sys.argv[1] == "train":
        train_model()
    elif sys.argv[1] == "predict":
        if len(sys.argv) < 5:
            print("Usage: python detect_scalper.py predict <num_tickets> <trades> <reputationScore>")
        else:
            num_tickets = sys.argv[2]
            trades = sys.argv[3]
            reputation_score = sys.argv[4]
            result = predict_scalper(num_tickets, trades, reputation_score)
            print(result)

# .\venv\Scripts\Activate
# python detect_scalper.py train
# python detect_scalper.py predict 3 2 1.0

