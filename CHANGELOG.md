# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato esta basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
