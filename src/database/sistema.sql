-- Active: 1683917889501@@127.0.0.1@3306


CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
);

INSERT INTO usuarios ( nome, email, senha) VALUES
  ('Maria', 'maria@gmail.com', 'senha123'),
  ('Catarina', 'catarina@gmail.com', 'senha456');

SELECT *FROM usuarios;
DROP TABLE usuarios;


CREATE TABLE mesas (
  id INTEGER PRIMARY KEY,
  numero INTEGER NOT NULL UNIQUE
);

DROP TABLE mesas; 
INSERT INTO mesas (numero) VALUES

  (1),
  (2),
  (3),
  (4),
  (5),
  (6),
  (7),
  (8),
  (9),
  (10),
  (11),
  (12),
  (13),
  (14),
  (15);

SELECT *FROM mesas;
CREATE TABLE reservas (
  id INTEGER PRIMARY KEY,
  usuario_id INTEGER,
  nome TEXT NOT NULL,
  mesa_id INTEGER,
  data DATE NOT NULL,
  horario TIME NOT NULL,
  pessoas INTEGER NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  FOREIGN KEY (mesa_id) REFERENCES mesas (id)

);

INSERT INTO reservas (usuario_id,nome, mesa_id, data, horario,pessoas) VALUES
  ("1","Maria","2", "2023-05-15", '18:30',"2"),
  ("2","Catarina","5", "2023-05-16", '19:00',"4");
  SELECT *FROM reservas;

  DROP TABLE reservas;