# Your Seville Tour Guide 💃🇪🇸

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React_Native-0.7x-61dafb.svg)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ecf8e.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)

## Información del Proyecto

*   **Título:** Your Seville Tour Guide �🇪🇸
*   **Autor:** Antonio Padilla
*   **Fecha:** Febrero 2026
*   **Versión:** 1.0.0
*   **Módulo:** Proyecto Final de Desarrollo de Aplicaciones Móviles

## Descripción

**Your Seville Tour Guide** es una aplicación móvil desarrollada en **React Native** con **TypeScript** diseñada para enriquecer la experiencia turística en la ciudad de Sevilla. La aplicación permite a los usuarios gestionar sus propias rutas turísticas, visualizar mapas interactivos, generación de informes PDF y utilizar herramientas de asistencia inteligente.

La app integra autenticación segura en la nube, geolocalización en tiempo real y **síntesis de voz (Audioguía)** para ofrecer una experiencia personalizada.

## 📱 Características Principales

*   **Gestión de Usuarios:** Registro e inicio de sesión seguro.
*   **Tours:** Listado de tours disponibles con detalles (ciudad, idioma, duración).
*   **Mapas:** Visualización de rutas y paradas específicas (`TourMapScreen`).
*   **Asistente Turístico:** Chatbot integrado con IA (Rasa) para resolver dudas en tiempo real.
*   **Informes:** Módulo para la visualización y generación de reportes en PDF.

## 🛠 Tech Stack

*   **Frontend:** React Native, React Navigation.
*   **Backend / Base de Datos:** Supabase (PostgreSQL + Auth).*  
*   **Lenguaje:** TypeScript.*
*   **Navegación:** React Navigation (Native Stack).
*   **IA / Chatbot:** Rasa Framework.
*   **Mapas:** React Native Maps.
*   **Audio:** Expo Speech.
*   **Validación:** Yup.

---

## 🚀 Configuración del Proyecto

### Prerrequisitos

*   Node.js (v18 o superior).
*   npm o yarn.
*   Dispositivo móvil con Expo Go instalado o Emulador (Android Studio / Xcode).

### 1. Instalación de Dependencias

Clona el repositorio e instala las librerías de Node.js:

```bash
npm install
# o
yarn install
```

### 2. Configuración de Supabase (Base de Datos)

Para que la aplicación funcione, debes ejecutar el siguiente script SQL en el **SQL Editor** de tu proyecto en Supabase. Esto creará las tablas necesarias y configurará las políticas de seguridad (RLS).

```sql
-- 1. Tabla de Perfiles (Profiles)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  profile_image text,
  create_at timestamp with time zone default now()
);

alter table profiles enable row level security;

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
```

### 3. Configuración del Asistente (Rasa)

El chat requiere que el servidor de Rasa esté activo. Sigue estos pasos en tu entorno de Python:

**Paso 1: Activar el entorno virtual**
Asegúrate de estar en la carpeta del proyecto del bot y activa el entorno:

```bash
source .venv/bin/activate
# Verás (venv) al principio de la línea de comandos
```

**Paso 2: Levantar el servidor**
Ejecuta el siguiente comando para iniciar Rasa habilitando la API y los permisos CORS (necesario para que la App móvil se comunique con el servidor):

```bash
rasa run --enable-api --cors "*" --debug
```

> **Nota para Codespaces:** Si estás ejecutando esto en GitHub Codespaces, asegúrate de configurar la visibilidad del puerto (usualmente 5005) como **Public** para que la aplicación móvil pueda acceder a la URL.

---

## ▶️ Ejecutar la Aplicación

Una vez que Supabase está configurado y Rasa está corriendo:

1.  Inicia Metro Bundler:
    ```bash
    npx expo start
    # o
    npm start
    ```
2.  Escanea el código QR con tu dispositivo o usa un emulador (Android/iOS).

## 📂 Estructura del Proyecto

A continuación se detalla la estructura completa de carpetas y archivos del proyecto:

```text
YourSevilleTourGuide_Final/
├── src/
│   ├── assets/            # Imágenes (logos), fuentes y otros recursos estáticos.
│   ├── components/        # Componentes de UI reutilizables (ej. ChatAssistant.tsx).
|   |   ├── ChatAssistant.tsx
|   |   |── LogoReportURL.tsx
|   |── navegation/
|   |   |── AuthStack.tsx
│   ├── screens/           # Pantallas principales de la aplicación.
|   |   |── HomeScreen.tsx
|   |   |── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ReportScreen.tsx
│   │   ├── ToursScreen.tsx
│   │   ├── TourMapScreen.tsx
│   └── services/          # Conexión con APIs y servicios externos (supabase.ts).
|   │   ├── supabase.ts
|   │   |── rasa.ts
|   │   |── pdfService.ts
│   └── styles/
|       |── styles.js
├── .env                   # Variables de entorno (¡No subir a Git!).
├── App.tsx                # Punto de entrada y configuración de la navegación.
├── babel.config.js        # Configuración de Babel.
├── package.json           # Dependencias y scripts del proyecto.
└── tsconfig.json          # Configuración de TypeScript.
```

## 📄 Navegación (Screens)

*   **Register:** Pantalla de acceso.
*   **Tours:** Listado principal de rutas.
*   **MapaDetallado:** Vista de mapa para un tour específico.
*   **Asistente:** Chat con la IA.
*   **Reportes:** Generación de PDFs.

---
© 2026 Your Seville Tour Guide. Todos los derechos reservados.