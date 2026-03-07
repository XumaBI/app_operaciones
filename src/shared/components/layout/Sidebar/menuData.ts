export type Informe = {
  name: string;
  path: string;
  type: "informe" | "componente";
};

export type Grupo = {
  name: string;
  iconPath: string;
  path: string;
  type?: "informe" | "componente"; // opcional: solo algunos grupos la usan
  informes: Informe[];
};

export type Seccion = {
  name: string;
  iconPath: string;
  path: string;
  grupos: Grupo[];
};

export const MENU_DATA: Seccion[] = [
  // 🔹 SECCIÓN INFORMES
  {
    name: "Inf. de Operación",
    iconPath: "M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z",
    path: "/Operaciones",
    grupos: [
      {
        name: "Ejecución Global",
        iconPath: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z",
        path: "ejecucion-global",
        informes: [
          { name: "Ejecución Promigas", path: "ejecucion-promigas", type: "informe" },
          { name: "Ejecución Vanti", path: "ejecucion-vanti", type: "informe" },
          { name: "Ejecución Parcial", path: "ejecucion-parcial", type: "informe" },
          { name: "Ejecución Controladas", path: "controladas", type: "informe" },
          { name: "Ejecución Relacionadas", path: "relacionadas", type: "informe" },
        ],
      },
      {
        name: "Ejecución Distribuidora",
        iconPath: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z",
        path: "ejecucion-distribuidora",
        informes: [
          { name: "Caribe", path: "caribe", type: "informe" },
          { name: "Guajira", path: "guajira", type: "informe" },
          { name: "Efigas", path: "efigas", type: "informe" },
          { name: "Surtigas", path: "surtigas", type: "informe" },
          { name: "GDO", path: "gdo", type: "informe" },
          { name: "CEO", path: "ceo", type: "informe" },
        ],
      },
      {
        name: "Ejecución Aseguradora",
        iconPath: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z",
        path: "ejecucion-aseguradora",
        informes: [
          { name: "HDI", path: "hdi", type: "informe" },
          { name: "ALFA", path: "alfa", type: "informe" },
        ],
      },
      {
        name: "Revisión",
        iconPath: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z",
        path: "revision",
        type: "informe",
        informes: [
          { name: "Revisión Ejecución", path: "revision-ejecucion", type: "informe" },
          { name: "Revisión Cargue", path: "revision-cargue", type: "informe" },
        ],
      },
      {
        name: "Comercial",
        iconPath: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z",
        path: "comercial",
        informes: [
          { name: "Informe de Cargues", path: "informe-cargues", type: "informe" },
          { name: "Informe 360°", path: "informe360", type: "informe" },
        ],
      },
    ],
  },

  {
    name: "Inf. Inteligencia de Canales",
    iconPath: "M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z",
    path: "/IntelicenciaCanales",
    grupos: [
      {
        name: "Canal Digital",
        iconPath: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z",
        path: "canal-digital",
        informes: [
          { name: "Global", path: "digital-global", type: "informe" },
          { name: "Caribe", path: "digital-caribe", type: "informe" },
          { name: "Efigas", path: "digital-efigas", type: "informe" },
          { name: "GDO", path: "digital-gdo", type: "informe" },
          { name: "Surtigas", path: "digital-surtigas", type: "informe" },
        ],
      },
    ],
  },

  {
    name: "Inf. Ejecución Comercial",
    iconPath: "M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z",
    path: "/EjecucionComercial",
    grupos: [
      {
        name: "Ejecucion Distribuidora",
        iconPath: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z",
        path: "ejecucion-comercial-gaseras",
        informes: [
          { name: "Gases del Caribe", path: "comercial-caribe", type: "informe" },
          { name: "Gases de Occidente", path: "comercial-gdo", type: "informe" },
          { name: "Efigas", path: "comercial-efigas", type: "informe" },
          { name: "CEO", path: "comercial-ceo", type: "informe" },
          { name: "Surtigas", path: "comercial-surtigas", type: "informe" },
        ],
      },
      {
        name: "Ejecucion Aseguradora",
        iconPath: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z",
        path: "ejecucion-comercial-aseguradora",
        informes: [
          { name: "HDI", path: "comercial-hdi", type: "informe" },
          { name: "ALFA", path: "comercial-alfa", type: "informe" },
          { name: "IKE", path: "comercial-ike", type: "informe" }
        ],
      },
    ],
  },

  {
    name: "Inf. Experiencia al cliente",
    iconPath: "M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z",
    path: "/cx",
    grupos: [
      {
        name: "PQRS",
        iconPath: "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z",
        path: "pqrs",
        informes: [
          { name: "Vanti", path: "pqrs-vanti", type: "informe" },
          { name: "Promigas", path: "pqrs-promigas", type: "informe" },

        ],
      },
    ],
  },

  // 🔹 SECCIÓN INGESTA
  {
    name: "Ingesta de Datos",
    iconPath: "M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z",
    path: "/Ingesta",
    grupos: [
      {
        name: "Operaciones",
        iconPath: "M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h12v2H3zm0 4h8v2H3z",
        path: "ingesta-operaciones",
        informes: [
          { name: "Cierres de Distribuidora", path: "Ejecucion", type: "componente" },
        ],
      },
    ],
  },
];

