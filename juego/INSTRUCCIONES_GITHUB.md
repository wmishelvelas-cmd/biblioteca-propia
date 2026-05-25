# 📤 Cómo subir a GitHub

## Opción 1: Desde línea de comandos (Recomendado)

### Requisitos:
- [Git](https://git-scm.com/) instalado
- Cuenta en [GitHub](https://github.com/)

### Pasos:

1. **Crea un repositorio en GitHub**
   - Ve a github.com y crea un nuevo repositorio
   - Nombra el repositorio (ej: `subway-surfers`)
   - No selecciones "Initialize with README" (ya lo tenemos)

2. **Abre la terminal** en la carpeta del proyecto

3. **Configura Git** (solo la primera vez):
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@example.com"
```

4. **Inicializa el repositorio local**:
```bash
git init
```

5. **Añade todos los archivos**:
```bash
git add .
```

6. **Crea el primer commit**:
```bash
git commit -m "Primer commit: Subway Surfers Game"
```

7. **Conecta con tu repositorio de GitHub** (reemplaza con tu URL):
```bash
git remote add origin https://github.com/TU_USUARIO/subway-surfers.git
```

8. **Sube los archivos** (rama main):
```bash
git branch -M main
git push -u origin main
```

¡Hecho! Tu juego está en GitHub 🎉

---

## Opción 2: Usando GitHub Desktop (Más fácil visualmente)

1. Descarga [GitHub Desktop](https://desktop.github.com/)
2. Inicia sesión con tu cuenta de GitHub
3. Ve a **File** → **Add Local Repository**
4. Selecciona la carpeta del proyecto
5. Publica el repositorio
6. Sube los cambios (Push)

---

## Opción 3: Drag & Drop (Más simple)

1. Crea un nuevo repositorio en GitHub
2. En la sección de archivos, haz drag & drop de tus archivos
3. Escribe un mensaje de commit
4. Sube los cambios

---

## 🌐 Habilitar GitHub Pages (Hosting gratuito)

Una vez subido a GitHub:

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** ⚙️
3. En el menú lateral, busca **Pages**
4. En **Source**, selecciona la rama **main**
5. Guarda cambios
6. ¡Espera un par de minutos!

Tu juego estará disponible en:
```
https://tu-usuario.github.io/subway-surfers
```

---

## 🔄 Actualizar después de cambios locales

Una vez tienes el repositorio:

```bash
# 1. Añade los cambios
git add .

# 2. Crea un commit con los cambios
git commit -m "Descripción de los cambios"

# 3. Sube a GitHub
git push
```

---

## 📝 Archivo .gitignore

El archivo `.gitignore` ya está configurado para ignorar:
- Carpeta `node_modules/`
- Archivos de IDE (.vscode, .idea)
- Archivos del SO (.DS_Store, Thumbs.db)

No necesitas modificarlo.

---

## ✅ Verificar todo está bien

Después de hacer push, comprueba:
1. ✅ Los archivos aparecen en GitHub
2. ✅ GitHub Pages está habilitado
3. ✅ Puedes ver el juego en la URL de GitHub Pages

¡Listo! Tu juego está en GitHub y es accesible desde cualquier navegador 🚀
