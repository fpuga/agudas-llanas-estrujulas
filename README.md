# 🎓 Entrenador de Palabras (Agudas, Llanas y Esdrújulas)

Una aplicación web interactiva diseñada para ayudar a los niños a practicar y dominar la acentuación en español de forma divertida.

![Estado](https://img.shields.io/badge/Estado-Completado-green)
![Tecnología](https://img.shields.io/badge/Stack-React%20%7C%20TypeScript%20%7C%20Tailwind%20v4-blue)

## ✨ Características

### 🎮 Juegos Interactivos
*   **🔍 Detective de Sílabas**: Identifica la sílaba tónica de una palabra.
*   **📦 El Clasificador**: Arrastra o selecciona si una palabra es Aguda, Llana o Esdrújula.
*   **🧪 Laboratorio de Palabras**: Ordena las sílabas desordenadas para formar la palabra correcta.
*   **🎲 Modo Aleatorio**: Una sesión dinámica de 15 rondas (configurable) que mezcla todos los juegos para un entrenamiento rápido.

### 📚 Herramientas de Estudio
*   **📖 La Pizarra**: Explicaciones visuales claras y sencillas sobre las reglas de acentuación.
*   **🖨️ Generador de Fichas**: Crea PDFs optimizados para impresión (blanco y negro) con ejercicios aleatorios para trabajar en papel.

### ⚙️ Gestión y Personalización
*   **Banco de Palabras**: Más de 60 palabras incluidas, extraídas de ejercicios reales.
*   **Editor**: Añade tus propias palabras desde el panel de administración.
*   **Persistencia Local**: Guarda y carga tus listas de palabras usando archivos JSON locales (sin necesidad de bases de datos ni internet).
*   **Personalización**: Saludo personalizado para el alumno.

## 🚀 Instalación y Uso

### Requisitos
*   [Node.js](https://nodejs.org/) (versión 18 o superior recomendada).

### Pasos
1.  **Clonar/Descargar** el proyecto.
2.  **Instalar dependencias**:
    ```bash
    npm install
    ```
3.  **Iniciar la aplicación**:
    ```bash
    npm run dev
    ```
4.  Abrir en el navegador: `http://localhost:5173`

### 🏠 Uso en Red Local (Tablet/Móvil)
La aplicación está configurada para ser accesible desde otros dispositivos en tu red WiFi.
1.  Ejecuta `npm run dev` en tu ordenador.
2.  Busca la línea `Network:` en la terminal para ver tu IP local (ej: `http://192.168.1.xx:5173`).
3.  Introduce esa dirección en el navegador de tu tablet o móvil.

## 🛠️ Configuración

Puedes personalizar ciertos aspectos editando el archivo `.env`:

```env
# Nombre del alumno para el saludo y las fichas
VITE_USER_NAME='Tu nombre'

# Número de rondas en el Modo Aleatorio
VITE_DEFAULT_ROUNDS=15
```

## 🧪 Tests

El proyecto incluye tests unitarios y de extremo a extremo (E2E) para asegurar la calidad.

*   **Tests Unitarios** (lógica de silabeo):
    ```bash
    npm run test
    ```
*   **Tests E2E** (simulación de usuario):
    ```bash
    npx playwright test
    ```

## 📂 Estructura del Proyecto

*   `src/components`: Componentes de React (Juegos, Paneles, UI).
*   `src/data`: Archivo `words.json` con el vocabulario inicial.
*   `src/hooks`: Lógica de gestión de estado (`useWordStore`).
*   `src/utils`: Utilidades para silabeo (`syllable-parser`) y sonido.
*   `tests`: Tests E2E con Playwright.

---
Hecho con ❤️ para aprender jugando.
