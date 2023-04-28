from flask import Flask, render_template, request
import pandas as pd
import numpy as np
from tensorflow import keras
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime
# import matplotlib.pyplot as plt

app = Flask(__name__)

# Load the LSTM model
model = load_model('lstm_model/lstm_model.h5')

# Load the scaler object used to scale the data during training
scaler = MinMaxScaler()
scaler.fit(pd.read_csv('hourly-sm.csv', usecols=['sm']))


@app.route('/')
def home():
    return render_template('input.html')


@app.route('/predict', methods=['POST'])
def predict():
    # Get the input data from the user
    input_data = []
    for i in range(12):
        ttime = request.form.get(f'ttime_{i}')
        sm = request.form.get(f'sm_{i}')
        if ttime and sm:
            ttime = datetime.strptime(ttime, '%Y-%m-%dT%H:%M')
            input_data.append([ttime, float(sm)])

    if len(input_data) == 12:
        # Convert the input data to a pandas DataFrame
        input_data = pd.DataFrame(input_data, columns=['ttime', 'sm'])
        input_data.set_index('ttime', inplace=True)

        # Resample the input data to hourly intervals
        input_data = input_data.resample('H').mean().interpolate()

        # Scale the input data using the scaler object
        input_data_scaled = scaler.transform(input_data)

        # Use the LSTM model to predict the next 14*24 hours of data
        n_steps = 12
        n_features = 1
        X_input = input_data_scaled[-n_steps:].reshape(1, n_steps, n_features)
        predictions = []
        for i in range(14*24):
            y_pred = model.predict(X_input, verbose=0)
            predictions.append(y_pred[0][0])
            X_input = np.concatenate((X_input[:, 1:, :], y_pred.reshape(1, 1, n_features)), axis=1)

        # Convert the predicted data to a pandas DataFrame and rescale to the original range
        predictions = np.array(predictions).reshape(-1, 1)
        predictions = scaler.inverse_transform(predictions)
        index = pd.date_range(input_data.index[-1], periods=14*24, freq='H')
        predictions_df = pd.DataFrame(predictions, index=index, columns=['sm'])

        # Combine the input and predicted data into a single DataFrame
        result = pd.concat([input_data, predictions_df], axis=0)

        # Extract the predicted values from the result DataFrame and pass them to the template
        # prediction = result['sm'].tail(14*24).tolist()

        # Pass the predicted data to predict.html for rendering
        prediction = result['sm'].tolist()
        index = result.index.tolist()
        prediction_data = pd.DataFrame({'ttime': index, 'sm': prediction}).to_dict(orient='records')

        return render_template('predict.html', prediction=prediction_data)
    else:
        error = 'Please enter 12 valid data points.'
        return render_template('input.html', error=error)


if __name__ == '__main__':
    app.run(debug=True)
