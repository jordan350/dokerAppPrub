USE polidb;

CREATE TABLE IF NOT EXISTS registros (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  fecha DATE NOT NULL,
  esActivo BOOLEAN NOT NULL DEFAULT TRUE,
  categoria VARCHAR(100) NOT NULL,
  cantidad INT NOT NULL,
  descripcion VARCHAR(1000) NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_categoria (categoria),
  INDEX idx_fecha (fecha),
  INDEX idx_esActivo (esActivo)
);