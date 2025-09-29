-- Create table for storing page views
CREATE TABLE IF NOT EXISTS page_views (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    page VARCHAR(500) NOT NULL,
    referrer VARCHAR(1000),
    user_ip VARCHAR(100),
    user_agent TEXT,
    load_time INTEGER,
    request_id VARCHAR(100),
    session_id VARCHAR(100)
);

-- Create index for faster queries by timestamp
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp DESC);

-- Create index for session tracking
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);