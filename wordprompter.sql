CREATE TABLE likedwords (
  id serial primary key,
  likedword VARCHAR(50) NOT NULL,
  selectedbefore BOOLEAN default false
)
CREATE TABLE seenlikedwords (
  id serial primary key,
  likedword VARCHAR(50) NOT NULL,
  selectedbefore BOOLEAN default true
)