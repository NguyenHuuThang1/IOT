import paho.mqtt.client as mqtt
import pyodbc
import json

# Kết nối với SQL Server
conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                      'SERVER=DESKTOP-IEJK89J\MSSQLSERVER01;'
                      'DATABASE=IOT;'
                      'UID=sa;'
                      'PWD=1234567;')

cursor = conn.cursor()

# Kiểm tra kết nối
try:
    cursor.execute("SELECT 1")
    print("Kết nối đến SQL Server thành công!")
except Exception as e:
    print(f"Lỗi kết nối đến SQL Server: {e}")

# Hàm khi nhận được tin nhắn từ MQTT
def on_message(client, userdata, message):
    try:
        # Kiểm tra topic để xác định hành động
        if message.topic == "data":
            # Dữ liệu từ cảm biến
            data = json.loads(message.payload.decode("utf-8"))
            temperature = data.get("temperature")
            humidity = data.get("humidity")
            light = data.get("light")

            # Lưu vào SQL Server
            cursor.execute("""INSERT INTO sensor_data (temperature, humidity, light) VALUES (?, ?, ?)""", (temperature, humidity, light))
            conn.commit()
            print(f"Lưu dữ liệu: {temperature}C, {humidity}%, {light} Lux vào SQL Server.")

        elif message.topic == "led_control":
            # Nhận lệnh bật/tắt LED
            command = message.payload.decode("utf-8")
            led_name = command.split(":")[0]  # Lấy tên LED từ lệnh
            action = command.split(": ")[1]    # Lấy hành động (ON/OFF)

            # Gửi lệnh đến ESP32
            client.publish("esp32/led_control", command)
            print(f"Gửi lệnh: {command}")

            # Lưu lịch sử bật/tắt LED vào SQL Server
            try:
                cursor.execute("""INSERT INTO led_history (led_name, action) VALUES (?, ?)""", (led_name, action))
                conn.commit()
                print(f"Lưu lịch sử: {led_name} {action}")
            except Exception as e:
                print(f"Lỗi khi lưu vào led_history: {e}")
        elif message.topic == "led_status":
            command = message.payload.decode("utf-8")
            led_name = command.split(":")[0]  # Lấy tên LED từ lệnh
            action = command.split(": ")[1]    # Lấy hành động (ON/OFF)
            try:
                cursor.execute("""INSERT INTO led_status (led_name, action) VALUES (?, ?)""", (led_name, action))
                conn.commit()
                print(f"Lưu lịch sử: {led_name} {action}")
            except Exception as e:
                print(f"Lỗi khi lưu vào led_status: {e}")
    except json.JSONDecodeError:
        print("Lỗi: Dữ liệu nhận được không phải là JSON hợp lệ.")
    except Exception as e:
        print(f"Lỗi khi lưu dữ liệu: {e}")
        conn.rollback()  # Khôi phục lại nếu có lỗi

# Hàm khi kết nối thành công tới MQTT Broker
def on_connect(client, userdata, flags, rc):
    print("Kết nối MQTT thành công với mã rc: " + str(rc))
    client.subscribe("data")        # Subscribe vào topic "data"
    client.subscribe("led_control") 
    client.subscribe("led_status")

# Thiết lập MQTT Client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Kết nối tới MQTT Broker (Mosquitto)
client.username_pw_set("huuthang", "B21DCCN667")
client.connect("192.168.112.36", 1884, 60)

# Bắt đầu vòng lặp để lắng nghe dữ liệu
client.loop_forever()

# Đóng kết nối SQL khi kết thúc
cursor.close()
conn.close()
