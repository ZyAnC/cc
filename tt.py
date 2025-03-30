# Importing Libraries
import serial
import time

# Setup the serial connection
arduino = serial.Serial(port='COM10', baudrate=115200, timeout=.1)

def write_read(x):
    arduino.write(bytes(x, 'utf-8'))  # Send the input to the Arduino
    time.sleep(0.05)  # Wait for Arduino to process the input
    data = arduino.readline()  # Read the response from Arduino
    return data

while True:
    num = input("Enter a number (1 or 0): ")  # Taking input from user
    if num in ['0', '1']:  # Ensure input is either '0' or '1'
        value = write_read(num)  # Send the input to the Arduino and get the response
        print(value.decode('utf-8').strip())  # Print the response from Arduino as 1 or 0
    else:
        print("Please enter 1 or 0.")