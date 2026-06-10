ALTER TABLE todos ADD COLUMN priority INTEGER NOT NULL DEFAULT 0;

CREATE INDEX idx_todos_priority ON todos (priority) WHERE done = 0;
