# @lobo.cyber.ec/ecuador-geo

**Base de datos geográfica estática, tipada y actualizada de Ecuador para NodeJS y el navegador.**

[![npm version](https://img.shields.io/npm/v/@lobo.cyber.ec/ecuador-geo.svg?style=flat-square)](https://www.npmjs.com/package/@lobo.cyber.ec/ecuador-geo)
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

## <img src="https://api.iconify.design/flat-color-icons:list.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Tabla de Contenidos

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

## <img src="https://api.iconify.design/flat-color-icons:flash-on.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Características

- **Rendimiento Extremo** -- No lee archivos del disco ni hace peticiones de red. Toda la data esta pre-minificada en modulos JS (`ESM` y `CJS`).
- **100% Actualizada** -- Incluye correcciones historicas que otros paquetes no tienen, indexada por los codigos oficiales del INEC.
- **Tipado Fuerte** -- Interfaces exactas exportadas en TypeScript para autocompletado en el Editor.
- **Universal** -- Funciona en backend (NodeJS, Bun, Deno) y en frontend (React, Vue, Angular, Svelte).
- **Procesamiento Espacial** -- Calculos matematicos de distancia e iteraciones radiales incorporadas nativamente bajo la _Formula de Haversine_.
- **Geocodificacion Inversa** -- Resolucion de puntos cardinales georreferenciales (GPS) a puntos limitrofes (Cantones) en mili-segundos.
- **Busqueda Difusa** -- Funciones integradas para autocompletado de texto con inmunidad a capitalizacion y tildes, con soporte para filtros por tipo y limite de resultados.
- **Busqueda por Nombre** -- Localiza provincias o cantones directamente por su nombre sin necesidad de conocer codigos INEC.
- **Zonas No Delimitadas** -- Acceso a los territorios en disputa (zona INEC 90) que otros paquetes ignoran.
- **Validadores INEC** -- Funciones booleanas rapidas para verificar la existencia real de codigos de provincias, cantones y parroquias.

---

## <img src="https://api.iconify.design/flat-color-icons:settings.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Requisitos del Sistema

| Requisito             | Detalles                                             |
| --------------------- | ---------------------------------------------------- |
| **Node.js**           | v14.x o superior                                     |
| **Entornos Frontend** | React, Vue, Angular, Svelte, Vanilla JS Webpack/Vite |
| **Entornos Alternos** | Deno, Bun, Cloudflare Workers                        |

---

## <img src="https://api.iconify.design/flat-color-icons:download.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Instalación

```bash
# npm
npm install @lobo.cyber.ec/ecuador-geo

# yarn
yarn add @lobo.cyber.ec/ecuador-geo

# pnpm
pnpm add @lobo.cyber.ec/ecuador-geo
```

---

## <img src="https://api.iconify.design/flat-color-icons:idea.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Uso Básico

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

## <img src="https://api.iconify.design/flat-color-icons:globe.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Funciones Geográficas Avanzadas

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

## <img src="https://api.iconify.design/flat-color-icons:multiple-devices.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Integración con Frameworks

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
    <select #provSelect (change)="onProvinciaChange(provSelect.value)">
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

## <img src="https://api.iconify.design/flat-color-icons:document.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Referencia de API

A continuación se detalla cada función principal exportada por el ecosistema.

| Metodo                                          | Retorno                         | Descripcion                                                                      |
| ----------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| `getProvincias()`                               | `Provincia[]`                   | Arreglo aligerado con los codigos INEC de las 24 provincias (y sus coordenadas). |
| `getProvincia(codigo)`                          | `Provincia \| undefined`        | Objeto que contiene el despliegue del arbol completo de la provincia.            |
| `getCantones(codigoProv)`                       | `Canton[]`                      | Array plano con los Cantones pertenecientes a la provincia dada.                 |
| `getParroquias(codigoProv, codigoCanton)`       | `Parroquia[]`                   | Array plano territorial listando las parroquias adjuntas al canton provisto.     |
| `getAllCantones()`                              | `Canton[]`                      | 221 elementos base expuestos linealmente.                                        |
| `getAllParroquias()`                            | `Parroquia[]`                   | +800 elementos base expuestos linealmente.                                       |
| `buscar(query, opciones?)`                      | `BuscarResultado[]`             | Busqueda textual difusa. Acepta `{ limite, tipo }` para filtrar resultados.      |
| `getUbicacionPorCodigo(codigo)`                 | `UbicacionDetalle \| undefined` | Resuelve estructura en cascada mapeando las pertenencias geograficas.            |
| `getProvinciaPorNombre(nombre)`                 | `Provincia \| undefined`        | Busca provincia por nombre exacto o parcial (insensible a acentos).              |
| `getCantonPorNombre(nombre)`                    | `Canton \| undefined`           | Busca canton por nombre exacto o parcial (insensible a acentos).                 |
| `getZonasNoDelimitadas()`                       | `Canton[]`                      | Retorna los 3 cantones de la Zona 90 (territorios en disputa).                   |
| `esCodigoProvinciaValido(codigo)`               | `boolean`                       | Valida si un codigo de 2 digitos corresponde a una provincia real.               |
| `esCodigoCantonValido(codigo)`                  | `boolean`                       | Valida si un codigo de 4 digitos corresponde a un canton real.                   |
| `esCodigoParroquiaValido(codigo)`               | `boolean`                       | Valida si un codigo de 6 digitos corresponde a una parroquia real.               |
| `getDistanciaEntreUbicaciones(origen, destino)` | `number \| null`                | Computa la distancia curvada [km]. Acepta `string` o `Coordenada`.               |
| `getCantonesCercanos(codigoCentro, radioKm)`    | `CantonCercano[]`               | Cantones adyacentes ordenados por distancia [km].                                |
| `getUbicacionPorCoordenadas(coordenadas)`       | `CantonCercano \| null`         | Geocodificacion inversa: de GPS a canton mas cercano.                            |

---

## <img src="https://api.iconify.design/flat-color-icons:info.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Estado del Proyecto

Este archivo se encuentra en **Release Estándar Mantenido**. La división política provista concuerda plenamente con las resoluciones unánimes del listado INEC contemporáneo, incluyendo las rectificaciones para zonas sin delimitación.

### Hoja de Ruta (Roadmap)

- ~~Normalizacion de codificacion INEC string-padding~~
- ~~Exportaciones Universales ESM/CJS Tipadas~~
- ~~Calculo nativo esferico (Haversine)~~
- ~~Busqueda por nombre y filtros avanzados~~
- ~~Zonas No Delimitadas y validadores INEC~~
- Empaquetamiento de Geometrias (Poligonos GeoJSON) para renderizado cartografico nativo con leaflet/maptiler.

---

## <img src="https://api.iconify.design/flat-color-icons:signature.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Licencia

Este paquete es distribuido bajo **Licencia MIT**. Es libre y gratuito para uso estrictamente personal o implementaciones en software de categoría comercial/privada. Las contribuciones analíticas al repositorio base se reciben a través de Pull Requests.

**_Mantenimiento Oficial por Lobo Cyber EC_**
