# 🎨 Guía de Referencia UI, Diseño y Accesibilidad Visual

Esta guía define los estándares visuales, cromáticos, tipográficos y de interacción de **MASHLE (Calendario Estudiantil)**, implementados en `src/styles/tokens.css`, `src/styles/index.css` y `src/components/boceto/boceto.css`.

---

## 1. 🔤 Tipografía y Escalabilidad Dinámica

- **Fuente Principal (`--font-family-base`):** `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif` (alta legibilidad en cuerpos de texto y tablas).
- **Fuente de Títulos (`--font-family-display`):** `'Outfit', 'Plus Jakarta Sans', sans-serif`.
- **Escalas Accesibles (Controladas desde `A11yControls`):**
  - **Normal (`A`):** `--font-size-root: 16px`
  - **Grande (`A+`):** Escalado proporcional del documento (`18px` / `112.5%`)
  - **Extragrande (`A++`):** Escalado máximo (`20px` / `125%`) sin romper la grilla del calendario ni los modales.

---

## 2. 🎨 Paleta de Colores y Modos Visuales (`tokens.css`)

### 2.1. Tema Estándar (Dark Premium — WCAG 2.1 AA)
| Token CSS | Valor Hex / RGBA | Uso Principal |
| :--- | :--- | :--- |
| `--bg-app` | `#090d16` | Fondo general de la aplicación |
| `--bg-surface` | `#111827` | Tarjetas, paneles y contenedores |
| `--bg-surface-elevated` | `#1f293d` | Modales, cabeceras de tabla y elementos elevados |
| `--bg-surface-hover` | `#28354f` | Estado hover de elementos interactivos |
| `--text-main` | `#f8fafc` | Texto primario de alto contraste |
| `--text-muted` | `#cbd5e1` | Texto secundario legible |
| `--primary-500` / `--primary-600` | `#3b82f6` / `#2563eb` | Acciones primarias y énfasis de marca |
| `--focus-ring-color` | `#38bdf8` | Anillo de foco de teclado (`3px solid`, `offset: 3px`) |

### 2.2. Modo Alto Contraste (WCAG 2.1 AAA — Ratio > 7:1)
Activado mediante el atributo `[data-high-contrast="true"]` en `<html>`:
- **Fondos:** Negro absoluto (`#000000`) y superficies `#0a0a0a`.
- **Textos y Bordes:** Blanco puro (`#ffffff`) y amarillo de alta visibilidad (`#ffff00` / `#fde047`).
- **Anillo de Foco:** Amarillo brillante de `4px` para localización visual inmediata.

### 2.3. Modos de Daltonismo (`[data-colorblind="..."]`)
El sistema soporta 4 adaptaciones cromáticas además del modo normal:
1. **`protanopia` (Deficiencia al rojo):** Sustituye rojos/verdes ambiguos por gamas azul cian, ámbar dorado y violeta distinguibles.
2. **`deuteranopia` (Deficiencia al verde):** Optimiza el contraste entre estados pendientes y completados con tonos azul real y ocre intenso.
3. **`tritanopia` (Deficiencia al azul/amarillo):** Ajusta los acentos hacia turquesa profundo, magenta y coral de alto contraste.
4. **`monocromatico` / `achromatopsia`:** Escala de grises de alto rango dinámico apoyada en patrones de borde (`dashed`, `double`, `solid`) e iconografía.

---

## 3. 🏷️ Triple Codificación en Estados de Tareas (No Dependencia del Color)

Cumpliendo el criterio **WCAG 1.4.1 (Uso del Color)**, ningún estado se transmite solo mediante color:

| Estado | Color Base (Tema Normal) | Ícono (`lucide-react`) | Borde / Patrón | Etiqueta Textual Explícita |
| :--- | :--- | :--- | :--- | :--- |
| **Pendiente** | Ámbar (`#f59e0b`) | `<Clock />` | Borde sólido/punteado ámbar | `"Pendiente"` / `"No la he realizado"` |
| **En Progreso** | Azul (`#3b82f6`) | `<PlayCircle />` | Borde azul | `"En Progreso"` |
| **Finalizada** | Esmeralda (`#10b981`) | `<CheckCircle2 />` | Borde esmeralda | `"Finalizada"` / `"Ya la realicé"` |
| **Alerta / Urgente** | Rojo (`#f87171`) | `<AlertTriangle />` | Borde rojo | `"Urgente"` / `"Vencida"` |

---

## 4. ⌨️ Estándares de Interacción y Componentes Accesibles

1. **Atajos Globales de Teclado (`App.jsx`):**
   - `Tab` / `Shift + Tab`: Navegación secuencial con `SkipLink` al primer `Tab`.
   - `Alt + N`: Abrir modal de nueva tarea (exclusivo Administrador; anuncia aviso audible si es estudiante).
   - `Alt + C`: Ir a pestaña **Calendario**.
   - `Alt + L`: Ir a pestaña **Tablero & Lista**.
   - `Alt + M`: Ir a pestaña **Materias & WhatsApp**.
   - `Escape`: Cerrar cualquier modal o diálogo activo y devolver el foco al botón disparador.
2. **Modales con `FocusTrap`:**
   - Todo modal (`TaskFormModal`, `GroupWarningDialog`, `SuccessionModal`, `A11yOnboardingModal`) atrapa el ciclo de tabulación y bloquea la fuga de foco al fondo.
3. **Enlaces a WhatsApp (`SubjectsDirectoryView`):**
   - Nunca se usan botones con solo un ícono mudo; incluyen texto visible y `aria-label` con el nombre exacto de la materia y docente.

---

## 5. 📐 Lineamientos Visuales del Apartado `/boceto` (`boceto.css`)

Para conservar la fidelidad académica de la comparativa **"Antes vs. Después"**:
- **Tipografía:** `Arial, Helvetica, sans-serif` (sin fuentes web estilizadas).
- **Paleta:** Fondo blanco/gris claro (`#f3f4f6`, `#ffffff`), bordes grises de `1px solid #9ca3af` y texto negro/gris oscuro (`#111827`).
- **Componentes:** Tablas HTML clásicas, botones rectangulares planos sin sombras ni gradientes, estados en texto plano entre corchetes (`[PENDIENTE]`, `[EN PROCESO]`, `[FINALIZADA]`) y **cero herramientas flotantes de accesibilidad**.
- **Nomenclatura limpia:** La interfaz de `/boceto` utiliza los títulos reales de la plataforma (*Calendario Estudiantil*, *Portal de Acceso para Estudiantes*), sin textos artificiales como "Modo Wireframe".
