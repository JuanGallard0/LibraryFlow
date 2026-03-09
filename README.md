# LibraryFlow

Sistema de gestión de biblioteca desarrollado con ASP.NET Core y React. Permite administrar libros, autores, socios, préstamos y reservas a través de una API REST y una interfaz web moderna.

---

## Tabla de contenidos

- [Demo en Azure](#demo-en-azure)
- [Prerrequisitos](#prerrequisitos)
- [Configuración local](#configuración-local)
- [Ejecución](#ejecución)
- [Usuarios de prueba](#usuarios-de-prueba)
- [Flujo de la aplicación](#flujo-de-la-aplicación)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Arquitectura](#arquitectura)
- [Pruebas](#pruebas)
- [Documentación de la API](#documentación-de-la-api)
- [Decisiones técnicas](#decisiones-técnicas)
- [Despliegue en Azure](#despliegue-en-azure)

---

## Demo en Azure

La aplicación está desplegada en Azure Container Apps:

- **Aplicación:** https://ca-web-dcwm2ve3kzv22.mangorock-874332c5.eastus.azurecontainerapps.io/
- **Documentación interactiva (Scalar):** https://ca-web-dcwm2ve3kzv22.mangorock-874332c5.eastus.azurecontainerapps.io/scalar/v1
- **Especificación OpenAPI:** https://ca-web-dcwm2ve3kzv22.mangorock-874332c5.eastus.azurecontainerapps.io/openapi/v1.json

---

## Prerrequisitos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- SQL Server

---

## Configuración local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/LibraryFlow.git
cd LibraryFlow
```

### 2. Configurar la cadena de conexión

Editar `src/Web/appsettings.json` con tu instancia de SQL Server:

```json
{
  "ConnectionStrings": {
    "LibraryFlowDb": "Server=(localdb)\\mssqllocaldb;Database=LibraryFlow;Trusted_Connection=True;"
  }
}
```

### 3. Aplicar migraciones y seed

Las migraciones y el seed de datos iniciales (autores, libros, usuarios) se aplican automáticamente al iniciar la aplicación por primera vez.

---

## Ejecución

### Visual Studio

Abrir la solución y ejecutar con el perfil **LibraryFlow.Web**. Visual Studio inicia el backend y el servidor de desarrollo de Vite automáticamente, y abre el navegador en `https://localhost:44447`.

### Línea de comandos

El script `prestart` del frontend ejecuta `generate-api` (NSwag), que necesita que el backend esté disponible antes de iniciar Vite. Por eso es necesario arrancarlos por separado:

**Terminal 1 — backend** (esperar a que esté listo):

```bash
cd src/Web
dotnet watch run --launch-profile "ApiOnly"
```

**Terminal 2 — frontend** (una vez el backend esté corriendo):

```bash
cd src/Web/ClientApp
npm install
npm start
```

El frontend estará disponible en `https://localhost:44447`. Las peticiones a `/api` se redirigen automáticamente al backend.

Si se quiere omitir la generación del cliente HTTP y arrancar Vite directamente:

```bash
cd src/Web/ClientApp
npx vite
```

### Ejecutar solo el backend

```bash
cd src/Web
dotnet run
```

---

## Usuarios de prueba

El seed crea los siguientes usuarios automáticamente al iniciar la aplicación por primera vez:

### Administrador

| Email | Contraseña |
|---|---|
| admin@localhost | Admin123! |

### Socios

| Email | Contraseña | Estado |
|---|---|---|
| lucia@ejemplo.com | Miembro1! | Activo |
| miguel@ejemplo.com | Miembro1! | Activo |
| sofia@ejemplo.com | Miembro1! | Suspendido |
| carlos@ejemplo.com | Miembro1! | Activo |
| ana@ejemplo.com | Miembro1! | Expirado |

---

## Flujo de la aplicación

### Socio

Un visitante puede explorar el catálogo de libros en la página de inicio sin necesidad de cuenta. Al encontrar un libro de interés, accede a su detalle para ver la información completa y las copias disponibles.

Para interactuar con el sistema — reservar un libro, ver préstamos o reservas — necesita registrarse en `/register` o iniciar sesión en `/login`.

Una vez autenticado:

- **Reservar un libro:** desde el detalle del libro, si hay copias disponibles, puede crear una reserva con un clic.
- **Mis reservas** (`/reservations`): consulta el estado de sus reservas activas e históricas, con filtro por estado.
- **Mis préstamos** (`/my-loans`): ve los libros que tiene prestados actualmente y su historial, con filtro por estado.

### Administrador

El administrador gestiona el ciclo completo de préstamos y el catálogo desde un panel dedicado.

**Gestión del catálogo:**

- Añade nuevos libros al sistema con toda su información (título, autor, ISBN, etc.).
- Registra copias físicas de un libro existente, indicando su condición.

**Gestión de préstamos:**

- Visualiza todos los préstamos del sistema con búsqueda por socio o libro y filtros por estado.
- Crea un préstamo asignando una copia disponible a un socio. Si el socio tiene una reserva activa para ese libro, puede vincularla al préstamo directamente.
- Registra la devolución de un libro desde el listado de préstamos.

**Gestión de reservas:**

- Consulta todas las reservas del sistema con búsqueda y filtros por estado.

---

## Tecnologías utilizadas

### Backend
| Tecnología | Uso |
|---|---|
| .NET 10 / ASP.NET Core | Framework principal de la API |
| Entity Framework Core | ORM para acceso a datos |
| SQL Server | Base de datos relacional |
| MediatR | Implementación del patrón CQRS |
| AutoMapper | Mapeo entre entidades y DTOs |
| FluentValidation | Validación de comandos y consultas |
| ASP.NET Core Identity | Autenticación y gestión de usuarios |
| Scalar | Documentación interactiva de la API |
| Ardalis.GuardClauses | Validaciones defensivas |

### Frontend
| Tecnología | Uso |
|---|---|
| React 19 + TypeScript | Interfaz de usuario |
| Vite | Herramienta de build |
| Tailwind CSS 4 | Estilos y diseño |
| React Router DOM 7 | Navegación entre páginas |
| NSwag | Cliente HTTP generado desde OpenAPI |

### Infraestructura y DevOps
| Tecnología | Uso |
|---|---|
| Azure Container Apps | Hosting de la aplicación |
| Azure Container Registry | Registro de imágenes Docker |
| Azure SQL Database | Base de datos en producción |
| Azure Application Insights | Monitoreo y diagnósticos |
| Azure Bicep | Infraestructura como código (IaC) |
| Azure Developer CLI (azd) | Provisión y despliegue |
| GitHub Actions | CI/CD automatizado |

---

## Arquitectura

El proyecto sigue los principios de **Clean Architecture** dividido en cuatro capas:

```
src/
├── Domain/          # Entidades, enums y lógica de negocio del dominio
├── Application/     # Casos de uso: comandos, consultas, validadores y DTOs (CQRS)
├── Infrastructure/  # EF Core, Identity, servicios externos y persistencia
└── Web/             # API REST (Minimal APIs), frontend React, OpenAPI
```

El patrón **CQRS** (Command Query Responsibility Segregation) se implementa mediante MediatR: cada operación de escritura es un `Command` y cada lectura es un `Query`, cada uno con su propio handler, validador y DTO.

---

## Pruebas

### Tests unitarios y de dominio

```bash
dotnet test tests/Application.UnitTests/
dotnet test tests/Domain.UnitTests/
```

### Tests de integración

Requieren una instancia de SQL Server disponible con la cadena de conexión configurada:

```bash
dotnet test tests/Infrastructure.IntegrationTests/
```

### Todos los tests (excepto aceptación)

```bash
dotnet test --filter "FullyQualifiedName!~AcceptanceTests"
```

---

## Documentación de la API

Con la aplicación en ejecución, acceder a:

- **Referencia interactiva (Scalar):** `https://localhost:5001/scalar/v1`
- **Especificación OpenAPI:** `https://localhost:5001/openapi/v1.json`

---

## Decisiones técnicas

### Clean Architecture
La estructura del proyecto está basada en el [template de Jason Taylor](https://github.com/jasontaylordev/CleanArchitecture), una referencia ampliamente adoptada para Clean Architecture en .NET. Se adoptó para mantener una separación clara de responsabilidades: el dominio no tiene dependencias externas, la capa de aplicación define los casos de uso sin acoplarse a infraestructura, y la capa web solo orquesta peticiones HTTP. Esto facilita el testing y la evolución independiente de cada capa.

### CQRS con MediatR
Cada operación de lectura (Query) y escritura (Command) está aislada en su propio handler. Esto permite que cada caso de uso tenga su propia validación, autorización y lógica sin afectar a los demás, y simplifica el testing unitario.

### Paginación y búsqueda en el servidor
Todos los listados (libros, préstamos, reservas) aplican paginación y filtros directamente en la base de datos mediante EF Core, evitando traer datos innecesarios al cliente.

### Generación automática del cliente HTTP
El cliente TypeScript del frontend se genera automáticamente desde la especificación OpenAPI con NSwag. Esto garantiza que el contrato entre backend y frontend siempre esté sincronizado y elimina la necesidad de escribir o mantener código de acceso a la API manualmente.

### Autorización basada en roles
La aplicación define dos roles: **Administrator** y **Member**. La autorización se aplica en dos niveles: en el endpoint HTTP (Minimal API) y en el comando/consulta de MediatR (atributo `[Authorize]`), siguiendo el principio de defensa en profundidad.

### Infraestructura como código con Bicep
El template de Jason Taylor está diseñado para desplegarse nativamente en Azure mediante Azure Developer CLI (azd). Dado que las instrucciones de la prueba mencionaban el uso de Docker, inicialmente adapté el despliegue para utilizar Railway, que permite ejecutar contenedores fácilmente. Sin embargo, mi período de prueba en Railway ya había finalizado, por lo que finalmente modifiqué el flujo de despliegue en azd para adapatarlo a contenedor.

### Seed de datos automático
Al arrancar en un entorno vacío, la aplicación crea automáticamente roles, un usuario administrador y datos de ejemplo (autores, libros, socios y préstamos) para facilitar el onboarding y las pruebas.

---

## Despliegue en Azure

### Prerrequisitos
- [Azure Developer CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd)
- Cuenta de Azure con suscripción activa

### Primer despliegue

```bash
azd auth login
azd env new <nombre-entorno>
azd env set SQL_ADMIN_PASSWORD "<contraseña-segura>"
azd up
```

Esto provisiona toda la infraestructura y despliega la aplicación en Azure Container Apps en un solo paso.

### CI/CD automático
El repositorio incluye un workflow de GitHub Actions (`.github/workflows/azure-dev.yml`) que ejecuta los tests y despliega automáticamente en cada push a `main`, usando credenciales federadas de Azure (sin secrets de larga duración).
