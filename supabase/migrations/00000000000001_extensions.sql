-- Extensiones base requeridas por el esquema de Health Claims.
-- pgcrypto: gen_random_uuid() para PK UUID.
-- pg_trgm:  busqueda fuzzy (diagnosticos por nombre/codigo CIE-10).
-- uuid-ossp: funciones uuid generadoras (compatibilidad).

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";
create extension if not exists "uuid-ossp";
