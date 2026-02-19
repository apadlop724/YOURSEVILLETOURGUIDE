-- 1. Tabla de Perfiles (Profiles)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  profile_image text,
  create_at timestamp with time zone default now()
);

alter table profiles enable row level security;

-- Políticas Profiles
create policy "Select own profile" on profiles for select using (auth.uid() = id);
create policy "Update own profile" on profiles for update using (auth.uid() = id);
create policy "Insert own profile" on profiles for insert with check (auth.uid() = id);

-- 2. Tabla de Tours
create table if not exists tours (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  city text not null,
  language text not null,
  cover_image text,
  duration int,
  created_by uuid not null,
  created_at timestamp with time zone default now(),
  constraint create_by_fkey foreign key (created_by) references profiles(id) on delete cascade
);

alter table tours enable row level security;

-- Políticas Tours
create policy "Select all tours" on tours for select using (true);
create policy "Insert own tours" on tours for insert with check (auth.uid()=created_by);
create policy "Usuarios pueden editar sus propios tours" on tours for update using (auth.uid() = created_by);
create policy "Usuarios pueden borrar sus propios tours" on tours for delete using (auth.uid() = created_by);
-- 3. Tabla de Paradas (Stops)
create table if not exists stops (
  id uuid primary key default uuid_generate_v4(),
  tour_id uuid not null,
  title text not null,
  description text,
  latitude double precision not null,
  longitude double precision not null,
  stop_order int not null,  
  created_at timestamp with time zone default now(),
  constraint tour_fkey foreign key (tour_id) references tours(id) on delete cascade
);

alter table stops enable row level security;

-- Políticas Stops
create policy "View all stops" on stops for select using (true);

-- Insertar: Solo autenticados (la lógica de negocio debe asegurar que el tour pertenezca al usuario)
create policy "Insert own stops" on stops for insert to public with check (auth.uid() is not null);

-- Actualizar: Solo si el usuario es dueño del tour padre
create policy "Usuarios pueden editar paradas de sus tours" on stops for update using (
  exists (
    select 1 from tours
    where tours.id = stops.tour_id
    and tours.created_by = auth.uid()
  )
);

-- Borrar: Solo si el usuario es dueño del tour padre
create policy "Usuarios pueden borrar paradas de sus tours" on stops for delete using (
  exists (
    select 1 from tours
    where tours.id = stops.tour_id
    and tours.created_by = auth.uid()
  )
);
