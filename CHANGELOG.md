# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato esta basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Sin publicar]

### Corregido

- **Coordenadas de provincias**: Zamora Chinchipe apuntaba a Zamora (España), Galápagos estaba en el continente y Orellana a 157 km de su capital. Ahora cada provincia usa las coordenadas de su capital.
- **Coordenadas de cantones**: se verificaron los 221 cantones contra la cabecera cantonal en [GeoNames](https://www.geonames.org/) (CC BY 4.0). Se corrigieron 98 cantones:
  - Se agregaron las coordenadas que faltaban en `0919` Salitre, `1905` Yantzaza y `2201` Orellana (El Coca).
  - 23 cantones estaban a más de 50 km de su cabecera, entre ellos `0402` Bolívar (Carchi, 314 km, tenía las coordenadas de Bolívar de Manabí), `1318` Olmedo (Manabí, 310 km, tenía las de Olmedo de Loja), `1405` Santiago, `0927` General Antonio Elizalde, `0905` Colimes, `2202` Aguarico y `0802` Eloy Alfaro.
  - 72 cantones tenían desviaciones de entre 10 y 50 km.
- **Validación de códigos**: `getProvincia("9abc")`, `getProvincia("09.5")` o `getProvincia(" 9")` ya no devuelven Guayas. Los códigos deben contener solo dígitos.
- **`esCodigoProvinciaValido()`**: ahora exige exactamente 2 dígitos y devuelve `false` para la Zona 90 (que no es una provincia).
- **`getCantonesCercanos()`**: con un código de parroquia ya no incluye a su propio cantón a 0 km. Devuelve `[]` si el radio es negativo o no es un número.
- **Entradas inválidas**: `getDistanciaEntreUbicaciones()`, `getUbicacionPorCoordenadas()` y `buscar()` devuelven `null`/`[]` en lugar de lanzar excepciones ante `null`, `NaN` o tipos incorrectos.

### Agregado

- **`getCantonPorNombre(nombre, codigoProvincia?)`**: nuevo parámetro opcional para desambiguar cantones con el mismo nombre (ej: Bolívar existe en Carchi, Guayas y Manabí).
- **Tests de calidad de datos**: coordenadas dentro de Ecuador, provincias ubicadas en su capital, códigos sin duplicados, validación de entradas e inmunidad del cache a mutaciones (38 tests en total).
- **CI**: chequeo de tipos (`npm run typecheck`) antes del build.

### Mejorado

- **Rendimiento**: cache interno de provincias e índice de búsqueda pre-normalizado. `buscar()` es hasta 33 veces más rápido y `getAllParroquias()` 13 veces más rápido. Los resultados siguen siendo copias independientes, así que modificarlos no altera el cache.
- **Tamaño del paquete**: se eliminaron los sourcemaps del paquete publicado (434 kB → 142 kB instalado).
- **`package.json`**: tipos separados para ESM (`.d.mts`) y CJS (`.d.ts`) en `exports`, `sideEffects: false` y `engines`.
- **Dependencias de desarrollo**: `vitest` 4.1.11, lo que corrige 7 vulnerabilidades (1 crítica). Queda una de severidad baja en `esbuild` (servidor de desarrollo en Windows) que `tsup` todavía no permite actualizar; no afecta al paquete publicado.

### Migración

Sin cambios en la API. Solo cambian los casos que antes eran incorrectos: códigos con caracteres no numéricos, `esCodigoProvinciaValido("9")` (usa `"09"`) y `esCodigoProvinciaValido("90")`.

---

## [1.0.2] - 2026-03-20

### Modificado

- Documentación y palabras clave del paquete.

---

## [1.0.1] - 2026-03-14

### Agregado

- **`getProvinciaPorNombre(nombre)`**: Busca una provincia por nombre exacto o parcial, insensible a mayusculas y acentos.
- **`getCantonPorNombre(nombre)`**: Busca un canton por nombre exacto o parcial.
- **`getZonasNoDelimitadas()`**: Acceso a los 3 cantones de la Zona 90 (Las Golondrinas, Manga del Cura, El Piedrero).
- **`esCodigoProvinciaValido(codigo)`**: Validador booleano para codigos de provincia.
- **`esCodigoCantonValido(codigo)`**: Validador booleano para codigos de canton.
- **`esCodigoParroquiaValido(codigo)`**: Validador booleano para codigos de parroquia.
- **`BuscarOpciones`**: Nueva interfaz para filtrar resultados de `buscar()`.

### Modificado

- **`buscar(query, opciones?)`**: Ahora acepta un segundo parametro opcional con `{ limite, tipo }` para filtrar resultados por tipo de entidad y limitar la cantidad de resultados retornados.

---

## [1.0.0] - 2026-03-08

### Agregado

- **Datos base completos**: 24 provincias, 221 cantones y +800 parroquias con codigos INEC oficiales.
- **Coordenadas geograficas**: Latitud y longitud para todas las provincias y cantones.
- **Funciones de consulta**: `getProvincias()`, `getProvincia()`, `getCantones()`, `getParroquias()`, `getAllCantones()`, `getAllParroquias()`.
- **Busqueda difusa**: Funcion `buscar()` con normalizacion de acentos y mayusculas.
- **Jerarquia por codigo**: `getUbicacionPorCodigo()` resuelve automaticamente provincia, canton o parroquia segun la longitud del codigo INEC.
- **Distancia Haversine**: `getDistanciaEntreUbicaciones()` calcula la distancia esferica en kilometros entre dos puntos (codigos INEC o coordenadas GPS).
- **Busqueda radial**: `getCantonesCercanos()` encuentra cantones dentro de un radio en kilometros.
- **Geocodificacion inversa**: `getUbicacionPorCoordenadas()` determina el canton mas cercano a un punto GPS.
- **Tipado completo en TypeScript**: Interfaces exportadas para `Provincia`, `Canton`, `Parroquia`, `Coordenada`, `CantonCercano`, `UbicacionDetalle`, `BuscarResultado`.
- **Empaquetado dual**: Salida ESM (`.mjs`) y CommonJS (`.js`) con declaraciones de tipos (`.d.ts`).
- **Suite de pruebas**: 12 tests unitarios con Vitest cubriendo funciones base y geoespaciales.
- **Cero dependencias**: El paquete no requiere ninguna dependencia de terceros en produccion.
