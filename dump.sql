create database dindin

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome text not null,
    email text not null unique,
    senha text not null
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    descricao text
   
);

CREATE TABLE transacoes (
    id SERIAL PRIMARY KEY,
    descricao text,
  	valor int,
  	data date,
  	categoria_id INTEGER REFERENCES categorias(id),
  	usuario_id INTEGER REFERENCES usuarios(id),
  	tipo text
   
);


INSERT INTO categorias (descricao)
VALUES
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Lazer'),
('Família'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas')