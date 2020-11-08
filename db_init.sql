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

with product_ids as (insert into products (title, description, price) values 
	('������ BUTTERFLY YASYO', '����� �������� � �������������� ������ Butterfly Yasyo � ������� ��� �����. ������ ������� ����������� ������ ��� ����� � ��������. ����� ������� � ������������� ���������. �����: 36 �. �������: 45�36�22 ��. �����: ��������� 1620D', 2340),
	('������� BUTTERFLY TIMO BOLL BLACK', '����� ������� � ����� ������ ������� ����� Buttefly Timo Boll. ��������� ������������� �� ����������� ��������� ����. ������� ����� 2.0 ���� �������� ��������, ��� ���� �� ��������� ����� ������ � �������� ����.', 2200),
	('��������� BUTTERFLY LEZOLINE TRYNEX', '������ ����� �� ������ ����������� Butterfly Utop. ������ � ����� �������, ����������� �� ������������ ��������� ��� ������� ����� ������, ��������� ���������� �������� ������ ���. Trynex ��������� ����������� �� ���� ����������� ������� ����� � ������� ����� ���������. ����� �������� ���������� �������������� ����� � �����, ������� ������������ ����������� ������ �����.', 2300)
	returning id)
-- count will be in interval [5, 20]
insert into stocks (product_id, "count") select product_ids.id, floor(random()*(20-5+1))+5 from product_ids