# @lobo.cyber.ec/ecuador-geo

**Base de datos geográfica estática, tipada y actualizada de Ecuador para NodeJS y el navegador.**

[![npm version](https://img.shields.io/npm/v/@lobo.cyber.ec/ecuador-geo.svg?style=flat-square)](https://www.npmjs.com/package/@lobo.cyber.ec/ecuador-geo)
[![License: MIT](https://img.shields.io/npm/v/@lobo.cyber.ec/ecuador-geo.svg?style=flat-square)](https://www.npmjs.com/package/@lobo.cyber.ec/ecuador-geo)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg?style=flat-square)](https://www.typescriptlang.org/)

<br />

<div align="center">
  <p>Si esta librería te ahorró horas de buscar la división política o limpiar JSONs viejos, considera invitarme un café:</p>
  <a href="https://buymeacoffee.com/lobo_cyber_ec" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 50px !important;width: 217px !important;" >
  </a>
</div>

<br />

Una librería moderna y _offline_ que expone la **división política (Provincias, Cantones y Parroquias)** completa del Ecuador. Diseñada para desarrolladores que necesitan llenar selects (dropdowns), validar formularios, calcular costos de envío en E-Commerce o integrar facturación electrónica (SRI) sin depender de APIs externas lentas.

---

## Tabla de Contenidos

- [Características](#características)
- [Requisitos del Sistema](#requisitos-del-sistema)
- [Instalación](#instalación)
- [Uso Básico](#uso-básico)
- [Funciones Geográficas Avanzadas](#funciones-geográficas-avanzadas)
- [Integración con Frameworks](#integración-con-frameworks)
- [Referencia de API](#referencia-de-api)
- [Estado del Proyecto](#estado-del-proyecto)
- [Licencia](#licencia)

---

## Características

- **Rendimiento Extremo** — No lee archivos del disco ni hace peticiones de red. Toda la data está pre-minificada en módulos JS (`ESM` y `CJS`).
- **100% Actualizada** — Incluye correcciones históricas que otros paquetes no tienen, indexada por los códigos oficiales del INEC.
- **Tipado Fuerte** — Interfaces exactas exportadas en TypeScript para autocompletado en el Editor.
- **Universal** — Funciona en backend (NodeJS, Bun, Deno) y en frontend (React, Vue, Angular, Svelte).
- **Procesamiento Espacial** — Cálculos matemáticos de distancia e iteraciones radiales incorporadas nativamente bajo la _Fórmula de Haversine_.
- **Geocodificación Inversa** — Resolución de puntos cardinales georreferenciales (GPS) a puntos limítrofes (Cantones) en mili-segundos.
- **Búsqueda Difusa** — Funciones integradas para autocompletado de texto con inmunidad a capitalización y tildes.

---

## Requisitos del Sistema

| Requisito             | Detalles                                             |
| --------------------- | ---------------------------------------------------- |
| **Node.js**           | v14.x o superior                                     |
| **Entornos Frontend** | React, Vue, Angular, Svelte, Vanilla JS Webpack/Vite |
| **Entornos Alternos** | Deno, Bun, Cloudflare Workers                        |

---

## Instalación

```bash
# npm
npm install @lobo.cyber.ec/ecuador-geo

# yarn
yarn add @lobo.cyber.ec/ecuador-geo

# pnpm
pnpm add @lobo.cyber.ec/ecuador-geo
```

---

## Uso Básico

### Obtener todas las Provincias

Recibe un arreglo optimizado con los códigos INEC de las 24 provincias y su nombre.

```typescript
import { getProvincias } from "@lobo.cyber.ec/ecuador-geo";

const provincias = getProvincias();
console.log(provincias);
/* Resultado:
[
  { codigo: "01", nombre: "Azuay" },
  { codigo: "02", nombre: "Bolivar" },
  ...
]
*/
```

### Obtener Cantones por Provincia

Para listas geográficas anidadas, provea el código INEC a 2 dígitos de la provincia.

```typescript
import { getCantones } from "@lobo.cyber.ec/ecuador-geo";

const cantonesGuayas = getCantones("09");
```

### Obtener Parroquias por Cantón

El nivel de resolución máximo granular en territorio ecuatoriano para geolocalización de envío y domicilio.

```typescript
import { getParroquias } from "@lobo.cyber.ec/ecuador-geo";

const parroquiasQuito = getParroquias("17", "1701");
```

### Buscar por Coincidencia (Búsqueda Difusa)

Permite buscar texto ignorando mayúsculas y acentos. Extrae arrays mixtos a nivel Provincia, Cantón o Parroquia.

```typescript
import { buscar } from "@lobo.cyber.ec/ecuador-geo";

const resultados = buscar("guayaq");
```

### Obtener Detalle de Ubicación por Código

Dado un código INEC territorial (longitud de 2, 4 o 6 caracteres numéricos en String), resuelve automáticamente la herencia territorial en formato O(1).

```typescript
import { getUbicacionPorCodigo } from "@lobo.cyber.ec/ecuador-geo";

const detalle = getUbicacionPorCodigo("170150");
console.log(detalle.provincia.nombre); // PICHINCHA
```

---

## Funciones Geográficas Avanzadas

Gracias a la inyección de las coordenadas centralizadas (Latitud y Longitud) reales de las Provincias y Cantones, el ecosistema provee herramientas matemáticas espaciales eximiendo la necesidad de instalar dependencias pesadas como `geolib`.

### Distancia en línea recta (Fórmula de Haversine)

Calcula la distancia precisa en **kilómetros** entre dos ubicaciones utilizando geometría esférica terrestre. Soporta códigos INEC o coordenadas GPS literales.

```typescript
import { getDistanciaEntreUbicaciones } from "@lobo.cyber.ec/ecuador-geo";

// Distancia entre Quito (1701) y Guayaquil (0901)
const distancia = getDistanciaEntreUbicaciones("1701", "0901");
console.log(`Distancia: ${distancia} km`);

// Computando con GPS directo en tiempo real
const desdeGPS = getDistanciaEntreUbicaciones(
  { lat: -0.18, lng: -78.46 },
  "0901",
);
```

### Lugares Cercanos (Resolución Radial)

Obtiene los cantones disponibles contenidos dentro de un radio paramétrico en kilómetros a partir de un cantón central. El retorno es automáticamente clasificado ascendentemente.

```typescript
import { getCantonesCercanos } from "@lobo.cyber.ec/ecuador-geo";

// Analiza los polígonos aledaños en 30KM a la redonda de Quito
const cantonesAledanos = getCantonesCercanos("1701", 30);
console.log(cantonesAledanos[0].distanciaKm);
```

### Geocodificación Inversa Topológica

Resuelve interseciones entre coordenadas enviadas por GPS para deducir de forma autónoma a qué Cantón Ecuatoriano concierne el área circundante del usuario. Optimiza agresivamente los flujos de Onboarding de clientes.

```typescript
import { getUbicacionPorCoordenadas } from "@lobo.cyber.ec/ecuador-geo";

const localizacionTelefono = { lat: -2.90055, lng: -79.00453 };
const resultadoInferencia = getUbicacionPorCoordenadas(localizacionTelefono);

console.log(resultadoInferencia.nombre); // "CUENCA"
```

---

## Integración con Frameworks

El paquete es completamente autónomo y agnóstico a tecnología, por lo cual la adopción Frontend es inmediata.

### React / Next.js

```tsx
import { useState } from "react";
import { getProvincias, getCantones } from "@lobo.cyber.ec/ecuador-geo";

export default function SelectorEcuador() {
  const [provinciaId, setProvinciaId] = useState("");

  const provincias = getProvincias();
  const cantones = provinciaId ? getCantones(provinciaId) : [];

  return (
    <div className="flex gap-4">
      <select onChange={(e) => setProvinciaId(e.target.value)}>
        <option value="">Selecciona Provincia</option>
        {provincias.map((p) => (
          <option key={p.codigo} value={p.codigo}>
            {p.nombre}
          </option>
        ))}
      </select>

      <select disabled={!provinciaId}>
        <option value="">Selecciona Cantón</option>
        {cantones.map((c) => (
          <option key={c.codigo} value={c.codigo}>
            {c.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Vue 3 (Composition API) / Nuxt

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { getProvincias, getCantones } from "@lobo.cyber.ec/ecuador-geo";

const provinciaSeleccionada = ref("");
const provincias = computed(() => getProvincias());
const cantones = computed(() =>
  provinciaSeleccionada.value ? getCantones(provinciaSeleccionada.value) : [],
);
</script>

<template>
  <select v-model="provinciaSeleccionada">
    <option disabled value="">Provincia...</option>
    <option v-for="prov in provincias" :key="prov.codigo" :value="prov.codigo">
      {{ prov.nombre }}
    </option>
  </select>

  <select :disabled="!provinciaSeleccionada">
    <option disabled value="">Cantón...</option>
    <option v-for="cant in cantones" :key="cant.codigo" :value="cant.codigo">
      {{ cant.nombre }}
    </option>
  </select>
</template>
```

### Angular

```typescript
import { Component } from "@angular/core";
import { getProvincias, getCantones } from "@lobo.cyber.ec/ecuador-geo";

@Component({
  selector: "app-ubicacion",
  template: `
    <select (change)="onProvinciaChange($event.target.value)">
      <option *ngFor="let p of provincias" [value]="p.codigo">
        {{ p.nombre }}
      </option>
    </select>

    <select>
      <option *ngFor="let c of cantones" [value]="c.codigo">
        {{ c.nombre }}
      </option>
    </select>
  `,
})
export class UbicacionComponent {
  provincias = getProvincias();
  cantones: any[] = [];

  onProvinciaChange(codigoProvincia: string) {
    this.cantones = getCantones(codigoProvincia);
  }
}
```

### Entornos Backend (NodeJS, Bun, Deno)

Módulo ideal como base de datos local pre-cacheada rapidísima para validación de Payloads.

```typescript
import { getUbicacionPorCodigo } from "@lobo.cyber.ec/ecuador-geo";

function validarRegistroUsuario(body) {
  const ubicacion = getUbicacionPorCodigo(body.codigoInec);

  if (!ubicacion) throw new Error("Entidad INEC no encontrada.");

  return { status: "Success", location: ubicacion };
}
```

---

## Referencia de API

A continuación se detalla cada función principal exportada por el ecosistema.

| Método                                          | Retorno                         | Descripción                                                                                  |
| ----------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| `getProvincias()`                               | `Provincia[]`                   | Arreglo aligerado con los códigos INEC de las 24 provincias (y sus coordenadas).             |
| `getProvincia(codigo)`                          | `Provincia \| undefined`        | Objeto pesado que contiene el despliegue del árbol completo de la provincia.                 |
| `getCantones(codigoProv)`                       | `Canton[]`                      | Array plano con los Cantones pertenecientes a la provincia dada.                             |
| `getParroquias(codigoProv, codigoCanton)`       | `Parroquia[]`                   | Array plano territorial listando las parroquias adjuntas al cantón provisto.                 |
| `buscar(query)`                                 | `BuscarResultado[]`             | Resuelve búsqueda textual ignorando signos de puntuación de cualquier entidad registral.     |
| `getUbicacionPorCodigo(codigo)`                 | `UbicacionDetalle \| undefined` | Resuelve estructura en cascada mapeando de inferior a superior las pertenencias geográficas. |
| `getAllCantones()`                              | `Canton[]`                      | 221 elementos base expuestos linealmente.                                                    |
| `getAllParroquias()`                            | `Parroquia[]`                   | +800 elementos base expuestos linealmente.                                                   |
| `getDistanciaEntreUbicaciones(origen, destino)` | `number \| null`                | Computa la distancia curvada paramétrica `[km]`. Acepta `string` (INEC Code) o `Coordenada`. |
| `getCantonesCercanos(codigoCentro, radioKm)`    | `CantonCercano[]`               | Expone cantones adyacentes ordenados por el delta de distancia `[km]`.                       |
| `getUbicacionPorCoordenadas(Coordenadas)`       | `CantonCercano \| null`         | Resuelve inferencia de punto inverso para determinar el polígono territorial.                |

---

## Estado del Proyecto

Este archivo se encuentra en **Release Estándar Mantenido**. La división política provista concuerda plenamente con las resoluciones unánimes del listado INEC contemporáneo, incluyendo las rectificaciones para zonas sin delimitación.

### Hoja de Ruta (Roadmap)

- ~~Normalización de codificación INEC string-padding~~
- ~~Exportaciones Universales ESM/CJS Tipadas~~
- ~~Cálculo nativo esférico (Haversine)~~
- Empaquetamiento de Geometrías (Polígonos GeoJSON) para renderizado cartográfico nativo con leaflet/maptiler.

---

## Licencia

Este paquete es distribuido bajo **Licencia MIT**. Es libre y gratuito para uso estrictamente personal o implementaciones en software de categoría comercial/privada. Las contribuciones analíticas al repositorio base se reciben a través de Pull Requests.

**_Mantenimiento Oficial por Lobo Cyber EC_**
