const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const dotenv = require('dotenv');
const mqtt = require('mqtt');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

dotenv.config();
console.log('Preparing to connect to MQTT broker...');
const client = mqtt.connect('mqtt://192.168.1.12:1884', {
  username: 'huuthang',
  password: 'B21DCCN667',
});

// Kiểm tra kết nối MQTT
console.log('Attempting to connect to MQTT broker...');

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('led_control', { qos: 1 }, (err) => {
    if (err) {
      console.error('Failed to subscribe to topic led_control', err);
    } else {
      console.log('Subscribed to topic led_control');
    }
  });
  client.subscribe('led_status', { qos: 1 }, (err) => {
    if (err) {
      console.error('Failed to subscribe to topic led_status', err);
    } else {
      console.log('Subscribed to topic led_status');
    }
  });
});

client.on('error', (error) => {
  console.error('MQTT connection error: ', error);
});
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
});
// Nhận tin nhắn từ topic led_control
client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
});
client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  
  // Chỉ gửi tin nhắn của topic `led_status` đến WebSocket client
  if (topic === 'led_status') {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString()); // Phát thông điệp đến tất cả WebSocket clients
      }
    });
  }
});

// Tạo ứng dụng Express
const app = express();
app.use(cors()); // Cho phép các yêu cầu từ frontend
app.use(express.json()); // Middleware để phân tích cú pháp JSON

const config = {
  user: 'sa',
  password: '1234567',
  server: 'localhost',
  database: 'IOT',
  options: {
    encrypt: false, // Giữ mã hóa nếu bạn kết nối từ xa
    enableArithAbort: true, // Đề phòng các lỗi về phép tính
  },
};

// Kết nối đến cơ sở dữ liệu
sql.connect(config)
  .then(() => {
    console.log('Database connected successfully'); // Thông báo kết nối thành công
  })
  .catch(err => {
    console.error('Database connection error: ', err); // Thông báo lỗi kết nối
  });

// Định nghĩa endpoint để lấy dữ liệu cảm biến
// Định nghĩa endpoint để lấy dữ liệu cảm biến với phân trang
app.get('/api/sensor-data', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Số trang, mặc định là 1
  const pageSize = parseInt(req.query.pageSize) || 5; // Kích thước trang, mặc định là 5

  try {
    // Tính toán chỉ số bắt đầu
    const offset = (page - 1) * pageSize;

    // Lấy tổng số bản ghi
    const totalCountResult = await sql.query('SELECT COUNT(*) AS total FROM sensor_data');
    const totalCount = totalCountResult.recordset[0].total;

    // Lấy dữ liệu với phân trang
    const result = await sql.query(`
      SELECT * FROM sensor_data
      ORDER BY timestamp DESC
      OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
    `);
    
    // Gửi dữ liệu về frontend
    res.json({
      data: result.recordset,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / pageSize), // Tổng số trang
      currentPage: page,
      pageSize: pageSize,
    });
  } catch (err) {
    console.error('Error retrieving data: ', err); // Thông báo lỗi khi truy vấn
    res.status(500).send('Error retrieving data');
  }
});



// Định nghĩa endpoint để lấy lịch sử LED
// Định nghĩa endpoint để lấy lịch sử LED với phân trang
app.get('/api/led-history', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Số trang, mặc định là 1
  const pageSize = parseInt(req.query.pageSize) || 5; // Kích thước trang, mặc định là 5

  try {
    // Tính toán chỉ số bắt đầu
    const offset = (page - 1) * pageSize; // Sửa lại để tính toán đúng chỉ số bắt đầu

    // Lấy tổng số bản ghi
    const totalCountResult = await sql.query('SELECT COUNT(*) AS total FROM led_history');
    const totalCount = totalCountResult.recordset[0].total;

    // Lấy dữ liệu với phân trang
    const result = await sql.query(`
      SELECT * 
      FROM led_history 
      ORDER BY timestamp DESC 
      OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
    `);
    
    // Gửi dữ liệu về frontend
    res.json({
      data: result.recordset,
      totalItems: totalCount, // Tổng số bản ghi
      totalPages: Math.ceil(totalCount / pageSize), // Tổng số trang
      currentPage: page, // Trang hiện tại
      pageSize: pageSize, // Kích thước trang
    });
  } catch (err) {
    console.error('Error retrieving data: ', err); // Thông báo lỗi khi truy vấn
    res.status(500).send('Error retrieving data');
  }
});



// API gửi tín hiệu MQTT
app.post('/send-command', (req, res) => {
  const { topic, payload } = req.body || {};
  console.log(`Received command. Topic: ${topic}, Payload: ${payload}`); // Log thông tin nhận được
  if (!topic || !payload) {
    return res.status(400).json({ error: 'Invalid request body' });
  }
  
  console.log(`Publishing to MQTT. Topic: ${topic}, Payload: ${payload}`);

  client.publish(topic, payload, { qos: 1 }, (error) => {
    if (error) {
      console.error('Error publishing message: ', error);
      return res.status(500).send('Error publishing message');
    }
    res.send('Command sent');
  });
});

// API lưu lịch sử LED vào cơ sở dữ liệu
app.post('/save-history', async (req, res) => {
  const { device, action } = req.body || {}; // Sử dụng 'action' thay vì 'state'
  if (!device || action === undefined) {
    return res.status(400).json({ error: 'Invalid request body' }); // Kiểm tra nếu device hoặc action không hợp lệ
  }

  const timestamp = new Date();
  
  const query = 'INSERT INTO led_history (led_name, action, timestamp) VALUES (@device, @action, @timestamp)'; // Cập nhật truy vấn
  const request = new sql.Request();
  request.input('device', sql.VarChar, device);
  request.input('action', sql.VarChar, action); // Sử dụng 'action'
  request.input('timestamp', sql.DateTime, timestamp);
  
  try {
    await request.query(query);
    res.send('History saved');
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).send('Error saving history');
  }
});

app.get('/api/led-history/search', async (req, res) => {
  const { query, page = 1, pageSize = 5 } = req.query;

  try {
    const pool = await sql.connect(config);

    // Xây dựng câu truy vấn SQL cho tìm kiếm
    const offset = (page - 1) * pageSize;
    const searchQuery = `
      SELECT * FROM led_history 
      WHERE 
        CAST(id AS NVARCHAR) LIKE '%' + @query + '%' OR
        led_name LIKE '%' + @query + '%' OR
        action LIKE '%' + @query + '%' OR
        CONVERT(NVARCHAR, timestamp, 120) LIKE '%' + @query + '%'
      ORDER BY timestamp DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;

    const totalQuery = `
      SELECT COUNT(*) AS totalItems FROM led_history 
      WHERE 
        CAST(id AS NVARCHAR) LIKE '%' + @query + '%' OR
        led_name LIKE '%' + @query + '%' OR
        action LIKE '%' + @query + '%' OR
        CONVERT(NVARCHAR, timestamp, 120) LIKE '%' + @query + '%';
    `;

    const result = await pool.request()
      .input('query', sql.NVarChar, query)
      .input('offset', sql.Int, offset)
      .input('pageSize', sql.Int, pageSize)
      .query(searchQuery);

    const totalResult = await pool.request()
      .input('query', sql.NVarChar, query)
      .query(totalQuery);

    res.json({
      data: result.recordset,
      totalItems: totalResult.recordset[0].totalItems,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Server error');
  }
});

app.get('/api/sensor-data/search', async (req, res) => {
  const { query, page = 1, pageSize = 5, filterType = 'all', startDate, endDate } = req.query;

  try {
    const pool = await sql.connect(config);
    const offset = (page - 1) * pageSize;
    
    // Log kiểm tra giá trị startDate và endDate nhận được từ frontend
    console.log("Received startDate:", startDate);
    console.log("Received endDate:", endDate);

    const searchQuery = `
      SELECT * FROM sensor_data
      WHERE 
        (${filterType === 'all' ? '1=1' : `${filterType} IS NOT NULL`}) AND
        (CAST(id AS NVARCHAR) LIKE '%' + @query + '%' OR
         CAST(temperature AS NVARCHAR) LIKE '%' + @query + '%' OR
         CAST(humidity AS NVARCHAR) LIKE '%' + @query + '%' OR
         CAST(light AS NVARCHAR) LIKE '%' + @query + '%' OR
         CONVERT(NVARCHAR, timestamp, 120) LIKE '%' + @query + '%') AND
        (@startDate IS NULL OR timestamp >= @startDate) AND
        (@endDate IS NULL OR timestamp <= @endDate)
      ORDER BY timestamp DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
    `;

    const totalQuery = `
      SELECT COUNT(*) AS totalItems FROM sensor_data
      WHERE 
        (${filterType === 'all' ? '1=1' : `${filterType} IS NOT NULL`}) AND
        (CAST(id AS NVARCHAR) LIKE '%' + @query + '%' OR
         CAST(temperature AS NVARCHAR) LIKE '%' + @query + '%' OR
         CAST(humidity AS NVARCHAR) LIKE '%' + @query + '%' OR
         CAST(light AS NVARCHAR) LIKE '%' + @query + '%' OR
         CONVERT(NVARCHAR, timestamp, 120) LIKE '%' + @query + '%') AND
        (@startDate IS NULL OR timestamp >= @startDate) AND
        (@endDate IS NULL OR timestamp <= @endDate)
    `;

    const result = await pool.request()
      .input('query', sql.NVarChar, query)
      .input('offset', sql.Int, offset)
      .input('pageSize', sql.Int, pageSize)
      .input('startDate', sql.DateTime, startDate ? new Date(startDate) : null)
      .input('endDate', sql.DateTime, endDate ? new Date(endDate) : null)
      .query(searchQuery);

    const totalResult = await pool.request()
      .input('query', sql.NVarChar, query)
      .input('startDate', sql.DateTime, startDate ? new Date(startDate) : null)
      .input('endDate', sql.DateTime, endDate ? new Date(endDate) : null)
      .query(totalQuery);

    res.json({
      data: result.recordset,
      totalItems: totalResult.recordset[0].totalItems,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Server error');
  }
});


// Chạy server
const PORT = 5000;
app.listen(PORT, () => {
  console.log('Starting server...');
  console.log(`Server is running on port ${PORT}`);
});
