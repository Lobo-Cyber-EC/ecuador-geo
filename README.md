# @lobo.cyber.ec/ecuador-geo

**Base de datos geográfica estática, tipada y actualizada de Ecuador para NodeJS y el navegador.**

[![npm version](https://img.shields.io/npm/v/@lobo.cyber.ec/ecuador-geo.svg?style=flat-square)](https://www.npmjs.com/package/@lobo.cyber.ec/ecuador-geo)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Dependencias](https://img.shields.io/badge/dependencias-0-brightgreen.svg?style=flat-square)](https://www.npmjs.com/package/@lobo.cyber.ec/ecuador-geo?activeTab=dependencies)
[![Demo](https://img.shields.io/badge/demo-en%20vivo-0b2a4a.svg?style=flat-square)](https://lce-tech.com/proyectos/ecuador-geo)

> **[Prueba la demo interactiva](https://lce-tech.com/proyectos/ecuador-geo)**: autocompletado, validación de cédula/RUC y selects encadenados funcionando en el navegador. Desarrollado por [Lobo Cyber EC](https://lce-tech.com).

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
- [Formularios y Dropdowns](#formularios-y-dropdowns)
- [Cédula y RUC](#cédula-y-ruc)
- [Región y Zona Horaria](#región-y-zona-horaria)
- [Funciones Geográficas Avanzadas](#funciones-geográficas-avanzadas)
- [Integración con Frameworks](#integración-con-frameworks)
- [Referencia de API](#referencia-de-api)
- [Estado del Proyecto](#estado-del-proyecto)
- [Fuentes de Datos](#fuentes-de-datos)
- [Licencia](#licencia)

---

## <img src="https://api.iconify.design/flat-color-icons:flash-on.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Características

- **Rendimiento Extremo** -- No lee archivos del disco ni hace peticiones de red. Toda la data esta pre-minificada en modulos JS (`ESM` y `CJS`).
- **100% Actualizada** -- Incluye correcciones historicas que otros paquetes no tienen, indexada por los codigos oficiales del INEC.
- **Tipado Fuerte** -- Interfaces exactas exportadas en TypeScript para autocompletado en el Editor.
- **Universal** -- Funciona en backend (NodeJS, Bun, Deno) y en frontend (React, Vue, Angular, Svelte).
- **Procesamiento Espacial** -- Calculos matematicos de distancia e iteraciones radiales incorporadas nativamente bajo la _Formula de Haversine_.
- **Geocodificacion Inversa** -- Resolucion de puntos cardinales georreferenciales (GPS) a puntos limitrofes (Cantones) en mili-segundos.
- **Autocompletado Inteligente** -- Busqueda insensible a tildes y mayusculas, ordenada por relevancia y tolerante a errores de escritura ("guayakil" encuentra Guayaquil).
- **Cedula y RUC** -- Validacion de cedulas y RUC (persona natural, sociedad privada y entidad publica) y provincia de emision.
- **Listo para Formularios** -- Opciones `{ value, label }` para dropdowns con nombres oficiales con tildes, y texto de ubicacion legible para facturas y envios.
- **Region y Zona Horaria** -- Costa, Sierra, Amazonia o Insular, y zona horaria IANA (Galapagos va una hora por detras).
- **Busqueda por Nombre** -- Localiza provincias o cantones directamente por su nombre sin necesidad de conocer codigos INEC.
- **Zonas No Delimitadas** -- Acceso a los territorios en disputa (zona INEC 90) que otros paquetes ignoran.
- **Validadores INEC** -- Funciones booleanas rapidas para verificar la existencia real de codigos de provincias, cantones y parroquias.
- **Coordenadas Verificadas** -- Las coordenadas de las 24 provincias y los 221 cantones (cabecera cantonal) estan contrastadas con GeoNames y cubiertas por tests de calidad de datos.

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
  { codigo: "01", nombre: "AZUAY", lat: -2.90055, lng: -79.00453 },
  { codigo: "02", nombre: "BOLIVAR", lat: -1.59263, lng: -79.00098 },
  ...
]
*/
```

### Obtener Cantones por Provincia

Para listas geográficas anidadas, provea el código INEC a 2 dígitos de la provincia.

```typescript
import { getCantones } from "@lobo.cyber.ec/ecuador-geo";

const cantonesGuayas = getCantones("09");
console.log(cantonesGuayas.slice(0, 3));
/* Resultado:
[
  { codigo: "0901", nombre: "GUAYAQUIL", lat: -2.19616, lng: -79.88621 },
  { codigo: "0902", nombre: "ALFREDO BAQUERIZO MORENO (JUJÁN)", lat: -1.91667, lng: -79.51667 },
  { codigo: "0903", nombre: "BALAO", lat: -2.9106, lng: -79.81505 }
]
*/
```

### Obtener Parroquias por Cantón

El nivel de resolución máximo granular en territorio ecuatoriano para geolocalización de envío y domicilio.

```typescript
import { getParroquias } from "@lobo.cyber.ec/ecuador-geo";

const parroquiasQuito = getParroquias("17", "1701");
console.log(parroquiasQuito.slice(0, 4));
/* Resultado:
[
  { codigo: "170101", nombre: "BELISARIO QUEVEDO" },
  { codigo: "170102", nombre: "CARCELÉN" },
  { codigo: "170103", nombre: "CENTRO HISTÓRICO" },
  { codigo: "170104", nombre: "COCHAPAMBA" }
]
*/
```

### Buscar por Coincidencia

Busca texto ignorando mayúsculas y acentos. Retorna provincias, cantones y parroquias en orden de código INEC.

```typescript
import { buscar } from "@lobo.cyber.ec/ecuador-geo";

const resultados = buscar("guayaq");
console.log(resultados.slice(0, 3));
/* Resultado:
[
  { codigo: "0901", nombre: "GUAYAQUIL", tipo: "Cantón", lat: -2.19616, lng: -79.88621 },
  { codigo: "090150", nombre: "GUAYAQUIL", tipo: "Parroquia" },
  { codigo: "100102", nombre: "GUAYAQUIL DE ALPACHACA", tipo: "Parroquia" }
]
*/
```

### Autocompletado Tolerante a Errores

Ideal para inputs de búsqueda: ordena por relevancia (primero coincidencias exactas, luego las que empiezan con el texto) y tolera errores de escritura en palabras de 5 letras o más.

```typescript
import { autocompletar } from "@lobo.cyber.ec/ecuador-geo";

autocompletar("cuenka", { limite: 2 });
/* Resultado:
[
  { codigo: "0101", nombre: "CUENCA", tipo: "Cantón", lat: -2.90055, lng: -79.00453 },
  { codigo: "010150", nombre: "CUENCA", tipo: "Parroquia" }
]
*/

// Filtrar por tipo y provincia (ej: input dependiente de un select de provincia)
autocompletar("san", { tipo: "Cantón", codigoProvincia: "09" });
```

### Obtener Detalle de Ubicación por Código

Dado un código INEC territorial (2, 4 o 6 dígitos), resuelve automáticamente la jerarquía territorial.

```typescript
import { getUbicacionPorCodigo, formatearUbicacion } from "@lobo.cyber.ec/ecuador-geo";

const detalle = getUbicacionPorCodigo("170150");
console.log(detalle);
/* Resultado:
{
  codigo: "170150",
  nombre: "QUITO DISTRITO METROPOLITANO",
  tipo: "Parroquia",
  provincia: { codigo: "17", nombre: "PICHINCHA", lat: -0.22985, lng: -78.52495 },
  canton: { codigo: "1701", nombre: "QUITO", lat: -0.18065, lng: -78.46784 }
}
*/

// Texto legible para facturas, guías de envío o direcciones
formatearUbicacion("090112"); // "Tarqui, Guayaquil, Guayas"
```

---

## <img src="https://api.iconify.design/flat-color-icons:list.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Formularios y Dropdowns

Opciones `{ value, label }` listas para cualquier `<select>`, ordenadas alfabéticamente y con nombres en formato título (las provincias usan su nombre oficial con tildes).

```typescript
import {
  getOpcionesProvincias,
  getOpcionesCantones,
  getOpcionesParroquias,
  formatearNombre,
} from "@lobo.cyber.ec/ecuador-geo";

getOpcionesProvincias().slice(0, 2);
// [{ value: "01", label: "Azuay" }, { value: "02", label: "Bolívar" }]

getOpcionesProvincias({ region: "Insular" });
// [{ value: "20", label: "Galápagos" }]

getOpcionesCantones("09").slice(0, 2);
// [{ value: "0902", label: "Alfredo Baquerizo Moreno (Juján)" }, { value: "0903", label: "Balao" }]

getOpcionesParroquias("09", "0901").slice(0, 2);
// [{ value: "090101", label: "Ayacucho" }, { value: "090102", label: "Bolívar (Sagrario)" }]

// Mantener el orden por código INEC
getOpcionesCantones("09", { ordenarPor: "codigo" });

formatearNombre("SAN JACINTO DE YAGUACHI"); // "San Jacinto de Yaguachi"
```

---

## <img src="https://api.iconify.design/flat-color-icons:businessman.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Cédula y RUC

Valida cédulas (10 dígitos) y RUC (13 dígitos) de persona natural, sociedad privada y entidad pública, y obtiene la provincia de emisión.

```typescript
import {
  validarCedula,
  validarRUC,
  analizarRUC,
  getProvinciaPorCedula,
} from "@lobo.cyber.ec/ecuador-geo";

validarCedula("1710034065"); // true
validarRUC("1790011674001"); // true

analizarRUC("1790011674001");
// { valido: true, tipo: "sociedad privada", codigoProvincia: "17", establecimiento: "001" }

getProvinciaPorCedula("1710034065");
// { codigo: "17", nombre: "PICHINCHA", lat: -0.22985, lng: -78.52495 }
```

> **Importante:** se valida el formato y el dígito verificador (módulo 10 para cédulas y personas naturales, módulo 11 para sociedades y entidades públicas). No se consulta al Registro Civil ni al SRI si el número existe o está activo. Algunos RUC de extranjeros pueden no seguir el algoritmo estándar. El código de provincia `30` corresponde a ecuatorianos registrados en el exterior.

---

## <img src="https://api.iconify.design/flat-color-icons:clock.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Región y Zona Horaria

```typescript
import { getRegion, getZonaHoraria, getProvinciasPorRegion } from "@lobo.cyber.ec/ecuador-geo";

getRegion("0901"); // "Costa"
getRegion("220150"); // "Amazonía"

getZonaHoraria("17"); // "America/Guayaquil" (UTC-5)
getZonaHoraria("2001"); // "Pacific/Galapagos" (UTC-6)

getProvinciasPorRegion("Insular"); // [{ codigo: "20", nombre: "GALAPAGOS", ... }]

// Hora local de una ubicación
new Date().toLocaleString("es-EC", { timeZone: getZonaHoraria("2001") });
```

Acepta códigos de provincia, cantón o parroquia. Las Zonas No Delimitadas (código 90) no tienen región ni zona horaria asignada.

---

## <img src="https://api.iconify.design/flat-color-icons:globe.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Funciones Geográficas Avanzadas

Gracias a las coordenadas de la cabecera de cada cantón y de la capital de cada provincia, el paquete provee herramientas espaciales sin necesidad de instalar dependencias pesadas como `geolib`.

### Distancia en línea recta (Fórmula de Haversine)

Calcula la distancia en **kilómetros** entre dos ubicaciones utilizando geometría esférica terrestre. Soporta códigos INEC o coordenadas GPS literales.

```typescript
import { getDistanciaEntreUbicaciones } from "@lobo.cyber.ec/ecuador-geo";

// Distancia entre Quito (1701) y Guayaquil (0901)
const distancia = getDistanciaEntreUbicaciones("1701", "0901");
console.log(`Distancia: ${distancia} km`);
// Distancia: 274.02 km

// Desde coordenadas GPS
const desdeGPS = getDistanciaEntreUbicaciones({ lat: -0.18, lng: -78.46 }, "0901");
console.log(desdeGPS);
// 274.58
```

### Lugares Cercanos (Resolución Radial)

Obtiene los cantones dentro de un radio en kilómetros a partir de un cantón central (o del cantón de una parroquia), ordenados de menor a mayor distancia.

```typescript
import { getCantonesCercanos } from "@lobo.cyber.ec/ecuador-geo";

const cantonesAledanos = getCantonesCercanos("1701", 40);
console.log(cantonesAledanos);
/* Resultado:
[
  { codigo: "1705", nombre: "RUMIÑAHUI", lat: -0.33405, lng: -78.45217, distanciaKm: 17.15 },
  { codigo: "1704", nombre: "PEDRO MONCAYO", lat: 0.03333, lng: -78.26667, distanciaKm: 32.66 },
  { codigo: "1703", nombre: "MEJIA", lat: -0.51667, lng: -78.56667, distanciaKm: 38.95 }
]
*/
```

### Geocodificación Inversa

Dado un punto GPS, retorna el cantón cuya cabecera está más cerca. Útil para preseleccionar la ubicación del usuario en un formulario.

```typescript
import { getUbicacionPorCoordenadas } from "@lobo.cyber.ec/ecuador-geo";

const resultado = getUbicacionPorCoordenadas({ lat: -2.90055, lng: -79.00453 });
console.log(resultado);
/* Resultado:
{ codigo: "0101", nombre: "CUENCA", lat: -2.90055, lng: -79.00453, distanciaKm: 0 }
*/
```

> Se basa en la cabecera cantonal más cercana, no en los límites del cantón: cerca de un límite puede devolver el cantón vecino.

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

| Metodo                                          | Retorno                                              | Descripcion                                                                      |
| ----------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------- |
| `getProvincias()`                               | `Pick<Provincia, "codigo" \| "nombre" \| "lat" \| "lng">[]` | Arreglo aligerado con los codigos INEC de las 24 provincias (y sus coordenadas). |
| `getProvincia(codigo)`                          | `Provincia \| undefined`        | Objeto que contiene el despliegue del arbol completo de la provincia.            |
| `getCantones(codigoProv)`                       | `Pick<Canton, "codigo" \| "nombre" \| "lat" \| "lng">[]` | Array plano con los Cantones pertenecientes a la provincia dada.                 |
| `getParroquias(codigoProv, codigoCanton)`       | `Pick<Parroquia, "codigo" \| "nombre">[]`                  | Array plano territorial listando las parroquias adjuntas al canton provisto.     |
| `getAllCantones()`                              | `Pick<Canton, "codigo" \| "nombre" \| "lat" \| "lng">[]` | 221 elementos base expuestos linealmente.                                        |
| `getAllParroquias()`                            | `Pick<Parroquia, "codigo" \| "nombre">[]`                  | 1.396 elementos base expuestos linealmente.                                      |
| `buscar(query, opciones?)`                      | `BuscarResultado[]`             | Busqueda por subcadena en orden de codigo. Acepta `{ limite, tipo }`.             |
| `autocompletar(query, opciones?)`               | `BuscarResultado[]`             | Ordenada por relevancia y tolerante a errores. Acepta `{ limite, tipo, codigoProvincia }` (limite por defecto: 10). |
| `getOpcionesProvincias(config?)`                | `OpcionSelect[]`                | Opciones `{ value, label }`. Acepta `{ region, ordenarPor }`.                    |
| `getOpcionesCantones(codigoProv, config?)`      | `OpcionSelect[]`                | Opciones de los cantones de una provincia. Acepta `{ ordenarPor }`.              |
| `getOpcionesParroquias(codigoProv, codigoCanton, config?)` | `OpcionSelect[]`     | Opciones de las parroquias de un canton. Acepta `{ ordenarPor }`.                |
| `formatearUbicacion(codigo, separador?)`        | `string \| undefined`           | Texto legible: `"Tarqui, Guayaquil, Guayas"`.                                    |
| `formatearNombre(nombre)`                       | `string`                        | Convierte un nombre INEC a formato titulo en español.                            |
| `validarCedula(cedula)`                         | `boolean`                       | Valida una cedula de 10 digitos (provincia, tercer digito y modulo 10).          |
| `validarRUC(ruc)`                               | `boolean`                       | Valida un RUC de 13 digitos de cualquier tipo.                                   |
| `analizarRUC(ruc)`                              | `RUCDetalle`                    | `{ valido, tipo, codigoProvincia, establecimiento }`.                            |
| `getProvinciaPorCedula(identificacion)`         | `Pick<Provincia, ...> \| undefined` | Provincia de emision de una cedula o RUC.                                     |
| `getRegion(codigo)`                             | `Region \| undefined`           | `"Costa"`, `"Sierra"`, `"Amazonía"` o `"Insular"`.                              |
| `getZonaHoraria(codigo)`                        | `ZonaHoraria \| undefined`      | `"America/Guayaquil"` o `"Pacific/Galapagos"`.                                   |
| `getProvinciasPorRegion(region)`                | `Pick<Provincia, ...>[]`        | Provincias de una region natural.                                                |
| `getUbicacionPorCodigo(codigo)`                 | `UbicacionDetalle \| undefined` | Resuelve estructura en cascada mapeando las pertenencias geograficas.            |
| `getProvinciaPorNombre(nombre)`                 | `Pick<Provincia, "codigo" \| "nombre" \| "lat" \| "lng"> \| undefined` | Busca provincia por nombre exacto o parcial (insensible a acentos).              |
| `getCantonPorNombre(nombre, codigoProv?)`       | `Pick<Canton, "codigo" \| "nombre" \| "lat" \| "lng"> \| undefined` | Busca canton por nombre exacto o parcial (insensible a acentos). Usa `codigoProv` para desambiguar nombres repetidos (ej: `getCantonPorNombre("Bolívar", "13")`). |
| `getZonasNoDelimitadas()`                       | `Pick<Canton, "codigo" \| "nombre" \| "lat" \| "lng">[]` | Retorna los 3 cantones de la Zona 90 (territorios en disputa).                   |
| `esCodigoProvinciaValido(codigo)`               | `boolean`                       | Valida si un codigo de exactamente 2 digitos corresponde a una provincia real (la Zona 90 no es provincia). |
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
- ~~Coordenadas verificadas, cache interno e indice de busqueda~~
- ~~Validacion de cedula y RUC, opciones para dropdowns, autocompletado tolerante, region y zona horaria~~
- Empaquetamiento de Geometrias (Poligonos GeoJSON) para renderizado cartografico nativo con leaflet/maptiler.

---

## Fuentes de Datos

- **Division politica y codigos**: clasificador geografico del INEC.
- **Coordenadas**: corresponden a la cabecera cantonal de cada canton (y a la capital en el caso de las provincias). Fueron verificadas contra [GeoNames](https://www.geonames.org/) (licencia [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)); la de Pablo Sexto proviene de Wikipedia.
- **Limitacion conocida**: La Concordia se mantiene con el codigo `0808` (Esmeraldas), como en el clasificador original, aunque hoy pertenece administrativamente a Santo Domingo de los Tsachilas.

---

## <img src="https://api.iconify.design/flat-color-icons:signature.svg" width="28" height="28" style="vertical-align: middle; margin-right: 8px;" /> Licencia

Este paquete es distribuido bajo **Licencia MIT**. Es libre y gratuito para uso estrictamente personal o implementaciones en software de categoría comercial/privada. Las contribuciones analíticas al repositorio base se reciben a través de Pull Requests.

**_Mantenimiento Oficial por [Lobo Cyber EC](https://lce-tech.com)_** · [Demo](https://lce-tech.com/proyectos/ecuador-geo) · [Reportar un problema](https://github.com/Lobo-Cyber-EC/ecuador-geo/issues)
