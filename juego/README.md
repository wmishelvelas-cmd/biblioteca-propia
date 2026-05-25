# 🎮 Subway Surfers - Juego Web

Un juego tipo **Subway Surfers** completamente funcional, creado con HTML5 Canvas, CSS3 y JavaScript vanilla. ¡Corre por las vías del metro y esquiva obstáculos!

## 🚀 Características

✅ **Gameplay realista** - Similar al Subway Surfers original  
✅ **Gráficos detallados** - Personaje, trenes, monedas y power-ups  
✅ **Sistema de dificultad progresiva** - Aumenta la velocidad con los niveles  
✅ **Monedas y power-ups** - Escudo temporal y velocidad máxima  
✅ **Controles intuitivos** - Teclado y táctil (móvil)  
✅ **Puntuación en tiempo real** - Seguimiento de puntos, monedas y nivel  

## 📋 Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- (Opcional) Node.js 14+ para ejecutar un servidor local

## 🎯 Instalación y Uso

### Opción 1: Abrir directamente (Más simple)
1. Descarga o clona el repositorio
2. Abre el archivo `index.html` en tu navegador
3. ¡A jugar! 🎮

### Opción 2: Ejecutar con servidor local (Node.js)
1. Clona el repositorio:
```bash
git clone https://github.com/TU_USUARIO/subway-surfers.git
cd subway-surfers
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor:
```bash
npm start
```

4. Abre tu navegador en `http://localhost:3000`

### Opción 3: GitHub Pages (Hosting gratuito)
1. Sube el repositorio a GitHub
2. Ve a **Settings** → **Pages**
3. Selecciona **main** como rama
4. ¡Tu juego estará disponible en `https://tu-usuario.github.io/subway-surfers`

## 🎮 Controles

### Teclado:
- **⬅️ Flecha Izquierda** - Carril izquierdo
- **➡️ Flecha Derecha** - Carril derecho
- **⬆️ Flecha Arriba** - Saltar
- **⬇️ Flecha Abajo** - Deslizarse

### Móvil/Táctil:
- **Desliza izquierda/derecha** - Cambiar carril
- **Desliza arriba** - Saltar
- **Desliza abajo** - Deslizarse

## 📁 Estructura de archivos

```
subway-surfers/
├── index.html          # Archivo principal HTML
├── styles.css          # Estilos del juego
├── game.js             # Lógica del juego
├── server.js           # Servidor Node.js (opcional)
├── package.json        # Dependencias (opcional)
├── README.md           # Este archivo
└── .gitignore          # Archivos a ignorar en Git
```

## 🎨 Características del Juego

### Personaje
- Personaje realista con detalles (cabeza, ojos, cuerpo, piernas)
- Animación de salto y deslizamiento

### Obstáculos
- **Trenes**: Vagones con detalles realistas y ventanas
- **Barras metálicas**: Obstáculos sobre las vías

### Items
- **Monedas**: Recolecta para puntos bonus
- **Power-ups**: 
  - 🛡️ **Escudo**: Protección temporal
  - ⚡ **Velocidad**: Impulso de velocidad temporal

### Progresión
- Sistema de niveles basado en distancia recorrida
- Dificultad aumenta progresivamente
- Puntuación, monedas y nivel en tiempo real

## 🔧 Personalización

Puedes modificar los siguientes parámetros en `game.js`:

```javascript
let maxGameSpeed = 8;        // Velocidad máxima del juego
let gameSpeed = 3;           // Velocidad inicial
```

## 📱 Compatibilidad

- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablets
- ✅ Móviles
- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🐛 Problemas Conocidos

- En dispositivos muy antiguos puede haber lag
- Algunos navegadores antiguos pueden no soportar Canvas

## 📝 Licencia

Este proyecto es de código abierto y libre para usar, modificar y distribuir.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de:
- Reportar bugs
- Sugerir nuevas características
- Mejorar el código

## 👨‍💻 Autor

Creado con ❤️ para disfrutar del juego clásico Subway Surfers

---

**¡Diviértete jugando!** 🚀
