-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'dormer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create dormers table
CREATE TABLE IF NOT EXISTS dormers (
  dormer_id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  program VARCHAR(100),
  year_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  room_id SERIAL PRIMARY KEY,
  room_number VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(100) NOT NULL,
  floor INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create amenities table
CREATE TABLE IF NOT EXISTS amenities (
  amenity_id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create room_amenities junction table
CREATE TABLE IF NOT EXISTS room_amenities (
  room_id INTEGER NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
  amenity_id INTEGER NOT NULL REFERENCES amenities(amenity_id) ON DELETE CASCADE,
  PRIMARY KEY (room_id, amenity_id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  booking_id SERIAL PRIMARY KEY,
  dormer_id INTEGER NOT NULL REFERENCES dormers(dormer_id) ON DELETE CASCADE,
  room_id INTEGER NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  num_months INTEGER NOT NULL,
  num_occupants INTEGER NOT NULL,
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dormers_user_id ON dormers(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dormer_id ON bookings(dormer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_rooms_floor ON rooms(floor);
