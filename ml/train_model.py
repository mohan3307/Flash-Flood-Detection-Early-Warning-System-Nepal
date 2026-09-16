"""
Model Training Script for SENSORA Flash Flood Early Warning System.

Trains a robust Random Forest classifier on synthetic hydrological time series data.
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

FEATURES = [
    "rainfall_intensity",
    "water_level",
    "rate_of_rise",
    "rainfall_change",
    "water_level_change",
    "rolling_rainfall_3h",
    "rolling_water_level_trend",
    "temperature"
]

TARGET = "flood_risk"

def train_flood_model(data_path="data/synthetic_flood_data.csv", model_output="ml/model.pkl"):
    if not os.path.exists(data_path):
        print(f"Data file not found at {data_path}. Generating dataset first...")
        from generate_dataset import generate_synthetic_flood_data
        generate_synthetic_flood_data(output_path=data_path)

    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} records from {data_path}")

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Training Random Forest on {len(X_train)} samples...")
    clf = RandomForestClassifier(
        n_estimators=120,
        max_depth=14,
        min_samples_split=4,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nModel Training Completed!")
    print(f"Test Accuracy: {acc * 100:.2f}%\n")
    print(classification_report(y_test, y_pred, digits=4))

    # Calculate feature importances
    feature_importances = dict(zip(FEATURES, [round(float(val), 4) for val in clf.feature_importances_]))
    print("Feature Importances:")
    for feat, imp in sorted(feature_importances.items(), key=lambda x: x[1], reverse=True):
        print(f"  {feat:28s}: {imp:.4f}")

    bundle = {
        "model": clf,
        "features": FEATURES,
        "classes": list(clf.classes_),
        "feature_importances": feature_importances,
        "accuracy": round(float(acc), 4)
    }

    os.makedirs(os.path.dirname(model_output), exist_ok=True)
    joblib.dump(bundle, model_output)
    print(f"\nModel bundle successfully saved to {model_output}")

if __name__ == "__main__":
    train_flood_model()
