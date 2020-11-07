CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists products (
	id uuid default uuid_generate_v1() primary key,
	title text not null,
	description text not null,
	price integer not null
);

create table if not exists stocks (
	product_id uuid primary key,
	"count" integer not null,
	constraint fk_product foreign key (product_id) references products(id) on delete cascade
);

-- INSERT DATA WITH AUTO GENERATED ID
--insert into products (title, description, price) values 
--	('РЮКЗАК BUTTERFLY YASYO', 'Новый стильный и функциональный рюкзак Butterfly Yasyo с отделом для обуви. Внутри имеется специальный карман для чехла с ракеткой. Имеет плотный и износостойкий иматериал. Объем: 36 л. Размеры: 45х36х22 см. Ткань: полиэстер 1620D', 2340),
--	('РАКЕТКА BUTTERFLY TIMO BOLL BLACK', 'Самая дорогая и самая мощная ракетка серии Buttefly Timo Boll. Полностью сосредоточена на агрессивную атакующую игру. Толщина губки 2.0 дает взривную скорость, при этом не позволяет много терять в контроле мяча.', 2200),
--	('КРОССОВКИ BUTTERFLY LEZOLINE TRYNEX', 'Модель вышла на замену легендарным Butterfly Utop. Мягкая и цепка подошла, выполненная из специального материала для зальных видов спорта, обеспечит прекрасный контроль работы ног. Trynex прекрасно вентилирует за счет текстильных вставок сетки в верхней части кроссовка. Стоит отметить защищенный полиуретановый носок и пятка, которые обеспечивают долговечную службу обуви.', 2300);

-- INSERT DATA WITH DEFINED ID TO BE ABLE TO ADD STOCKS AFTERWARDS
insert into products (id, title, description, price) values 
	('1a01dfc0-1f3d-11eb-aca9-024cea17900f', 'РЮКЗАК BUTTERFLY YASYO', 'Новый стильный и функциональный рюкзак Butterfly Yasyo с отделом для обуви. Внутри имеется специальный карман для чехла с ракеткой. Имеет плотный и износостойкий иматериал. Объем: 36 л. Размеры: 45х36х22 см. Ткань: полиэстер 1620D', 2340),
	('1a01e5c4-1f3d-11eb-acaa-024cea17900f', 'РАКЕТКА BUTTERFLY TIMO BOLL BLACK', 'Самая дорогая и самая мощная ракетка серии Buttefly Timo Boll. Полностью сосредоточена на агрессивную атакующую игру. Толщина губки 2.0 дает взривную скорость, при этом не позволяет много терять в контроле мяча.', 2200),
	('1a01e6be-1f3d-11eb-acab-024cea17900f', 'КРОССОВКИ BUTTERFLY LEZOLINE TRYNEX', 'Модель вышла на замену легендарным Butterfly Utop. Мягкая и цепка подошла, выполненная из специального материала для зальных видов спорта, обеспечит прекрасный контроль работы ног. Trynex прекрасно вентилирует за счет текстильных вставок сетки в верхней части кроссовка. Стоит отметить защищенный полиуретановый носок и пятка, которые обеспечивают долговечную службу обуви.', 2300);

insert into stocks (product_id, "count") values 
	('1a01dfc0-1f3d-11eb-aca9-024cea17900f', 5),
	('1a01e5c4-1f3d-11eb-acaa-024cea17900f', 15),
	('1a01e6be-1f3d-11eb-acab-024cea17900f', 10);