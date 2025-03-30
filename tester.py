import serial
import mysql.connector
import time

db = mysql.connector.connect(
    host="localhost",        
    user="root",   
    password="123456",
    database="Lind"
)

cursor = db.cursor()


ser = serial.Serial('COM9', 115200, timeout=1)
arduino = serial.Serial(port='COM10', baudrate=115200, timeout=.1)

def write_read(x):
    arduino.write(bytes(x, 'utf-8'))  # Send the input to the Arduino
    time.sleep(0.05)  # Wait for Arduino to process the input
    data = arduino.readline()  # Read the response from Arduino
    return data

try:
    while True:
        data = ser.readline().decode('utf-8').strip()
        
        if data:
            print(f"RFID:{data}")
            query = "SELECT authorized FROM employee_role WHERE rfid = %s"
            cursor.execute(query, (data,))
            result = cursor.fetchone()

            if result:
                authorized = str(result[0])
                write_read(authorized)
            else:
               print("not found")
               write_read(str(3))

except KeyboardInterrupt:
    print("")
finally:
    ser.close()
    cursor.close()
    db.close()
