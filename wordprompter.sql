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
CREATE TABLE sentences (
  id serial primary key,
  sentence text NOT NULL,
  firstword INTEGER references likedwords(id),
  secondword INTEGER references likedwords(id)
);

CREATE TABLE expandedsentences (
  id serial primary key,
  sentence text NOT NULL
);