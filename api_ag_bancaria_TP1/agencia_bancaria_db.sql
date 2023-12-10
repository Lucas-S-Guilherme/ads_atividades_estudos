drop database if exists agencia_bancaria_db;
create database agencia_bancaria_db;
use agencia_bancaria_db;

create table banco (
    id_ban int not null auto_increment primary key,
    nome_fantasia varchar (200) not null,
    razao_social varchar (200) not null,
    cnpj varchar (20) not null,
    numero varchar(3) not null
);

INSERT INTO banco VALUES (1, 'Banco Agro Rondônia', 'Banco Agro Rondônia S/A', '12.365.954/0001-65', '092');

create table agencia (
    id_age int not null auto_increment primary key,
    numero varchar (100) not null,
    nome_fantasia varchar (200) not null,
    razao_social varchar (200) not null,
    cnpj varchar (20) not null,
    telefone varchar (200),
    email varchar (200),
    ban_id int not null,
    foreign key (ban_id) references banco (id_ban)
);

INSERT INTO agencia VALUES (1, '1020', 'Agência Ji-Paraná', 'Agência Ji-Paraná LTDA', '12.365.954/0002-15', '(69) 3422-0012', 'jiparana@bancoagro.com.br', 1);

create table cliente (
    id_cli int not null auto_increment primary key,
    nome varchar (200) not null,
    cpf_cnpj varchar (50) not null,
    rg varchar (100) not null,
    sexo varchar (1),
    data_nascimento date not null,
    renda decimal(12, 2) not null,
    endereco varchar (300) not null,
    email varchar (300) not null,
    telefone varchar (200) not null
);

INSERT INTO cliente VALUES (1, 'João Teixeira', '123.456.789-96', '53644', 'M', '1986-11-13', 8632.42, 'Rua ABC, 9503 - Bairro A - Campo Grande', 'joao@gmail.com', '(69) 99632-9999');
INSERT INTO cliente VALUES (2, 'Miguel da Silva', '123.432.789-12', '53644', 'M', '1996-10-25', 8632.42, 'Rua C, 536 - Bairro Z - Campo Grande', 'miguel@gmail.com', '(69) 99632-5554');

create table conta (
    id_con int not null auto_increment primary key,
    numero int not null,
    data_abertura date not null,
    saldo decimal(12, 2),
    valor_limite decimal(12, 2),
    agencia_id int not null,
    cliente_id int not null,
    foreign key (agencia_id) references agencia (id_age),
    foreign key (cliente_id) references cliente (id_cli)
);

INSERT INTO conta VALUES (1, 75332, '2023-10-10', 1000.50, 2500.00, 1, 1);
INSERT INTO conta VALUES (2, 86787, '2023-09-01', 600.00, 100.00, 1, 2);

SELECT * FROM conta, agencia, cliente WHERE agencia_id = id_age AND cliente_id = id_cli;

create table deposito (
    id_dep int not null auto_increment primary key,
    valor decimal(12, 2) not null,
    data_hora datetime not null,
    conta_id int not null,
    foreign key (conta_id) references conta (id_con)
);

INSERT INTO deposito VALUES (1, 500.23, '2023-11-23 10:32:52', 1);
UPDATE conta SET saldo = saldo + 500.23 WHERE id_con = 1;

create table saque (
    id_saq int not null auto_increment primary key,
    valor decimal(12, 2) not null,
    data_hora datetime not null,
    conta_id int not null,
    foreign key (conta_id) references conta (id_con)
);

INSERT INTO saque VALUES (1, 200.00, '2023-11-24 10:32:52', 1);
UPDATE conta SET saldo = saldo - 200.00 WHERE id_con = 1;

SELECT * FROM saque, conta, cliente WHERE conta_id = id_con AND cliente_id = id_cli;

create table transferencia (
    id_tra int not null auto_increment primary key,
    valor decimal(12, 2) not null,
    data_hora datetime not null,
    descricao varchar (100),
    conta_origem_id int not null,
    conta_destino_id int not null,
    foreign key (conta_origem_id) references conta (id_con),
    foreign key (conta_destino_id) references conta (id_con)
);

INSERT INTO transferencia VALUES (1, 300.00, '2023-11-25 08:00:52', 'Pagto de divida', 1, 2);
UPDATE conta SET saldo = saldo - 300.00 WHERE id_con = 1;
UPDATE conta SET saldo = saldo + 300.00 WHERE id_con = 2;

