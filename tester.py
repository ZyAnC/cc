import serial
import mysql.connector


db = mysql.connector.connect(
    host="localhost",        
    user="root",   
    password="123456",
    database="Lind"
)

cursor = db.cursor()


ser = serial.Serial('COM9', 115200, timeout=1)


try:
    while True:
        data = ser.readline().decode('utf-8').strip()
        
        if data:
            print(f"RFID:{data}")
            query = "SELECT authorized FROM employee_role WHERE rfid = %s"
            cursor.execute(query, (data,))
            result = cursor.fetchone()

            if result:
                authorized = result[0]
                print(f"{authorized}")
            else:
                print("not found")

except KeyboardInterrupt:
    print("")
finally:
    ser.close()
    cursor.close()
    db.close()
