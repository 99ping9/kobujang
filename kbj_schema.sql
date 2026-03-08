-- =============================================
-- 코부장 저널링 DB 스키마 (kbj_ 접두사)
-- =============================================

-- 1. 사용자 테이블
CREATE TABLE IF NOT EXISTS kbj_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  avatar text,
  bg_color text,
  is_column_challenge boolean DEFAULT false,
  dream_days integer DEFAULT 0,   -- 100% 달성일수 (모든 항목 완료 시 +1)
  created_at timestamptz DEFAULT now()
);

-- 2. 기록 테이블 (항목1/항목2/항목3)
CREATE TABLE IF NOT EXISTS kbj_journals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES kbj_users(id) ON DELETE CASCADE,
  date date NOT NULL,
  type text NOT NULL CHECK (type IN ('item1', 'item2', 'item3')),
  link text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date, type)
);

-- 3. 인덱스
CREATE INDEX IF NOT EXISTS kbj_journals_user_date ON kbj_journals(user_id, date);
CREATE INDEX IF NOT EXISTS kbj_journals_date ON kbj_journals(date);

-- 4. Row Level Security (RLS)
ALTER TABLE kbj_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kbj_journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kbj_allow_read_users" ON kbj_users FOR SELECT USING (true);
CREATE POLICY "kbj_allow_insert_users" ON kbj_users FOR INSERT WITH CHECK (true);
CREATE POLICY "kbj_allow_update_users" ON kbj_users FOR UPDATE USING (true);
CREATE POLICY "kbj_allow_delete_users" ON kbj_users FOR DELETE USING (true);

CREATE POLICY "kbj_allow_read_journals" ON kbj_journals FOR SELECT USING (true);
CREATE POLICY "kbj_allow_insert_journals" ON kbj_journals FOR INSERT WITH CHECK (true);
CREATE POLICY "kbj_allow_update_journals" ON kbj_journals FOR UPDATE USING (true);
CREATE POLICY "kbj_allow_delete_journals" ON kbj_journals FOR DELETE USING (true);
