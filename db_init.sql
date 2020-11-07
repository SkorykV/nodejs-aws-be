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
--	('������ BUTTERFLY YASYO', '����� �������� � �������������� ������ Butterfly Yasyo � ������� ��� �����. ������ ������� ����������� ������ ��� ����� � ��������. ����� ������� � ������������� ���������. �����: 36 �. �������: 45�36�22 ��. �����: ��������� 1620D', 2340),
--	('������� BUTTERFLY TIMO BOLL BLACK', '����� ������� � ����� ������ ������� ����� Buttefly Timo Boll. ��������� ������������� �� ����������� ��������� ����. ������� ����� 2.0 ���� �������� ��������, ��� ���� �� ��������� ����� ������ � �������� ����.', 2200),
--	('��������� BUTTERFLY LEZOLINE TRYNEX', '������ ����� �� ������ ����������� Butterfly Utop. ������ � ����� �������, ����������� �� ������������ ��������� ��� ������� ����� ������, ��������� ���������� �������� ������ ���. Trynex ��������� ����������� �� ���� ����������� ������� ����� � ������� ����� ���������. ����� �������� ���������� �������������� ����� � �����, ������� ������������ ����������� ������ �����.', 2300);

-- INSERT DATA WITH DEFINED ID TO BE ABLE TO ADD STOCKS AFTERWARDS
insert into products (id, title, description, price) values 
	('1a01dfc0-1f3d-11eb-aca9-024cea17900f', '������ BUTTERFLY YASYO', '����� �������� � �������������� ������ Butterfly Yasyo � ������� ��� �����. ������ ������� ����������� ������ ��� ����� � ��������. ����� ������� � ������������� ���������. �����: 36 �. �������: 45�36�22 ��. �����: ��������� 1620D', 2340),
	('1a01e5c4-1f3d-11eb-acaa-024cea17900f', '������� BUTTERFLY TIMO BOLL BLACK', '����� ������� � ����� ������ ������� ����� Buttefly Timo Boll. ��������� ������������� �� ����������� ��������� ����. ������� ����� 2.0 ���� �������� ��������, ��� ���� �� ��������� ����� ������ � �������� ����.', 2200),
	('1a01e6be-1f3d-11eb-acab-024cea17900f', '��������� BUTTERFLY LEZOLINE TRYNEX', '������ ����� �� ������ ����������� Butterfly Utop. ������ � ����� �������, ����������� �� ������������ ��������� ��� ������� ����� ������, ��������� ���������� �������� ������ ���. Trynex ��������� ����������� �� ���� ����������� ������� ����� � ������� ����� ���������. ����� �������� ���������� �������������� ����� � �����, ������� ������������ ����������� ������ �����.', 2300);

insert into stocks (product_id, "count") values 
	('1a01dfc0-1f3d-11eb-aca9-024cea17900f', 5),
	('1a01e5c4-1f3d-11eb-acaa-024cea17900f', 15),
	('1a01e6be-1f3d-11eb-acab-024cea17900f', 10);