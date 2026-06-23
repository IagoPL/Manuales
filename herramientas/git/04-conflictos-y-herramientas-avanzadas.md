# Resolución de Conflictos y Herramientas Avanzadas

---

## Resolución de conflictos en Git

Los conflictos pueden ocurrir cuando dos ramas intentan modificar la misma parte de un archivo. Aprende cómo resolverlos:

### **Detectar Conflictos**
- Al fusionar o reorganizar, Git marcará las áreas conflictivas en los archivos.
  
### **Resolución Manual**
- Abre los archivos conflictivos en un editor de código y modifica manualmente las secciones en conflicto.
- Elimina las marcas de conflicto `<<<<<<<`, `=======`, y `>>>>>>>` una vez resuelto el conflicto.
- Realiza un `git add` y `git commit` para confirmar la resolución.

### **Herramientas de Resolución**
- Herramientas como `git mergetool` proporcionan una interfaz gráfica para ayudar en la resolución.

**Zona Clave**: Comprender cómo detectar, resolver y confirmar conflictos en Git.

---

## Uso de herramientas gráficas y GUI para Git

Si prefieres una interfaz gráfica en lugar de la línea de comandos, existen herramientas como Sourcetree, GitKraken y GitHub Desktop para gestionar proyectos Git.

### **Sourcetree**
- Ofrece una interfaz de usuario gráfica para ver el historial, cambios y conflictos.
- Permite ejecutar comandos Git directamente.

### **GitKraken**
- Proporciona una potente interfaz de usuario y herramientas de colaboración.
- Facilita la resolución de conflictos y la administración de ramas.

### **GitHub Desktop**
- Integrado con GitHub, es una excelente opción para colaboradores de proyectos en GitHub.

**Zona Clave**: Aprender a utilizar herramientas gráficas para trabajar con Git y facilitar la gestión de proyectos.

---

## Git stash: ocultar y recuperar cambios temporales

A veces, necesitas guardar temporalmente los cambios que estás realizando para cambiar de rama o resolver conflictos. El comando `git stash` es útil para esto.

### **Comandos Clave de Git Stash**
- **`git stash save "Mensaje"`**: Guarda los cambios actuales en un almacén temporal (stash) con un mensaje descriptivo.
- **`git stash list`**: Muestra una lista de todos los cambios guardados en el stash.
- **`git stash apply`**: Aplica el último stash a la rama actual.
- **`git stash pop`**: Aplica el último stash y lo elimina de la lista.

**Zona Clave**: Comprender cómo usar `git stash` para gestionar cambios temporales en Git.

---

## Bisect: depuración avanzada para encontrar problemas específicos

El comando `git bisect` es una herramienta útil para buscar rápidamente el commit que introdujo un problema.

### **Pasos para Usar `git bisect`**
1. Ejecuta `git bisect start` para iniciar la búsqueda binaria.
2. Etiqueta un commit como bueno y otro como malo.
3. Git seleccionará automáticamente un commit intermedio.
4. Prueba el commit y etiquétalo como bueno o malo.
5. Repite el proceso hasta encontrar el commit problemático.

**Zona Clave**: Aprender a utilizar `git bisect` para identificar problemas específicos en la historia de commits.

---

## Trabajo con submódulos y repositorios incrustados

Git permite trabajar con submódulos, que son repositorios Git anidados dentro de otro repositorio. Esto es útil para incluir proyectos externos en tu propio proyecto.

### **Pasos para Agregar un Submódulo**
1. Ejecuta `git submodule add URL ruta` para agregar un submódulo.
2. Confirma los cambios.
3. Otros desarrolladores pueden clonar y actualizar submódulos utilizando `git submodule init` y `git submodule update`.

**Zona Clave**: Aprender a trabajar con submódulos y cómo gestionarlos en tu proyecto.

---

## Ejemplo: Resolución de conflictos en Git

Supongamos que estás fusionando cambios de una rama de función en tu rama principal y se produce un conflicto en un archivo llamado `app.js`. Sigue estos pasos para resolver el conflicto:

1. Abre `app.js` en un editor de código.

2. Encuentra las secciones conflictivas marcadas entre `<<<<<<<`, `=======`, y `>>>>>>>`. Modifica el código para resolver el conflicto.

3. Elimina las marcas de conflicto `<<<<<<<`, `=======`, y `>>>>>>>` una vez que hayas resuelto el conflicto.

4. Ejecuta `git add app.js` para marcar el archivo como resuelto.

5. Realiza un commit para completar la resolución del conflicto:

   ```bash
   git commit -m "Resuelto conflicto en app.js"
   ```

6. Continúa con el flujo de trabajo, como fusionar la rama o realizar más cambios.

**Zona Clave**: Resolver conflictos rápidamente y con precisión es crucial para mantener un flujo de trabajo eficiente en proyectos colaborativos.

---

## Rebase interactivo para reordenar y combinar commits

El rebase interactivo permite limpiar el historial de commits al reordenarlos, combinarlos o editarlos.

### **Usando `git rebase -i`**
1. Ejecuta `git rebase -i HEAD~n` donde `n` es el número de commits recientes que deseas editar.
2. Se abrirá una lista de commits en tu editor de texto.
3. Cambia las palabras clave al inicio de cada línea:
   - `pick`: Mantener el commit como está.
   - `reword`: Editar el mensaje del commit.
   - `squash`: Combinar este commit con el anterior.
   - `edit`: Pausar en este commit para hacer cambios.
4. Guarda y cierra el editor para aplicar los cambios.

### **Precaución**
Usa rebase solo en commits que aún no se hayan compartido con otros colaboradores para evitar problemas.

**Zona Clave**: El rebase interactivo es una herramienta poderosa para mantener un historial limpio y legible.

---

## Hooks de Git: automatización de tareas

Los hooks de Git permiten ejecutar scripts automáticamente en respuesta a eventos como commits, merges, o pushes.

### **Ejemplo de Hooks**
- `pre-commit`: Ejecuta tareas antes de realizar un commit, como verificar el estilo de código.
- `post-merge`: Ejecuta scripts después de una fusión, como instalar dependencias.

### **Configurar un Hook**
1. Navega al directorio `.git/hooks/`.
2. Crea o edita un archivo de script correspondiente al evento, como `pre-commit`.
3. Asegúrate de que el script sea ejecutable:

   ```bash
   chmod +x .git/hooks/pre-commit
   ```

**Zona Clave**: Automatizar tareas comunes usando hooks mejora la productividad y reduce errores humanos.

---

## Reflog: recuperar referencias perdidas

El comando `git reflog` permite ver un registro de todas las acciones realizadas en el repositorio, incluso aquellas que no están en el historial visible.

### **Usos Comunes**
- Recuperar commits perdidos después de un reset o rebase.
- Identificar el HEAD de un estado previo.

### **Comandos Clave**
- `git reflog`: Muestra el registro de referencias.
- `git checkout <referencia>`: Mueve el HEAD a un estado previo basado en el reflog.

### **Ejemplo Práctico de `git reflog`**
1. Ejecuta un comando que cambie el estado del repositorio, como un `git reset`.
2. Si pierdes cambios accidentalmente, usa `git reflog` para encontrar el SHA del commit perdido.
3. Restaura el estado con `git checkout` o `git reset`.

**Zona Clave**: El reflog es una herramienta indispensable para recuperar cambios aparentemente perdidos.
